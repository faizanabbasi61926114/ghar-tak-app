import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListConversationMessagesQueryKey,
  getListConversationsQueryKey,
  useListConversationMessages,
  useListConversations,
  useMarkConversationRead,
  useSendConversationMessage,
  type ConversationListItem,
} from "@workspace/api-client-react";import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ConversationsList, {
  conversationCounterpart,
  conversationUnread,
  timeAgo,
} from "@/components/shared/ConversationsList";
import { ArrowLeft, Loader2, MessageSquare, Send, Store } from "lucide-react";

function selectedConversationFrom(list: ConversationListItem[] | undefined, id: string | null) {
  if (!id || !Array.isArray(list)) return undefined;
  return list.find((c) => c.id === id);
}

export default function MessagesPage() {
  const { user, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const search = useSearch();
  const selectedId = new URLSearchParams(search).get("c");

  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = useListConversations({
    query: { queryKey: getListConversationsQueryKey(), enabled: !!user, refetchInterval: 5000 },
  });
  const conversations = Array.isArray(conversationsQuery.data) ? conversationsQuery.data : [];

  const selected = selectedConversationFrom(conversations, selectedId);

  const threadQuery = useListConversationMessages(selectedId ?? "", {
    query: {
      queryKey: getListConversationMessagesQueryKey(selectedId ?? ""),
      enabled: !!user && !!selectedId,
      refetchInterval: 3000,
    },
  });
  const thread = Array.isArray(threadQuery.data) ? threadQuery.data : [];

  const markRead = useMarkConversationRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      },
    },
  });

  const sendMessage = useSendConversationMessage({
    mutation: {
      onSuccess: (_data, variables) => {
        setDraft("");
        queryClient.invalidateQueries({ queryKey: getListConversationMessagesQueryKey(variables.conversationId) });
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Message failed", description: error.message });
      },
    },
  });

  useEffect(() => {
    if (!selectedId || !selected) return;
    if (conversationUnread(selected) > 0 && !markRead.isPending) {
      markRead.mutate({ conversationId: selectedId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selected?.unreadCountUser, selected?.unreadCountProvider]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length, selectedId]);

  if (isLoaded && !user) {
    return (
      <div className="text-center py-20 space-y-4">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign in to view your messages</h1>
        <p className="text-muted-foreground">Chat with local stores and service providers.</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    const content = draft.trim();
    if (!content || !selectedId || sendMessage.isPending) return;
    sendMessage.mutate({ conversationId: selectedId, data: { content } });
  };

  const counterpart = selected ? conversationCounterpart(selected) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold font-headline">Messages</h1>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 items-start">
        <Card className={`overflow-hidden ${selectedId ? "hidden md:block" : ""}`}>
          {conversationsQuery.isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No conversations yet.</p>
              <p className="text-sm text-muted-foreground">
                Visit a store and tap <span className="font-medium">Message</span> to start chatting.
              </p>
              <Button asChild variant="outline">
                <Link href="/stores">Browse Stores</Link>
              </Button>
            </div>
          ) : (
            <ConversationsList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={(id) => navigate(`/messages?c=${id}`)}
            />
          )}
        </Card>

        <Card className={`overflow-hidden ${selectedId ? "" : "hidden md:block"}`}>
          {!selectedId ? (
            <div className="text-center py-20 px-4 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3" />
              Select a conversation to start chatting.
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100dvh-16rem)] md:h-[calc(100dvh-14rem)]">
              <div className="flex items-center gap-3 px-4 py-3 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => navigate("/messages")}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                {counterpart && (
                  <>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={counterpart.avatarUrl ?? undefined} />
                      <AvatarFallback>{(counterpart.name[0] ?? "?").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{counterpart.name}</p>
                      {selected?.lastMessageAt && (
                        <p className="text-xs text-muted-foreground">
                          Last active {timeAgo(selected.lastMessageAt)}
                        </p>
                      )}
                    </div>
                    {selected && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/stores/${selected.providerId}`}>
                          <Store className="h-4 w-4 mr-1" />
                          View Store
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {threadQuery.isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : thread.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Say salam! Send the first message.</p>
                ) : (
                  thread.map((message) => {
                    const mine = message.senderId === user?.id;
                    return (
                      <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            mine
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          {!mine && message.senderName && (
                            <p className="text-xs font-medium opacity-70 mb-0.5">{message.senderName}</p>
                          )}
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}>
                            {new Date(message.createdAt).toLocaleTimeString("en-PK", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t p-3">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message…"
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!draft.trim() || sendMessage.isPending}
                    aria-label="Send message"
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

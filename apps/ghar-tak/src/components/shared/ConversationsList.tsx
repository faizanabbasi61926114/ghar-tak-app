import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ConversationListItem } from "@workspace/api-client-react";

export function conversationCounterpart(conversation: ConversationListItem) {
  return conversation.viewerRole === "user"
    ? { name: conversation.providerName ?? "Store", avatarUrl: conversation.providerAvatar }
    : { name: conversation.userName ?? "Customer", avatarUrl: conversation.userAvatar };
}

export function conversationUnread(conversation: ConversationListItem): number {
  return conversation.viewerRole === "user"
    ? conversation.unreadCountUser
    : conversation.unreadCountProvider;
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric" });
}

interface ConversationsListProps {
  conversations: ConversationListItem[];
  selectedId?: string | null;
  onSelect: (conversationId: string) => void;
}

export default function ConversationsList({ conversations, selectedId, onSelect }: ConversationsListProps) {
  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        const counterpart = conversationCounterpart(conversation);
        const unread = conversationUnread(conversation);
        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
              selectedId === conversation.id ? "bg-muted" : ""
            }`}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={counterpart.avatarUrl ?? undefined} />
              <AvatarFallback>{(counterpart.name[0] ?? "?").toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{counterpart.name}</span>
                {conversation.lastMessageAt && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {timeAgo(conversation.lastMessageAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage ?? "No messages yet"}
                </span>
                {unread > 0 && (
                  <Badge className="h-5 min-w-5 flex items-center justify-center px-1 text-xs flex-shrink-0">
                    {unread > 99 ? "99+" : unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

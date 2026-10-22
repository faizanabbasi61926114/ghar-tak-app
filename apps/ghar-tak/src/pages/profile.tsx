import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { useListMyOrders, useGetMe, useUpdateMe } from "@workspace/api-client-react";
import {
  User,
  Edit3,
  MapPin,
  Settings,
  LogIn,
  Loader2,
  Camera,
  Grid3X3,
  Bookmark,
  Package,
  Bell,
  Shield,
  Trash2,
  Plus,
  X,
  Star,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { data: dbUser, isLoading: dbUserLoading } = useGetMe({ query: { enabled: !!user, queryKey: ["getMe"] } });
  const updateMeMutation = useUpdateMe();
  const { data: ordersData, isLoading: ordersLoading } = useListMyOrders({ query: { enabled: !!user, queryKey: ["listMyOrders"] } });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: "",
    phone: "",
  });

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("posts");

  const favorites: any[] = [];
  const postsCount = gallery.length;
  const savedCount = savedItems.length;
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const ordersCount = orders.length;

  const handleEditClick = () => {
    setEditForm({
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || dbUser?.name || ""),
      phone: dbUser?.phone || "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateMeMutation.mutate(
      { data: { name: editForm.name, phone: editForm.phone } },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!isLoaded || (user && dbUserLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        <LogIn className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-2xl font-bold font-headline mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6 max-w-md">You need to be signed in to view your profile.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cover Photo */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 bg-muted group">
        <img src="https://placehold.co/1200x400.png?text=Cover+Photo" alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="secondary" size="sm" onClick={() => coverInputRef.current?.click()}>
            <Camera className="h-4 w-4 mr-2" /> Change Cover
          </Button>
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 px-4 relative z-10">
        <div className="relative group">
          <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
            <AvatarImage src={user.imageUrl} alt={user.firstName || 'User'} />
            <AvatarFallback className="text-2xl">{user.firstName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 pb-2">
          <h1 className="text-2xl font-bold font-headline">{user.firstName} {user.lastName}</h1>
          <p className="text-muted-foreground text-sm">{user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{dbUser?.phone || "No phone added"}</span>
          </div>
        </div>

        <div className="flex gap-2 pb-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Display Name</Label>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveProfile} disabled={updateMeMutation.isPending}>
                  {updateMeMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center gap-8 py-4 border-y">
        <div className="text-center">
          <div className="text-xl font-bold">{postsCount}</div>
          <div className="text-sm text-muted-foreground">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{savedCount}</div>
          <div className="text-sm text-muted-foreground">Saved</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{ordersCount}</div>
          <div className="text-sm text-muted-foreground">Orders</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{favorites.length}</div>
          <div className="text-sm text-muted-foreground">Favorites</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="posts">
            <Grid3X3 className="h-4 w-4 mr-2" /> Posts
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-2" /> Saved
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" /> Orders
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No photos yet. Share your local finds!</p>
            </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No saved items yet. Browse and bookmark your favorites!</p>
            </div>
        </TabsContent>

        {/* Orders */}
        <TabsContent value="orders" className="mt-6">
          <h2 className="text-lg font-semibold font-headline mb-4">Order History</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet. Start exploring local stores!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{order.providerName}</h3>
                        <Badge className={statusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-medium">PKR {order.total}</span>
                        <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-lg mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Push Notifications</p>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

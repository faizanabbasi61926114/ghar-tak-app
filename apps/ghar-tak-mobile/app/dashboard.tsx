import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  sku: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  description: string;
  duration: string;
}

interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

interface Enquiry {
  id: string;
  customer: string;
  subject: string;
  date: string;
  status: "Pending" | "Replied" | "Closed";
  message: string;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "New" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  paymentMethod: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Basmati Rice (5kg)", price: 1200, stock: 50, description: "Premium basmati rice", category: "Groceries", sku: "RICE-5KG" },
  { id: "p2", name: "Cooking Oil (1L)", price: 450, stock: 30, description: "Pure vegetable oil", category: "Groceries", sku: "OIL-1L" },
  { id: "p3", name: "Mobile Charger", price: 800, stock: 100, description: "Fast charger 18W", category: "Electronics", sku: "CHG-18W" },
];

const INITIAL_SERVICES: Service[] = [
  { id: "s1", name: "Mobile Screen Repair", category: "Tech Repair", priceRange: "PKR 1000-5000", description: "Screen replacement for all brands", duration: "1-2 hours" },
  { id: "s2", name: "Basic Plumbing Fix", category: "Plumber", priceRange: "PKR 500-2000", description: "Leak fixes, pipe repairs", duration: "30 min - 1 hour" },
];

const INITIAL_REVIEWS: Review[] = [
  { id: "r1", customer: "Aisha K.", rating: 5, comment: "Great service, very fast!", date: "2024-07-15" },
  { id: "r2", customer: "Bilal M.", rating: 4, comment: "Good products, reasonable prices.", date: "2024-07-14" },
  { id: "r3", customer: "Fatima Z.", rating: 5, comment: "Best store in the area, highly recommended!", date: "2024-07-13" },
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  { id: "e1", customer: "Fatima Z.", subject: "Bulk order discount?", date: "2024-07-16", status: "Pending", message: "Do you offer discounts for bulk orders of 50+ items?" },
  { id: "e2", customer: "Omar S.", subject: "Do you stock item X?", date: "2024-07-15", status: "Replied", message: "Looking for a specific brand of rice." },
];

const INITIAL_GALLERY: GalleryImage[] = [
  { id: "g1", url: "https://placehold.co/400x300.png?text=Store+Front", alt: "Store Front" },
  { id: "g2", url: "https://placehold.co/400x300.png?text=Product+Display", alt: "Product Display" },
  { id: "g3", url: "https://placehold.co/400x300.png?text=Service+Area", alt: "Service Area" },
];

const INITIAL_MENU: MenuItem[] = [
  { id: "m1", name: "Chicken Biryani", price: 350, description: "Classic chicken biryani with raita", category: "Main Course" },
  { id: "m2", name: "Vegetable Karahi", price: 280, description: "Mixed vegetable curry", category: "Main Course" },
  { id: "m3", name: "Naan", price: 40, description: "Fresh tandoori naan", category: "Bread" },
];

const INITIAL_ORDERS: Order[] = [
  { id: "o1", customer: "Aisha K.", items: "Basmati Rice x2, Cooking Oil x1", total: 2850, status: "New", date: "2024-07-20", paymentMethod: "Cash on Delivery" },
  { id: "o2", customer: "Bilal M.", items: "Mobile Charger x1", total: 800, status: "Processing", date: "2024-07-19", paymentMethod: "JazzCash" },
  { id: "o3", customer: "Fatima Z.", items: "Screen Repair Service", total: 2500, status: "Shipped", date: "2024-07-18", paymentMethod: "Cash on Delivery" },
  { id: "o4", customer: "Omar S.", items: "Plumbing Fix", total: 1200, status: "Delivered", date: "2024-07-17", paymentMethod: "EasyPaisa" },
];

const STATUS_COLORS: Record<string, string> = {
  New: "#3b82f6",
  Processing: "#f59e0b",
  Shipped: "#8b5cf6",
  Delivered: "#22c55e",
  Cancelled: "#ef4444",
  Pending: "#f59e0b",
  Replied: "#22c55e",
  Closed: "#71717a",
};

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const { user } = useAuth();

  const [businessDetails, setBusinessDetails] = useState({
    name: "Ahmed's General Store",
    avatarUrl: "https://placehold.co/100x100.png",
    coverUrl: "https://placehold.co/800x300.png?text=Store+Banner",
    address: "123 Main Street, Saddar, Karachi",
    phone: "+92 300 1234567",
    description: "Your one-stop shop for daily needs and quick repairs.",
    isOpen: true,
    rating: 4.7,
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [gallery, setGallery] = useState<GalleryImage[]>(INITIAL_GALLERY);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [activeSection, setActiveSection] = useState<
    "overview" | "products" | "services" | "menu" | "orders" | "reviews" | "gallery" | "analytics"
  >("overview");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", stock: "", description: "", category: "", sku: "" });

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: "", category: "", priceRange: "", description: "", duration: "" });

  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState({ name: "", price: "", description: "", category: "" });

  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingEnquiry, setReplyingEnquiry] = useState<string | null>(null);

  const totalRevenue = orders.filter((o) => o.status !== "Cancelled").reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.filter((o) => o.status !== "Cancelled").length;
  const totalProducts = products.length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const styles = useThemedStyles(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: isWeb ? 67 : insets.top + 12,
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 14,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    title: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold", flex: 1 },
    scroll: { flex: 1 },
    content: { padding: 16 },

    // Cover + profile
    coverWrap: { position: "relative" as const, borderRadius: 14, overflow: "hidden", marginBottom: 12 },
    coverImage: { width: "100%" as const, height: 160, backgroundColor: colors.secondary },
    avatarWrap: {
      position: "absolute" as const,
      bottom: -24,
      left: 16,
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 4,
      borderColor: colors.background,
      overflow: "hidden",
      backgroundColor: colors.secondary,
    },
    avatarImage: { width: "100%" as const, height: "100%" as const },
    openBadge: {
      position: "absolute" as const,
      top: 12,
      right: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    openBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#fff" },

    businessInfo: { marginTop: 28, paddingHorizontal: 4 },
    businessName: { fontSize: 20, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    businessMeta: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 4 },
    businessDesc: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 8, lineHeight: 20 },
    editBtn: {
      marginTop: 12,
      alignSelf: "flex-start" as const,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    editBtnText: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium" },

    // Stats
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
    statCard: {
      width: "48%" as const,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    statValue: { fontSize: 22, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    statLabel: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },

    // Section nav
    sectionNav: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 20,
      marginBottom: 4,
    },
    navChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    navChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    navChipText: { fontSize: 12, color: colors.foreground, fontFamily: "Inter_500Medium" },
    navChipTextActive: { color: "#fff" },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 12,
      marginTop: 8,
    },

    // Cards
    card: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    cardTitle: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", flex: 1 },
    cardSubtitle: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 },
    cardDesc: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular", marginTop: 6 },
    cardPrice: { fontSize: 15, fontWeight: "700" as const, color: colors.primary, fontFamily: "Inter_700Bold", marginTop: 6 },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      alignSelf: "flex-start" as const,
    },
    badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
    cardActions: { flexDirection: "row", gap: 8, marginTop: 10 },
    actionBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    actionBtnText: { fontSize: 12, color: colors.foreground, fontFamily: "Inter_500Medium" },
    dangerBtn: {
      backgroundColor: colors.destructive + "20",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    dangerBtnText: { fontSize: 12, color: colors.destructive, fontFamily: "Inter_500Medium" },

    // Order
    orderCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    orderId: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    orderTotal: { fontSize: 15, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    orderItems: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 4 },
    orderDate: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 },
    orderStatusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    orderStatusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
    statusPicker: {
      flexDirection: "row",
      gap: 6,
      marginTop: 10,
      flexWrap: "wrap",
    },
    statusOption: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "15",
    },
    statusOptionText: { fontSize: 11, color: colors.foreground, fontFamily: "Inter_500Medium" },
    statusOptionTextActive: { color: colors.primary },

    // Review
    reviewHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
    reviewAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    reviewAvatarText: { fontSize: 12, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    reviewName: { fontSize: 13, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold" },
    reviewDate: { fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    reviewStars: { flexDirection: "row", marginTop: 4 },
    reviewComment: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular", marginTop: 6 },
    reviewReply: {
      marginTop: 8,
      padding: 10,
      backgroundColor: colors.secondary,
      borderRadius: 10,
    },
    reviewReplyLabel: { fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginBottom: 2 },
    reviewReplyText: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular" },

    // Enquiry
    enquiryHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
    enquirySubject: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginTop: 2 },
    enquiryMessage: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_400Regular", marginTop: 6 },

    // Gallery
    galleryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    galleryItem: {
      width: "31%" as const,
      aspectRatio: 1,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.secondary,
      position: "relative" as const,
    },
    galleryImage: { width: "100%" as const, height: "100%" as const },
    galleryOverlay: {
      position: "absolute" as const,
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
    },

    // Forms
    formWrap: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formLabel: { fontSize: 12, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
    formInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 10,
    },
    formArea: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 10,
      height: 80,
      textAlignVertical: "top" as const,
    },
    formRow: { flexDirection: "row", gap: 10 },
    formRowItem: { flex: 1 },
    formBtn: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 4,
    },
    formBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
    formCancelBtn: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 8,
    },
    formCancelBtnText: { color: colors.foreground, fontSize: 14, fontFamily: "Inter_600SemiBold" },

    // Analytics
    analyticsCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    analyticsTitle: { fontSize: 14, fontWeight: "600" as const, color: colors.foreground, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
    analyticsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    analyticsLabel: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    analyticsValue: { fontSize: 14, fontWeight: "700" as const, color: colors.foreground, fontFamily: "Inter_700Bold" },
    progressBar: {
      height: 6,
      backgroundColor: colors.secondary,
      borderRadius: 3,
      marginBottom: 10,
      overflow: "hidden",
    },
    progressFill: { height: 6, borderRadius: 3 },
    insightRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 10,
      marginBottom: 6,
    },

    footer: { height: isWeb ? 34 : insets.bottom + 20 },
  }));

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) return;
    const product: Product = {
      id: `p-${Date.now()}`,
      name: productForm.name,
      price: Number(productForm.price),
      stock: Number(productForm.stock) || 0,
      description: productForm.description,
      category: productForm.category || "General",
      sku: productForm.sku || `SKU-${Date.now()}`,
    };
    setProducts((p) => [...p, product]);
    setProductForm({ name: "", price: "", stock: "", description: "", category: "", sku: "" });
    setShowProductForm(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts((p) => p.map((x) => (x.id === editingProduct.id ? editingProduct : x)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((p) => p.filter((x) => x.id !== id));
  };

  const handleAddService = () => {
    if (!serviceForm.name || !serviceForm.priceRange) return;
    const service: Service = {
      id: `s-${Date.now()}`,
      name: serviceForm.name,
      category: serviceForm.category || "General",
      priceRange: serviceForm.priceRange,
      description: serviceForm.description,
      duration: serviceForm.duration,
    };
    setServices((s) => [...s, service]);
    setServiceForm({ name: "", category: "", priceRange: "", description: "", duration: "" });
    setShowServiceForm(false);
  };

  const handleEditService = () => {
    if (!editingService) return;
    setServices((s) => s.map((x) => (x.id === editingService.id ? editingService : x)));
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices((s) => s.filter((x) => x.id !== id));
  };

  const handleAddMenuItem = () => {
    if (!menuForm.name || !menuForm.price) return;
    const item: MenuItem = {
      id: `m-${Date.now()}`,
      name: menuForm.name,
      price: Number(menuForm.price),
      description: menuForm.description,
      category: menuForm.category || "General",
    };
    setMenuItems((m) => [...m, item]);
    setMenuForm({ name: "", price: "", description: "", category: "" });
    setShowMenuForm(false);
  };

  const handleEditMenuItem = () => {
    if (!editingMenuItem) return;
    setMenuItems((m) => m.map((x) => (x.id === editingMenuItem.id ? editingMenuItem : x)));
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((m) => m.filter((x) => x.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((o) => o.map((x) => (x.id === orderId ? { ...x, status } : x)));
  };

  const handleReplyToReview = (reviewId: string) => {
    if (!replyText.trim()) return;
    setReviews((r) => r.map((x) => (x.id === reviewId ? { ...x, reply: replyText } : x)));
    setReplyText("");
    setReplyingTo(null);
  };

  const handleReplyToEnquiry = (enquiryId: string) => {
    if (!replyText.trim()) return;
    setEnquiries((e) => e.map((x) => (x.id === enquiryId ? { ...x, status: "Replied" as const, message: replyText } : x)));
    setReplyText("");
    setReplyingEnquiry(null);
  };

  const handleDeleteGalleryImage = (id: string) => {
    setGallery((g) => g.filter((x) => x.id !== id));
  };

  const handleToggleOpen = () => {
    setBusinessDetails((b) => ({ ...b, isOpen: !b.isOpen }));
  };

  const renderSectionNav = () => (
    <View style={styles.sectionNav}>
      {[
        { key: "overview", label: "Overview" },
        { key: "products", label: "Products" },
        { key: "services", label: "Services" },
        { key: "menu", label: "Menu" },
        { key: "orders", label: "Orders" },
        { key: "reviews", label: "Reviews" },
        { key: "gallery", label: "Gallery" },
        { key: "analytics", label: "Analytics" },
      ].map((s) => (
        <Pressable
          key={s.key}
          style={[styles.navChip, activeSection === (s.key as any) && styles.navChipActive]}
          onPress={() => setActiveSection(s.key as any)}
        >
          <Text style={[styles.navChipText, activeSection === (s.key as any) && styles.navChipTextActive]}>{s.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderOverview = () => (
    <>
      <View style={styles.coverWrap}>
        <Image
          source={{ uri: businessDetails.coverUrl }}
          style={styles.coverImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
        <View style={[styles.openBadge, { backgroundColor: businessDetails.isOpen ? "#22c55e" : "#ef4444" }]}>
          <Text style={styles.openBadgeText}>{businessDetails.isOpen ? "Open" : "Closed"}</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: businessDetails.avatarUrl }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
          />
        </View>
      </View>

      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{businessDetails.name}</Text>
        <Text style={styles.businessMeta}>{businessDetails.address} • {businessDetails.phone}</Text>
        <Text style={styles.businessDesc}>{businessDetails.description}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable style={styles.editBtn} onPress={handleToggleOpen}>
            <Feather name={businessDetails.isOpen ? "check-circle" : "x-circle"} size={14} color={businessDetails.isOpen ? "#22c55e" : "#ef4444"} />
            <Text style={styles.editBtnText}>{businessDetails.isOpen ? "Open" : "Closed"}</Text>
          </Pressable>
          <Pressable style={styles.editBtn} onPress={() => router.push("/" as any)}>
            <Feather name="shopping-cart" size={14} color={colors.foreground} />
            <Text style={styles.editBtnText}>Switch to Buying</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: "#22c55e" }]}>
          <Text style={styles.statValue}>PKR {totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: "#3b82f6" }]}>
          <Text style={styles.statValue}>{totalOrders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: "#8b5cf6" }]}>
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: "#f59e0b" }]}>
          <Text style={styles.statValue}>{avgRating}</Text>
          <Text style={styles.statLabel}>Rating ({reviews.length})</Text>
        </View>
      </View>
    </>
  );

  const renderProducts = () => (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Product Catalog</Text>
        <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => { setShowProductForm(true); setEditingProduct(null); }}>
          <Text style={[styles.actionBtnText, { color: "#fff" }]}>+ Add</Text>
        </Pressable>
      </View>

      {showProductForm && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={productForm.name} onChangeText={(t) => setProductForm({ ...productForm, name: t })} placeholder="Product name" placeholderTextColor={colors.mutedForeground} />
          <View style={styles.formRow}>
            <View style={styles.formRowItem}>
              <Text style={styles.formLabel}>Price</Text>
              <TextInput style={styles.formInput} value={productForm.price} onChangeText={(t) => setProductForm({ ...productForm, price: t })} placeholder="200" keyboardType="numeric" placeholderTextColor={colors.mutedForeground} />
            </View>
            <View style={styles.formRowItem}>
              <Text style={styles.formLabel}>Stock</Text>
              <TextInput style={styles.formInput} value={productForm.stock} onChangeText={(t) => setProductForm({ ...productForm, stock: t })} placeholder="50" keyboardType="numeric" placeholderTextColor={colors.mutedForeground} />
            </View>
          </View>
          <Text style={styles.formLabel}>Category</Text>
          <TextInput style={styles.formInput} value={productForm.category} onChangeText={(t) => setProductForm({ ...productForm, category: t })} placeholder="Groceries" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>SKU</Text>
          <TextInput style={styles.formInput} value={productForm.sku} onChangeText={(t) => setProductForm({ ...productForm, sku: t })} placeholder="SKU-001" placeholderTextColor={colors.mutedForeground} />
          <Pressable style={styles.formBtn} onPress={handleAddProduct}>
            <Text style={styles.formBtnText}>Add Product</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setShowProductForm(false)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {editingProduct && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={editingProduct.name} onChangeText={(t) => setEditingProduct({ ...editingProduct, name: t })} />
          <View style={styles.formRow}>
            <View style={styles.formRowItem}>
              <Text style={styles.formLabel}>Price</Text>
              <TextInput style={styles.formInput} value={String(editingProduct.price)} onChangeText={(t) => setEditingProduct({ ...editingProduct, price: Number(t) || 0 })} keyboardType="numeric" />
            </View>
            <View style={styles.formRowItem}>
              <Text style={styles.formLabel}>Stock</Text>
              <TextInput style={styles.formInput} value={String(editingProduct.stock)} onChangeText={(t) => setEditingProduct({ ...editingProduct, stock: Number(t) || 0 })} keyboardType="numeric" />
            </View>
          </View>
          <Text style={styles.formLabel}>Description</Text>
          <TextInput style={styles.formArea} value={editingProduct.description} onChangeText={(t) => setEditingProduct({ ...editingProduct, description: t })} multiline />
          <Pressable style={styles.formBtn} onPress={handleEditProduct}>
            <Text style={styles.formBtnText}>Save Changes</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setEditingProduct(null)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{product.name}</Text>
              <Text style={styles.cardSubtitle}>{product.sku} • {product.category}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: product.stock > 10 ? colors.primary + "15" : product.stock > 0 ? "#f59e0b15" : "#ef444415" }]}>
              <Text style={[styles.badgeText, { color: product.stock > 10 ? colors.primary : product.stock > 0 ? "#f59e0b" : "#ef4444" }]}>
                {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>{product.description}</Text>
          <Text style={styles.cardPrice}>PKR {product.price}</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.actionBtn} onPress={() => setEditingProduct(product)}>
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.dangerBtn} onPress={() => handleDeleteProduct(product.id)}>
              <Text style={styles.dangerBtnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
      {products.length === 0 && <Text style={{ color: colors.mutedForeground, textAlign: "center", padding: 24 }}>No products yet.</Text>}
    </>
  );

  const renderServices = () => (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Service Catalog</Text>
        <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => { setShowServiceForm(true); setEditingService(null); }}>
          <Text style={[styles.actionBtnText, { color: "#fff" }]}>+ Add</Text>
        </Pressable>
      </View>

      {showServiceForm && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={serviceForm.name} onChangeText={(t) => setServiceForm({ ...serviceForm, name: t })} placeholder="Service name" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Category</Text>
          <TextInput style={styles.formInput} value={serviceForm.category} onChangeText={(t) => setServiceForm({ ...serviceForm, category: t })} placeholder="Plumber" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Price Range</Text>
          <TextInput style={styles.formInput} value={serviceForm.priceRange} onChangeText={(t) => setServiceForm({ ...serviceForm, priceRange: t })} placeholder="PKR 500-2000" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Duration</Text>
          <TextInput style={styles.formInput} value={serviceForm.duration} onChangeText={(t) => setServiceForm({ ...serviceForm, duration: t })} placeholder="1-2 hours" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Description</Text>
          <TextInput style={styles.formArea} value={serviceForm.description} onChangeText={(t) => setServiceForm({ ...serviceForm, description: t })} multiline placeholder="Describe the service" placeholderTextColor={colors.mutedForeground} />
          <Pressable style={styles.formBtn} onPress={handleAddService}>
            <Text style={styles.formBtnText}>Add Service</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setShowServiceForm(false)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {editingService && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={editingService.name} onChangeText={(t) => setEditingService({ ...editingService, name: t })} />
          <Text style={styles.formLabel}>Category</Text>
          <TextInput style={styles.formInput} value={editingService.category} onChangeText={(t) => setEditingService({ ...editingService, category: t })} />
          <Text style={styles.formLabel}>Price Range</Text>
          <TextInput style={styles.formInput} value={editingService.priceRange} onChangeText={(t) => setEditingService({ ...editingService, priceRange: t })} />
          <Text style={styles.formLabel}>Description</Text>
          <TextInput style={styles.formArea} value={editingService.description} onChangeText={(t) => setEditingService({ ...editingService, description: t })} multiline />
          <Pressable style={styles.formBtn} onPress={handleEditService}>
            <Text style={styles.formBtnText}>Save Changes</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setEditingService(null)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {services.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name}</Text>
          <Text style={styles.cardSubtitle}>{service.category} • {service.duration}</Text>
          <Text style={styles.cardDesc}>{service.description}</Text>
          <View style={[styles.badge, { backgroundColor: colors.primary + "15", marginTop: 6 }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{service.priceRange}</Text>
          </View>
          <View style={styles.cardActions}>
            <Pressable style={styles.actionBtn} onPress={() => setEditingService(service)}>
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.dangerBtn} onPress={() => handleDeleteService(service.id)}>
              <Text style={styles.dangerBtnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
      {services.length === 0 && <Text style={{ color: colors.mutedForeground, textAlign: "center", padding: 24 }}>No services yet.</Text>}
    </>
  );

  const renderMenu = () => (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Menu Items</Text>
        <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => { setShowMenuForm(true); setEditingMenuItem(null); }}>
          <Text style={[styles.actionBtnText, { color: "#fff" }]}>+ Add</Text>
        </Pressable>
      </View>

      {showMenuForm && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={menuForm.name} onChangeText={(t) => setMenuForm({ ...menuForm, name: t })} placeholder="Item name" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Price</Text>
          <TextInput style={styles.formInput} value={menuForm.price} onChangeText={(t) => setMenuForm({ ...menuForm, price: t })} placeholder="350" keyboardType="numeric" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Category</Text>
          <TextInput style={styles.formInput} value={menuForm.category} onChangeText={(t) => setMenuForm({ ...menuForm, category: t })} placeholder="Main Course" placeholderTextColor={colors.mutedForeground} />
          <Text style={styles.formLabel}>Description</Text>
          <TextInput style={styles.formArea} value={menuForm.description} onChangeText={(t) => setMenuForm({ ...menuForm, description: t })} multiline placeholder="Description" placeholderTextColor={colors.mutedForeground} />
          <Pressable style={styles.formBtn} onPress={handleAddMenuItem}>
            <Text style={styles.formBtnText}>Add Item</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setShowMenuForm(false)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {editingMenuItem && (
        <View style={styles.formWrap}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput style={styles.formInput} value={editingMenuItem.name} onChangeText={(t) => setEditingMenuItem({ ...editingMenuItem, name: t })} />
          <Text style={styles.formLabel}>Price</Text>
          <TextInput style={styles.formInput} value={String(editingMenuItem.price)} onChangeText={(t) => setEditingMenuItem({ ...editingMenuItem, price: Number(t) || 0 })} keyboardType="numeric" />
          <Text style={styles.formLabel}>Description</Text>
          <TextInput style={styles.formArea} value={editingMenuItem.description} onChangeText={(t) => setEditingMenuItem({ ...editingMenuItem, description: t })} multiline />
          <Pressable style={styles.formBtn} onPress={handleEditMenuItem}>
            <Text style={styles.formBtnText}>Save Changes</Text>
          </Pressable>
          <Pressable style={styles.formCancelBtn} onPress={() => setEditingMenuItem(null)}>
            <Text style={styles.formCancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {menuItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>PKR {item.price}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.primary + "15", marginTop: 4 }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{item.category}</Text>
          </View>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.actionBtn} onPress={() => setEditingMenuItem(item)}>
              <Text style={styles.actionBtnText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.dangerBtn} onPress={() => handleDeleteMenuItem(item.id)}>
              <Text style={styles.dangerBtnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
      {menuItems.length === 0 && <Text style={{ color: colors.mutedForeground, textAlign: "center", padding: 24 }}>No menu items yet.</Text>}
    </>
  );

  const renderOrders = () => (
    <>
      <Text style={styles.sectionTitle}>Orders & Bookings</Text>
      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order {order.id.toUpperCase()}</Text>
              <Text style={styles.orderDate}>{order.date} • {order.paymentMethod}</Text>
            </View>
            <Text style={styles.orderTotal}>PKR {order.total}</Text>
          </View>
          <Text style={styles.orderItems}>{order.items}</Text>
          <View style={[styles.orderStatusBadge, { backgroundColor: (STATUS_COLORS[order.status] || "#71717a") + "20" }]}>
            <Text style={[styles.orderStatusText, { color: STATUS_COLORS[order.status] || "#71717a" }]}>{order.status}</Text>
          </View>
          <View style={styles.statusPicker}>
            {(["New", "Processing", "Shipped", "Delivered", "Cancelled"] as Order["status"][]).map((status) => (
              <Pressable
                key={status}
                style={[styles.statusOption, order.status === status && styles.statusOptionActive]}
                onPress={() => handleUpdateOrderStatus(order.id, status)}
              >
                <Text style={[styles.statusOptionText, order.status === status && styles.statusOptionTextActive]}>{status}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
      {orders.length === 0 && <Text style={{ color: colors.mutedForeground, textAlign: "center", padding: 24 }}>No orders yet.</Text>}
    </>
  );

  const renderReviews = () => (
    <>
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      {reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>{review.customer[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewName}>{review.customer}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          </View>
          <View style={styles.reviewStars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Feather key={i} name="star" size={14} color={i < review.rating ? "#f59e0b" : "#e4e4e7"} />
            ))}
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          {review.reply && (
            <View style={styles.reviewReply}>
              <Text style={styles.reviewReplyLabel}>Your reply:</Text>
              <Text style={styles.reviewReplyText}>{review.reply}</Text>
            </View>
          )}
          {!review.reply && (
            <>
              {replyingTo === review.id ? (
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    style={styles.formArea}
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder="Write your response..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                  />
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable style={[styles.formBtn, { flex: 1 }]} onPress={() => handleReplyToReview(review.id)}>
                      <Text style={styles.formBtnText}>Send</Text>
                    </Pressable>
                    <Pressable style={[styles.formCancelBtn, { flex: 1 }]} onPress={() => { setReplyingTo(null); setReplyText(""); }}>
                      <Text style={styles.formCancelBtnText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable style={[styles.actionBtn, { marginTop: 10 }]} onPress={() => setReplyingTo(review.id)}>
                  <Text style={styles.actionBtnText}>Reply</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Customer Enquiries</Text>
      {enquiries.map((enquiry) => (
        <View key={enquiry.id} style={styles.card}>
          <View style={styles.enquiryHeader}>
            <Text style={styles.cardTitle}>{enquiry.customer}</Text>
            <View style={[styles.badge, { backgroundColor: (STATUS_COLORS[enquiry.status] || "#71717a") + "20" }]}>
              <Text style={[styles.badgeText, { color: STATUS_COLORS[enquiry.status] || "#71717a" }]}>{enquiry.status}</Text>
            </View>
          </View>
          <Text style={styles.enquirySubject}>{enquiry.subject} • {enquiry.date}</Text>
          <Text style={styles.enquiryMessage}>{enquiry.message}</Text>
          {replyingEnquiry === enquiry.id ? (
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={styles.formArea}
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write your reply..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable style={[styles.formBtn, { flex: 1 }]} onPress={() => handleReplyToEnquiry(enquiry.id)}>
                  <Text style={styles.formBtnText}>Send</Text>
                </Pressable>
                <Pressable style={[styles.formCancelBtn, { flex: 1 }]} onPress={() => { setReplyingEnquiry(null); setReplyText(""); }}>
                  <Text style={styles.formCancelBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <Pressable style={styles.actionBtn} onPress={() => setReplyingEnquiry(enquiry.id)}>
                <Text style={styles.actionBtnText}>Reply</Text>
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={() => setEnquiries((e) => e.map((x) => (x.id === enquiry.id ? { ...x, status: "Closed" as const } : x)))}>
                <Text style={styles.actionBtnText}>Close</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </>
  );

  const renderGallery = () => (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={styles.sectionTitle}>Store Gallery</Text>
        <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.actionBtnText, { color: "#fff" }]}>Upload</Text>
        </Pressable>
      </View>
      <View style={styles.galleryGrid}>
        {gallery.map((image) => (
          <Pressable key={image.id} style={styles.galleryItem} onPress={() => handleDeleteGalleryImage(image.id)}>
            <Image
              source={{ uri: image.url }}
              style={styles.galleryImage}
              contentFit="cover"
              transition={150}
              cachePolicy="memory-disk"
              recyclingKey={image.id}
            />
            <View style={styles.galleryOverlay}>
              <Feather name="trash-2" size={18} color="#fff" />
            </View>
          </Pressable>
        ))}
      </View>
      {gallery.length === 0 && <Text style={{ color: colors.mutedForeground, textAlign: "center", padding: 24 }}>No images yet.</Text>}
    </>
  );

  const renderAnalytics = () => (
    <>
      <Text style={styles.sectionTitle}>Analytics</Text>
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Revenue Trend</Text>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Today</Text>
          <Text style={styles.analyticsValue}>PKR 3,500</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "65%", backgroundColor: "#22c55e" }]} />
        </View>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>This Week</Text>
          <Text style={styles.analyticsValue}>PKR 18,200</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "78%", backgroundColor: "#3b82f6" }]} />
        </View>
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>This Month</Text>
          <Text style={styles.analyticsValue}>PKR 72,500</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "85%", backgroundColor: "#8b5cf6" }]} />
        </View>
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Top Customers</Text>
        {["Aisha K.", "Bilal M.", "Fatima Z.", "Omar S."].map((name, i) => (
          <View key={name} style={styles.analyticsRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>{name[0]}</Text>
              </View>
              <Text style={styles.analyticsLabel}>{name}</Text>
            </View>
            <Text style={styles.analyticsValue}>PKR {[5200, 3400, 2800, 1200][i]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>Store Insights</Text>
        <View style={styles.insightRow}>
          <Text style={styles.analyticsLabel}>Profile Views</Text>
          <Text style={styles.analyticsValue}>1,234</Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.analyticsLabel}>Click-to-Call</Text>
          <Text style={styles.analyticsValue}>89</Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.analyticsLabel}>Direction Requests</Text>
          <Text style={styles.analyticsValue}>45</Text>
        </View>
        <View style={styles.insightRow}>
          <Text style={styles.analyticsLabel}>Conversion Rate</Text>
          <Text style={[styles.analyticsValue, { color: "#22c55e" }]}>12.4%</Text>
        </View>
      </View>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "products": return renderProducts();
      case "services": return renderServices();
      case "menu": return renderMenu();
      case "orders": return renderOrders();
      case "reviews": return renderReviews();
      case "gallery": return renderGallery();
      case "analytics": return renderAnalytics();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={styles.title}>Provider Dashboard</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {user && (
            <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", marginBottom: 12 }}>
              Welcome back, {user.displayName ?? user.email}
            </Text>
          )}
          {renderSectionNav()}
          {renderSection()}
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

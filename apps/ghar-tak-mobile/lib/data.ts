export interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: number;
  deliveryTime: string;
  isFavorite: boolean;
  location: { address: string; lat: number; lng: number };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  storeId?: string;
  serviceProviderId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceCategory: string;
  location: { address: string; lat: number; lng: number };
  availability: string;
  rating: number;
  imageUrl: string;
  description: string;
  productsSold?: string[];
}

export const mockServiceCategories: ServiceCategory[] = [
  { id: "plumber", name: "Plumbers", icon: "tool" },
  { id: "cleaner", name: "Cleaners", icon: "wind" },
  { id: "hairdresser", name: "Hairdressers", icon: "scissors" },
  { id: "car_repair", name: "Car Repair", icon: "truck" },
  { id: "tech_repair", name: "Tech Repair", icon: "cpu" },
  { id: "general_repair", name: "General Repair", icon: "settings" },
  { id: "jobs", name: "Jobs", icon: "briefcase" },
  { id: "beauty", name: "Beauty", icon: "star" },
  { id: "home_repair", name: "Home Repair", icon: "home" },
  { id: "wellness", name: "Wellness", icon: "heart" },
  { id: "training", name: "Training", icon: "book-open" },
  { id: "pest_control", name: "Pest Control", icon: "shield" },
  { id: "rental", name: "Rentals", icon: "key" },
];

export const mockStores: Store[] = [
  {
    id: "store1",
    name: "Downtown Fresh Mart",
    description: "Your friendly neighborhood grocery store with fresh produce and daily essentials.",
    category: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    rating: 4.5,
    deliveryTime: "25-35 min",
    isFavorite: false,
    location: { lat: 40.7128, lng: -74.006, address: "12 Maple St, Downtown" },
  },
  {
    id: "store2",
    name: "City Tech Central",
    description: "Latest gadgets and accessories. Your one-stop tech shop.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80",
    rating: 4.8,
    deliveryTime: "30-40 min",
    isFavorite: true,
    location: { lat: 40.7135, lng: -74.0072, address: "55 Tech Ave, Downtown" },
  },
  {
    id: "store3",
    name: "Uptown Quick Bites",
    description: "Quick and delicious meals delivered to your doorstep.",
    category: "Restaurant",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    rating: 4.2,
    deliveryTime: "20-30 min",
    isFavorite: false,
    location: { lat: 40.758, lng: -73.9855, address: "88 Restaurant Row, Uptown" },
  },
  {
    id: "store4",
    name: "Riverside Fabrics",
    description: "High-quality fabrics and fashion wear.",
    category: "Fashion",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    rating: 4.6,
    deliveryTime: "1-2 days",
    isFavorite: false,
    location: { lat: 40.7095, lng: -74.0115, address: "21 River View, Riverside" },
  },
  {
    id: "store5",
    name: "The Spice House",
    description: "Authentic spices and exotic ingredients from around the world.",
    category: "Grocery",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
    rating: 4.9,
    deliveryTime: "2-3 days",
    isFavorite: true,
    location: { lat: 40.7145, lng: -74.008, address: "Spice Alley, Downtown" },
  },
];

export const mockProducts: Product[] = [
  { id: "prod1", name: "Organic Apples", price: 3.99, storeId: "store1", category: "Produce", imageUrl: "" },
  { id: "prod2", name: "Fresh Milk (1 Gallon)", price: 4.5, storeId: "store1", category: "Dairy", imageUrl: "" },
  { id: "prod9", name: "Whole Wheat Bread", price: 3.2, storeId: "store1", category: "Bakery", imageUrl: "" },
  { id: "prod3", name: "Wireless Earbuds", price: 79.99, storeId: "store2", category: "Audio", imageUrl: "" },
  { id: "prod4", name: "Mobile Charger", price: 25.0, storeId: "store2", category: "Accessories", imageUrl: "" },
  { id: "prod5", name: "Classic Cheeseburger", price: 12.5, storeId: "store3", category: "Burgers", imageUrl: "" },
  { id: "prod6", name: "Pepperoni Pizza", price: 18.0, storeId: "store3", category: "Pizza", imageUrl: "" },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: "sp1",
    name: "Mike's Plumbing Services",
    serviceCategory: "plumber",
    location: { lat: 40.715, lng: -74.008, address: "Downtown" },
    availability: "Mon-Sat 9am-7pm",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    description: "Expert plumbing services for residential and commercial properties.",
    productsSold: ["Pipe Wrench (10 inch)", "Drain Cleaner Liquid"],
  },
  {
    id: "sp2",
    name: "Sparkle Cleaners",
    serviceCategory: "cleaner",
    location: { lat: 40.758, lng: -73.9855, address: "Uptown" },
    availability: "Available 24/7",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    description: "Professional cleaning services for homes and offices.",
  },
  {
    id: "sp3",
    name: "Style Salon",
    serviceCategory: "hairdresser",
    location: { lat: 40.718, lng: -74.012, address: "Riverside" },
    availability: "Tue-Sun 11am-8pm",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
    description: "Trendy haircuts and styling by experienced professionals.",
  },
  {
    id: "sp4",
    name: "Metro Auto Care",
    serviceCategory: "car_repair",
    location: { lat: 40.71, lng: -74.005, address: "Downtown" },
    availability: "Mon-Fri 9am-6pm",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
    description: "Reliable car repair and maintenance services.",
  },
  {
    id: "sp5",
    name: "Gadget Fix",
    serviceCategory: "tech_repair",
    location: { lat: 40.755, lng: -73.98, address: "Uptown" },
    availability: "Mon-Sat 10am-8pm",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
    description: "Expert repairs for phones, laptops, and tablets.",
    productsSold: ["Mobile Screen Protector", "USB-C Cable (Durable)"],
  },
  {
    id: "sp6",
    name: "Handyman Solutions",
    serviceCategory: "general_repair",
    location: { lat: 40.712, lng: -74.015, address: "Riverside" },
    availability: "Mon-Fri 9am-6pm",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    description: "All-around handyman for your home repair needs.",
  },
];

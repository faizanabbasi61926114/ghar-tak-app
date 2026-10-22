
import type { ServiceCategory, ServiceProvider, Store, Product } from './types';
import { Wrench, Sparkles, Scissors, CarFront, Cpu, Construction, Briefcase, Palette, Home, Leaf, GraduationCap, BugPlay, KeyRound } from 'lucide-react';

export const mockServiceCategories: ServiceCategory[] = [
  { id: 'plumber', name: 'Plumbers', icon: Wrench, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'plumbing tools' },
  { id: 'cleaner', name: 'Cleaners', icon: Sparkles, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'cleaning spray' },
  { id: 'hairdresser', name: 'Hairdressers', icon: Scissors, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'salon scissors' },
  { id: 'car_repair', name: 'Car Repair', icon: CarFront, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'car engine' },
  { id: 'tech_repair', name: 'Tech Repair', icon: Cpu, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'computer circuit' },
  { id: 'general_repair', name: 'General Repair', icon: Construction, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tools hammer' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'briefcase work' },
  { id: 'beauty', name: 'Beauty Services', icon: Palette, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'makeup palette' },
  { id: 'home_repair', name: 'Home Repair', icon: Home, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'house tools' },
  { id: 'wellness', name: 'Wellness', icon: Leaf, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'spa wellness' },
  { id: 'training', name: 'Training & Tutoring', icon: GraduationCap, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'education learning' },
  { id: 'pest_control', name: 'Pest Control', icon: BugPlay, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'insect spray' },
  { id: 'rental', name: 'Rentals', icon: KeyRound, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'keys house' },
];

export const mockStores: Store[] = [
  {
    id: 'store1',
    name: 'Downtown Fresh Mart',
    description: 'Your friendly neighborhood grocery store with fresh produce and daily essentials.',
    location: { lat: 40.7128, lng: -74.0060, address: '12 Maple St, Downtown' },
    category: 'Grocery',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.5,
    deliveryTime: "25-35 min",
    dataAiHint: "grocery store"
  },
  {
    id: 'store2',
    name: 'City Tech Central',
    description: 'Latest gadgets and accessories. Your one-stop tech shop.',
    location: { lat: 40.7135, lng: -74.0072, address: '55 Tech Ave, Downtown' },
    category: 'Electronics',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: true,
    rating: 4.8,
    deliveryTime: "30-40 min",
    servicesOffered: ['Smartphone Screen Repair', 'Laptop Diagnostics'],
    dataAiHint: "electronics shop"
  },
  {
    id: 'store3',
    name: 'Uptown Quick Bites',
    description: 'Quick and delicious meals delivered to your doorstep.',
    location: { lat: 40.7580, lng: -73.9855, address: '88 Restaurant Row, Uptown' },
    category: 'Restaurant',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.2,
    deliveryTime: "20-30 min",
    dataAiHint: "restaurant food"
  },
  {
    id: 'store4',
    name: 'Riverside Fabrics',
    description: 'High-quality fabrics and fashion wear.',
    location: { lat: 40.7095, lng: -74.0115, address: '21 River View, Riverside' },
    category: 'Fashion',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.6,
    deliveryTime: "1-2 days",
    dataAiHint: "fabric market"
  },
  {
    id: 'store5',
    name: 'The Spice House',
    description: 'Authentic spices and exotic ingredients from around the world.',
    location: { lat: 40.7145, lng: -74.0080, address: 'Spice Alley, Downtown' },
    category: 'Grocery',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: true,
    rating: 4.9,
    deliveryTime: "2-3 days",
    dataAiHint: "spice market"
  },
];

export const mockProducts: Product[] = [
  // Store 1 (Downtown Fresh Mart)
  { id: 'prod1', name: 'Organic Apples', price: 3.99, storeId: 'store1', category: 'Produce', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "apples fruit" },
  { id: 'prod2', name: 'Fresh Milk (1 Gallon)', price: 4.50, storeId: 'store1', category: 'Dairy', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "milk carton" },
  { id: 'prod9', name: 'Whole Wheat Bread', price: 3.20, storeId: 'store1', category: 'Bakery', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "bread loaf" },
  { id: 'prod10', name: 'Instant Noodles Pack', price: 5.00, storeId: 'store1', category: 'Pantry', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "instant noodles" },
  
  // Store 2 (City Tech Central)
  { id: 'prod3', name: 'Wireless Earbuds', price: 79.99, storeId: 'store2', category: 'Audio', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "earbuds audio" },
  { id: 'prod4', name: 'Mobile Charger (Fast Charge)', price: 25.00, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "charger cable" },
  { id: 'prod11', name: 'Power Bank 10000mAh', price: 35.00, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "power bank" },
  { id: 'prod12', name: 'Laptop Sleeve (15 inch)', price: 29.99, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "laptop case" },

  // Store 3 (Uptown Quick Bites)
  { id: 'prod5', name: 'Classic Cheeseburger', price: 12.50, storeId: 'store3', category: 'Burgers', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "cheeseburger meal" },
  { id: 'prod6', name: 'Pepperoni Pizza', price: 18.00, storeId: 'store3', category: 'Pizza', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "pizza slice" },
  { id: 'prod13', name: 'Club Sandwich', price: 14.00, storeId: 'store3', category: 'Sandwiches', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "club sandwich" },
  { id: 'prod14', name: 'Fresh Lemonade', price: 4.00, storeId: 'store3', category: 'Beverages', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "lemonade drink" },
  
  // Store 4 (Riverside Fabrics)
  { id: 'prod15', name: 'Linen Fabric (per yard)', price: 15.00, storeId: 'store4', category: 'Fabric', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "linen fabric" },
  { id: 'prod16', name: 'Silk Scarf', price: 45.00, storeId: 'store4', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "silk scarf" },
  
  // Store 5 (The Spice House)
  { id: 'prod17', name: 'Smoked Paprika', price: 6.00, storeId: 'store5', category: 'Spices', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "spices jar" },
  { id: 'prod18', name: 'Saffron Threads (1g)', price: 12.00, storeId: 'store5', category: 'Spices', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "saffron spice" },

  // Products from Service Providers
  { id: 'prod7', name: 'Pipe Wrench (10 inch)', price: 18.00, serviceProviderId: 'sp1', category: 'Tools', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "wrench tool" },
  { id: 'prod8', name: 'Mobile Screen Protector', price: 10.00, serviceProviderId: 'sp5', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "screen protector" },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Mike\'s Plumbing Services',
    serviceCategory: 'plumber',
    location: { lat: 40.7150, lng: -74.0080, address: 'Downtown' },
    availability: 'Mon-Sat 9am-7pm',
    rating: 4.7,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Expert plumbing services for residential and commercial properties.',
    productsSold: ['Pipe Wrench (10 inch)', 'Drain Cleaner Liquid'],
    dataAiHint: "plumber tools"
  },
  {
    id: 'sp2',
    name: 'Sparkle Cleaners',
    serviceCategory: 'cleaner',
    location: { lat: 40.7580, lng: -73.9855, address: 'Uptown' },
    availability: 'Available 24/7',
    rating: 4.9,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Professional cleaning services for homes and offices.',
    dataAiHint: "cleaning supplies"
  },
  {
    id: 'sp3',
    name: 'Style Salon',
    serviceCategory: 'hairdresser',
    location: { lat: 40.7180, lng: -74.0120, address: 'Riverside' },
    availability: 'Tue-Sun 11am-8pm',
    rating: 4.6,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Trendy haircuts and styling by experienced professionals.',
    dataAiHint: "hair salon"
  },
  {
    id: 'sp4',
    name: 'Metro Auto Care',
    serviceCategory: 'car_repair',
    location: { lat: 40.7100, lng: -74.0050, address: 'Downtown' },
    availability: 'Mon-Fri 9am-6pm',
    rating: 4.4,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Reliable car repair and maintenance services.',
    dataAiHint: "car mechanic"
  },
  {
    id: 'sp5',
    name: 'Gadget Fix',
    serviceCategory: 'tech_repair',
    location: { lat: 40.7550, lng: -73.9800, address: 'Uptown' },
    availability: 'Mon-Sat 10am-8pm',
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Expert repairs for phones, laptops, and tablets.',
    productsSold: ['Mobile Screen Protector', 'USB-C Cable (Durable)'],
    dataAiHint: "tech repair shop"
  },
  {
    id: 'sp6',
    name: 'Handyman Solutions',
    serviceCategory: 'general_repair',
    location: { lat: 40.7120, lng: -74.0150, address: 'Riverside' },
    availability: 'Mon-Fri 9am-6pm',
    rating: 4.5,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'All-around handyman for your home repair needs.',
    dataAiHint: "handyman tools"
  },
];

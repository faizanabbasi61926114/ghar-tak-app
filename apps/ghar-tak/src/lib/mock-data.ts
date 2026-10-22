
import type { ServiceCategory, ServiceProvider, Store, Product } from './types';
import { Wrench, Sparkles, Scissors, CarFront, Cpu, Construction, Briefcase, Palette, Home, Leaf, GraduationCap, BugPlay, KeyRound, Zap, Wind, ChefHat, Droplets } from 'lucide-react';

export const mockServiceCategories: ServiceCategory[] = [
  { id: 'plumber', name: 'Plumbers', icon: Wrench, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'plumbing tools' },
  { id: 'electrician', name: 'Electricians', icon: Zap, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'electrical wiring' },
  { id: 'cleaner', name: 'Cleaners', icon: Sparkles, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'cleaning spray' },
  { id: 'hairdresser', name: 'Salons & Barbers', icon: Scissors, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'salon scissors' },
  { id: 'car_repair', name: 'Car Repair', icon: CarFront, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'car engine' },
  { id: 'tech_repair', name: 'Tech Repair', icon: Cpu, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'computer circuit' },
  { id: 'ac_repair', name: 'AC Repair', icon: Wind, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'air conditioner' },
  { id: 'general_repair', name: 'General Repair', icon: Construction, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tools hammer' },
  { id: 'tailor', name: 'Tailors', icon: Scissors, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'sewing needle thread' },
  { id: 'home_chef', name: 'Home Chefs', icon: ChefHat, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'cooking food' },
  { id: 'water_tank', name: 'Water Tank Cleaning', icon: Droplets, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'water tank cleaning' },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'briefcase work' },
  { id: 'beauty', name: 'Beauty & Mehndi', icon: Palette, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'makeup mehndi henna' },
  { id: 'home_repair', name: 'Home Repair', icon: Home, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'house tools' },
  { id: 'wellness', name: 'Wellness', icon: Leaf, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'spa wellness' },
  { id: 'training', name: 'Tutors', icon: GraduationCap, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'education tutor' },
  { id: 'pest_control', name: 'Pest Control', icon: BugPlay, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'insect spray' },
  { id: 'rental', name: 'Rentals', icon: KeyRound, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'keys house' },
];

export const mockStores: Store[] = [
  {
    id: 'store1',
    name: 'Al-Baraka General Store',
    description: 'Your trusted neighbourhood grocery store — fresh produce, dairy, and daily essentials at great prices.',
    location: { lat: 31.5204, lng: 74.3587, address: 'Main Market, Gulberg III, Lahore' },
    category: 'Grocery',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.5,
    deliveryTime: "20-30 min",
    dataAiHint: "grocery store"
  },
  {
    id: 'store2',
    name: 'Pak Electronics Hub',
    description: 'Latest mobiles, laptops, accessories and same-day repairs. Authorised dealer for major brands.',
    location: { lat: 24.8607, lng: 67.0011, address: 'Electronics Market, Saddar, Karachi' },
    category: 'Electronics',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: true,
    rating: 4.8,
    deliveryTime: "30-45 min",
    servicesOffered: ['Mobile Screen Repair', 'Laptop Diagnostics', 'Data Recovery'],
    dataAiHint: "electronics shop"
  },
  {
    id: 'store3',
    name: 'Bundu Khan Restaurant',
    description: 'Authentic Lahori cuisine — biryani, karahi, and seekh kababs made fresh daily.',
    location: { lat: 31.5497, lng: 74.3436, address: 'MM Alam Road, Gulberg, Lahore' },
    category: 'Restaurant',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.3,
    deliveryTime: "25-35 min",
    dataAiHint: "restaurant food"
  },
  {
    id: 'store4',
    name: 'Khaddi Fabrics & Fashion',
    description: 'Premium lawn, linen, silk, and ready-to-wear collections. Latest Pakistani fashion trends.',
    location: { lat: 33.7215, lng: 73.0433, address: 'Jinnah Super Market, F-7, Islamabad' },
    category: 'Fashion',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: false,
    rating: 4.6,
    deliveryTime: "1-2 days",
    dataAiHint: "fabric market"
  },
  {
    id: 'store5',
    name: 'Gul Masala Centre',
    description: 'Freshly ground spices, whole masalas, and exotic ingredients sourced directly from farms.',
    location: { lat: 31.5890, lng: 74.3313, address: 'Akbari Mandi, Lahore' },
    category: 'Grocery',
    imageUrl: 'https://placehold.co/600x400.png',
    isFavorite: true,
    rating: 4.9,
    deliveryTime: "2-3 hours",
    dataAiHint: "spice market"
  },
];

export const mockProducts: Product[] = [
  // Store 1 (Al-Baraka General Store)
  { id: 'prod1', name: 'Desi Mangoes (1 kg)', price: 350, storeId: 'store1', category: 'Produce', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "mangoes fruit" },
  { id: 'prod2', name: 'Fresh Milk (1 litre)', price: 180, storeId: 'store1', category: 'Dairy', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "milk carton" },
  { id: 'prod9', name: 'Naan Bread (6 pcs)', price: 120, storeId: 'store1', category: 'Bakery', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "naan bread" },
  { id: 'prod10', name: 'Shan Biryani Masala Pack', price: 95, storeId: 'store1', category: 'Pantry', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "spice packet" },

  // Store 2 (Pak Electronics Hub)
  { id: 'prod3', name: 'Wireless Earbuds (TWS)', price: 8500, storeId: 'store2', category: 'Audio', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "earbuds audio" },
  { id: 'prod4', name: 'Fast Charger 65W', price: 1800, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "charger cable" },
  { id: 'prod11', name: 'Power Bank 20000mAh', price: 4500, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "power bank" },
  { id: 'prod12', name: 'Laptop Sleeve 15"', price: 2200, storeId: 'store2', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "laptop case" },

  // Store 3 (Bundu Khan Restaurant)
  { id: 'prod5', name: 'Chicken Biryani (1 plate)', price: 450, storeId: 'store3', category: 'Rice Dishes', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "biryani meal" },
  { id: 'prod6', name: 'Karahi Gosht (half kg)', price: 1800, storeId: 'store3', category: 'Main Course', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "karahi gosht" },
  { id: 'prod13', name: 'Seekh Kabab Platter (10 pcs)', price: 950, storeId: 'store3', category: 'BBQ', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "seekh kabab" },
  { id: 'prod14', name: 'Rooh Afza Drink', price: 120, storeId: 'store3', category: 'Beverages', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "rooh afza drink" },

  // Store 4 (Khaddi Fabrics)
  { id: 'prod15', name: 'Lawn Fabric (2.5 metres)', price: 2800, storeId: 'store4', category: 'Fabric', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "lawn fabric" },
  { id: 'prod16', name: 'Silk Dupatta', price: 3500, storeId: 'store4', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "silk dupatta" },

  // Store 5 (Gul Masala Centre)
  { id: 'prod17', name: 'Kalonji (Nigella Seeds) 100g', price: 320, storeId: 'store5', category: 'Spices', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "spices jar" },
  { id: 'prod18', name: 'Saffron (Kesar) 1g', price: 3200, storeId: 'store5', category: 'Spices', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "saffron spice" },

  // Products from Service Providers
  { id: 'prod7', name: 'Pipe Wrench (10 inch)', price: 2200, serviceProviderId: 'sp1', category: 'Tools', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "wrench tool" },
  { id: 'prod8', name: 'Tempered Glass Screen Protector', price: 350, serviceProviderId: 'sp5', category: 'Accessories', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: "screen protector" },
];

export const mockServiceProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Ustad Raza Plumbing',
    serviceCategory: 'plumber',
    location: { lat: 31.5204, lng: 74.3587, address: 'Gulberg, Lahore' },
    availability: 'Mon-Sat 9am-7pm',
    rating: 4.7,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Experienced plumber serving Lahore for over 15 years. Pipe repairs, leakage fixing, and bathroom fitting.',
    productsSold: ['Pipe Wrench (10 inch)', 'Drain Cleaner Liquid'],
    dataAiHint: "plumber tools"
  },
  {
    id: 'sp2',
    name: 'SafaaKar Cleaning Services',
    serviceCategory: 'cleaner',
    location: { lat: 24.8607, lng: 67.0011, address: 'Gulshan-e-Iqbal, Karachi' },
    availability: 'Available 7 days',
    rating: 4.9,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Professional home and office cleaning across Karachi. Deep cleaning, sofa cleaning, and carpet washing.',
    dataAiHint: "cleaning supplies"
  },
  {
    id: 'sp3',
    name: 'Noor Beauty Salon',
    serviceCategory: 'hairdresser',
    location: { lat: 33.7215, lng: 73.0433, address: 'F-10 Markaz, Islamabad' },
    availability: 'Tue-Sun 11am-8pm',
    rating: 4.6,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Ladies salon offering haircuts, colouring, mehndi, bridal packages, and facials.',
    dataAiHint: "hair salon"
  },
  {
    id: 'sp4',
    name: 'Faisal Auto Workshop',
    serviceCategory: 'car_repair',
    location: { lat: 33.5651, lng: 73.0169, address: 'Saddar, Rawalpindi' },
    availability: 'Mon-Sat 9am-6pm',
    rating: 4.4,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Reliable car servicing, engine repair, and denting/painting for all makes and models.',
    dataAiHint: "car mechanic"
  },
  {
    id: 'sp5',
    name: 'Smart Fix PK',
    serviceCategory: 'tech_repair',
    location: { lat: 31.5497, lng: 74.3436, address: 'Liberty Market, Lahore' },
    availability: 'Mon-Sat 11am-9pm',
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Expert repairs for iPhones, Android phones, laptops, and tablets. Original parts only.',
    productsSold: ['Tempered Glass Screen Protector', 'USB-C Cable (Braided)'],
    dataAiHint: "tech repair shop"
  },
  {
    id: 'sp6',
    name: 'Rafiq Handyman Services',
    serviceCategory: 'general_repair',
    location: { lat: 24.8607, lng: 67.0500, address: 'PECHS, Karachi' },
    availability: 'Mon-Fri 9am-6pm',
    rating: 4.5,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'All-in-one handyman: furniture assembly, wall drilling, lock fixing, and minor carpentry.',
    dataAiHint: "handyman tools"
  },
  {
    id: 'sp7',
    name: 'CoolBreeze AC Services',
    serviceCategory: 'ac_repair',
    location: { lat: 31.4504, lng: 73.1350, address: 'D Ground, Faisalabad' },
    availability: 'Mon-Sun 8am-8pm',
    rating: 4.7,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'AC installation, service, gas refilling, and repairs for all major brands. Same-day service available.',
    dataAiHint: "air conditioner repair"
  },
  {
    id: 'sp8',
    name: 'Master Tailor Ashraf',
    serviceCategory: 'tailor',
    location: { lat: 33.6844, lng: 73.0479, address: 'G-9 Markaz, Islamabad' },
    availability: 'Mon-Sat 10am-7pm',
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x400.png',
    description: 'Expert stitching for shalwar kameez, suits, and western wear. Bridal and formal alterations.',
    dataAiHint: "tailor sewing"
  },
];

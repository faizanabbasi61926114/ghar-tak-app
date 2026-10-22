import { Wrench, Sparkles, Scissors, CarFront, Cpu, Construction, Briefcase, Palette, Home, Leaf, GraduationCap, BugPlay, KeyRound } from 'lucide-react';
import type { Store, Product, ServiceCategory, ServiceProvider } from './types';
import { mockStores, mockProducts, mockServiceCategories, mockServiceProviders } from './mock-data';
import { supabase } from './supabase';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  tool: Wrench,
  wind: Sparkles,
  scissors: Scissors,
  truck: CarFront,
  cpu: Cpu,
  settings: Construction,
  briefcase: Briefcase,
  star: Palette,
  home: Home,
  heart: Leaf,
  'book-open': GraduationCap,
  shield: BugPlay,
  key: KeyRound,
};

export async function fetchStores(): Promise<Store[]> {
  if (!supabase) return mockStores;
  try {
    const { data, error } = await supabase.from('stores').select('*').order('name');
    if (error || !data?.length) return mockStores;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      category: row.category,
      imageUrl: row.image_url ?? undefined,
      rating: row.rating ?? undefined,
      deliveryTime: row.delivery_time ?? undefined,
      isFavorite: false,
      location: { lat: row.lat ?? 0, lng: row.lng ?? 0, address: row.address ?? undefined },
      dataAiHint: row.name?.toLowerCase(),
    }));
  } catch {
    return mockStores;
  }
}

export async function fetchProducts(storeId?: string): Promise<Product[]> {
  if (!supabase) return storeId ? mockProducts.filter(p => p.storeId === storeId) : mockProducts;
  try {
    let query = supabase.from('products').select('*');
    if (storeId) query = query.eq('store_id', storeId);
    const { data, error } = await query;
    if (error || !data?.length) {
      return storeId ? mockProducts.filter(p => p.storeId === storeId) : mockProducts;
    }
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      category: row.category ?? undefined,
      imageUrl: row.image_url ?? undefined,
      storeId: row.store_id ?? undefined,
      serviceProviderId: row.service_provider_id ?? undefined,
      dataAiHint: row.name?.toLowerCase(),
    }));
  } catch {
    return storeId ? mockProducts.filter(p => p.storeId === storeId) : mockProducts;
  }
}

export async function fetchServiceCategories(): Promise<ServiceCategory[]> {
  if (!supabase) return mockServiceCategories;
  try {
    const { data, error } = await supabase.from('service_categories').select('*').order('name');
    if (error || !data?.length) return mockServiceCategories;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      icon: ICON_MAP[row.icon] ?? Wrench,
      imageUrl: 'https://placehold.co/100x100.png',
      dataAiHint: row.name?.toLowerCase(),
    }));
  } catch {
    return mockServiceCategories;
  }
}

export async function fetchServiceProviders(): Promise<ServiceProvider[]> {
  if (!supabase) return mockServiceProviders;
  try {
    const { data, error } = await supabase.from('service_providers').select('*').order('name');
    if (error || !data?.length) return mockServiceProviders;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      serviceCategory: row.service_category,
      location: { lat: row.lat ?? 0, lng: row.lng ?? 0, address: row.address ?? undefined },
      availability: row.availability,
      rating: row.rating ?? undefined,
      imageUrl: row.image_url ?? undefined,
      description: row.description ?? undefined,
      productsSold: row.products_sold ?? undefined,
      dataAiHint: row.name?.toLowerCase(),
    }));
  } catch {
    return mockServiceProviders;
  }
}

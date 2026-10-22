import { supabase } from './supabase';
import {
  mockStores,
  mockProducts,
  mockServiceCategories,
  mockServiceProviders,
  type Store,
  type Product,
  type ServiceCategory,
  type ServiceProvider,
} from './data';

export async function fetchStores(): Promise<Store[]> {
  if (!supabase) return mockStores;
  try {
    const { data, error } = await supabase.from('stores').select('*').order('name');
    if (error || !data?.length) return mockStores;
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? '',
      category: row.category ?? '',
      imageUrl: row.image_url ?? '',
      rating: row.rating ?? 0,
      deliveryTime: row.delivery_time ?? '',
      isFavorite: false,
      location: { lat: row.lat ?? 0, lng: row.lng ?? 0, address: row.address ?? '' },
    }));
  } catch {
    return mockStores;
  }
}

export async function fetchProducts(storeId?: string): Promise<Product[]> {
  if (!supabase) {
    return storeId ? mockProducts.filter((p) => p.storeId === storeId) : mockProducts;
  }
  try {
    let query = supabase.from('products').select('*');
    if (storeId) query = query.eq('store_id', storeId);
    const { data, error } = await query;
    if (error || !data?.length) {
      return storeId ? mockProducts.filter((p) => p.storeId === storeId) : mockProducts;
    }
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      category: row.category ?? '',
      imageUrl: row.image_url ?? '',
      storeId: row.store_id ?? undefined,
      serviceProviderId: row.service_provider_id ?? undefined,
    }));
  } catch {
    return storeId ? mockProducts.filter((p) => p.storeId === storeId) : mockProducts;
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
      icon: row.icon ?? 'tool',
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
      serviceCategory: row.service_category ?? '',
      location: { lat: row.lat ?? 0, lng: row.lng ?? 0, address: row.address ?? '' },
      availability: row.availability ?? '',
      rating: row.rating ?? 0,
      imageUrl: row.image_url ?? '',
      description: row.description ?? '',
      productsSold: row.products_sold ?? undefined,
    }));
  } catch {
    return mockServiceProviders;
  }
}

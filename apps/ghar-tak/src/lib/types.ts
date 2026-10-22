export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  location: Location;
  category: string; // e.g., "Grocery", "Electronics", "Restaurant"
  imageUrl?: string;
  isFavorite?: boolean;
  products?: Product[];
  rating?: number;
  deliveryTime?: string;
  servicesOffered?: string[];
  dataAiHint?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  storeId?: string;
  serviceProviderId?: string;
  category?: string;
  quantity?: number;
  dataAiHint?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceCategory: string;
  location: Location;
  availability: string;
  rating?: number;
  imageUrl?: string;
  description?: string;
  productsSold?: string[];
  dataAiHint?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  imageUrl?: string;
  dataAiHint?: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  location?: Location | null;
  favoriteStoreIds?: string[];
  favoriteServiceIds?: string[];
}

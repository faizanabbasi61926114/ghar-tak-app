import { mockServiceCategories, mockServiceProviders } from '@/lib/mock-data';
import type { ServiceCategory, ServiceProvider } from '@/lib/types';
import ServiceCard from '@/components/shared/ServiceCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SearchInput from '@/components/shared/SearchInput';

export default function ServiceCategoryPage({ params }: { params: { category: string } }) {
  const category: ServiceCategory | undefined = mockServiceCategories.find(c => c.id === params.category);
  const providersInCategory: ServiceProvider[] = mockServiceProviders.filter(p => p.serviceCategory === params.category);

  if (!category) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Service category not found</h1>
        <Link href="/services" className="text-primary hover:underline mt-4 inline-block">
          Back to all services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <Link href="/services" className="flex items-center text-sm text-primary hover:underline mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            All Service Categories
          </Link>
          <div className="flex items-center">
            {category.icon && <category.icon className="h-8 w-8 text-primary mr-3" />}
            <h1 className="text-3xl font-bold font-headline">{category.name}</h1>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchInput placeholder={`Search in ${category.name}...`} />
        </div>
      </div>
      
      {providersInCategory.length === 0 ? (
        <p className="text-muted-foreground text-center py-10">No {category.name.toLowerCase()} available in your area currently.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providersInCategory.map((provider) => (
            <ServiceCard key={provider.id} serviceProvider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Generate static paths if categories are fixed
// export async function generateStaticParams() {
//   return mockServiceCategories.map((category) => ({
//     category: category.id,
//   }));
// }

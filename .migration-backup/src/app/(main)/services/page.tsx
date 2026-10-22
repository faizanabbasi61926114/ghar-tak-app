import { mockServiceCategories, mockServiceProviders } from '@/lib/mock-data';
import ServiceCard from '@/components/shared/ServiceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from '@/components/shared/SearchInput';
import { Users } from 'lucide-react'; // Users icon can represent services/professionals

export default function AllServicesPage() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-3xl font-bold font-headline">Service Categories</h1>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3">
                <SearchInput placeholder="Search services..." />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockServiceCategories.map((category) => (
            <Link key={category.id} href={`/services/${category.id}`} className="group">
              <Card className="text-center h-full flex flex-col items-center justify-between p-4 transition-all hover:shadow-xl hover:border-primary transform hover:-translate-y-1">
                <CardHeader className="p-0 mb-3">
                  {category.icon && <category.icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />}
                  {!category.icon && category.imageUrl && (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden shadow-md">
                      <Image src={category.imageUrl} alt={category.name} layout="fill" objectFit="cover" data-ai-hint="category icon" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold font-headline mb-6">Featured Service Providers</h2>
         {mockServiceProviders.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No service providers available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServiceProviders.slice(0,6).map((provider) => ( // Show a few featured providers
              <ServiceCard key={provider.id} serviceProvider={provider} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

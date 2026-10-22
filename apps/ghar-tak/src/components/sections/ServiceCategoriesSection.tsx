import { Link } from 'wouter';
import { useListCategories } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import * as Icons from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function ServiceCategoriesSection() {
  const { data: categories, isLoading } = useListCategories({ query: { queryKey: ["listCategories"] } });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <section className="py-8 md:py-12">
      <h2 className="text-3xl font-headline font-bold mb-8 text-center md:text-left">Explore Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {(Array.isArray(categories) ? categories : []).map((category) => {
            // @ts-ignore
            const Icon = category.icon && Icons[category.icon] ? Icons[category.icon] : Icons.Grid;
            return (
              <Link key={category.id} href={`/services/${category.id}`} className="group w-40 md:w-48 flex-shrink-0">
                <Card className="text-center h-full flex flex-col items-center justify-center p-4 md:p-6 transition-all hover:shadow-xl hover:border-primary transform hover:-translate-y-1">
                  <CardHeader className="p-0 mb-3">
                    <Icon className="h-10 w-10 md:h-12 md:w-12 text-primary group-hover:text-accent transition-colors" />
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardTitle className="text-md md:text-lg font-semibold group-hover:text-primary transition-colors whitespace-normal">{category.name}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

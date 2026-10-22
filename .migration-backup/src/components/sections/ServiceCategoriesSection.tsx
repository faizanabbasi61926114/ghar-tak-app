
import Link from 'next/link';
import { mockServiceCategories } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function ServiceCategoriesSection() {
  return (
    <section className="py-8 md:py-12">
      <h2 className="text-3xl font-headline font-bold mb-8 text-center md:text-left">Explore Services</h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {mockServiceCategories.map((category) => (
            <Link key={category.id} href={`/services/${category.id}`} className="group w-40 md:w-48 flex-shrink-0">
              <Card className="text-center h-full flex flex-col items-center justify-center p-4 md:p-6 transition-all hover:shadow-xl hover:border-primary transform hover:-translate-y-1">
                <CardHeader className="p-0 mb-3">
                  {category.icon && <category.icon className="h-10 w-10 md:h-12 md:w-12 text-primary group-hover:text-accent transition-colors" />}
                  {!category.icon && category.imageUrl && (
                     <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full overflow-hidden shadow-md">
                       <Image src={category.imageUrl} alt={category.name} layout="fill" objectFit="cover" data-ai-hint={category.dataAiHint || "service icon"} />
                     </div>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="text-md md:text-lg font-semibold group-hover:text-primary transition-colors whitespace-normal">{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

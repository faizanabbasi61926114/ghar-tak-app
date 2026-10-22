import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
;

export default function ContactPage() {
  const address = "241-B, B Block, Jubilee Town, Lahore";
  const phoneNumber = "+92 331 5033761";
  const mapPlaceholderUrl = "https://placehold.co/1200x400.png"; 

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Contact Us
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          We'd love to hear from you!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <MapPin className="h-6 w-6 mr-3 text-primary" />
              Our Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-foreground">{address}</p>
            <div className="aspect-[16/9] w-full relative rounded-md overflow-hidden border">
              <img
                src={mapPlaceholderUrl}
                alt="Map showing Ghar Tak location"

 className="w-full h-full object-cover"
                data-ai-hint="city map"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Phone className="h-6 w-6 mr-3 text-primary" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-foreground">
              For inquiries, support, or feedback, please reach out to us:
            </p>
            <div>
              <h3 className="font-semibold">Phone:</h3>
              <a href={`tel:${phoneNumber.replace(/\s/g, "")}`} className="text-primary hover:underline text-lg">
                {phoneNumber}
              </a>
            </div>
            <div>
              <h3 className="font-semibold">Email:</h3>
              <a href="mailto:info@localfetch.com" className="text-primary hover:underline text-lg">
                info@localfetch.com
              </a>
            </div>
             <p className="text-muted-foreground text-sm mt-4">
              Alternatively, you can visit our office during business hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

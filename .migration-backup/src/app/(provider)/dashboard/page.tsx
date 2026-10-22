
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, Building, Edit3, ImagePlus, ListChecks, PlusCircle, ShoppingCart, Star, Utensils, ShoppingBag } from "lucide-react";

// Mock provider data
const mockProvider = {
  name: "Ahmed's General Store",
  email: "ahmed.store@example.com",
  businessType: "Retail Store & Services",
  avatarUrl: "https://placehold.co/100x100.png",
  dataAiHint: "store owner",
  address: "123 Main Street, Saddar, Karachi",
  phone: "+92 300 1234567",
  description: "Your one-stop shop for daily needs and quick repairs.",
  isRestaurant: true,
};

// Mock data for lists
const mockProductsList = [
  { id: "p1", name: "Basmati Rice (5kg)", price: 1200, stock: 50 },
  { id: "p2", name: "Cooking Oil (1L)", price: 450, stock: 30 },
  { id: "p3", name: "Mobile Charger", price: 800, stock: 100 },
];

const mockServicesList = [
  { id: "s1", name: "Mobile Screen Repair", category: "Tech Repair", priceRange: "PKR 1000-5000" },
  { id: "s2", name: "Basic Plumbing Fix", category: "Plumber", priceRange: "PKR 500-2000" },
];

const mockReviews = [
  { id: "r1", customer: "Aisha K.", rating: 5, comment: "Great service, very fast!", date: "2024-07-15" },
  { id: "r2", customer: "Bilal M.", rating: 4, comment: "Good products, reasonable prices.", date: "2024-07-14" },
];

const mockEnquiries = [
  { id: "e1", customer: "Fatima Z.", subject: "Bulk order discount?", date: "2024-07-16", status: "Pending" },
  { id: "e2", customer: "Omar S.", subject: "Do you stock item X?", date: "2024-07-15", status: "Replied" },
];

const mockGalleryImages = [
  { id: "g1", url: "https://placehold.co/400x300.png?text=Store+Front", alt: "Store Front", dataAiHint: "store front" },
  { id: "g2", url: "https://placehold.co/400x300.png?text=Product+Display", alt: "Product Display", dataAiHint: "product display" },
  { id: "g3", url: "https://placehold.co/400x300.png?text=Service+Area", alt: "Service Area", dataAiHint: "service area" },
];

const mockMenuItems = [
  { id: "m1", name: "Chicken Biryani", price: 350, description: "Classic chicken biryani" },
  { id: "m2", name: "Vegetable Karahi", price: 280, description: "Mixed vegetable curry" },
];


export default function ProviderDashboardPage() {
  const [businessDetails, setBusinessDetails] = useState(mockProvider);

  const handleDetailsSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Saving business details:", businessDetails);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Briefcase className="h-8 w-8 mr-3 text-primary" />
          Provider Dashboard
        </h1>
        <div className="flex items-center space-x-2">
            <Button variant="outline">View Public Profile</Button>
            <Button asChild>
                <Link href="/">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Switch to Buying
                </Link>
            </Button>
        </div>
      </div>

      {/* Business Profile Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-4 bg-muted/30 p-6">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={businessDetails.avatarUrl} alt={businessDetails.name} data-ai-hint={businessDetails.dataAiHint} />
            <AvatarFallback>{businessDetails.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{businessDetails.name}</CardTitle>
            <CardDescription className="text-md">{businessDetails.email}</CardDescription>
            <p className="text-sm text-muted-foreground mt-1">Type: {businessDetails.businessType}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto">
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Business Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Business Details</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDetailsSave} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="providerName">Business Name</Label>
                  <Input id="providerName" value={businessDetails.name} onChange={(e) => setBusinessDetails({...businessDetails, name: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="providerEmail">Contact Email</Label>
                  <Input id="providerEmail" type="email" value={businessDetails.email} onChange={(e) => setBusinessDetails({...businessDetails, email: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="providerType">Business Type</Label>
                  <Input id="providerType" value={businessDetails.businessType} onChange={(e) => setBusinessDetails({...businessDetails, businessType: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="providerAddress">Address</Label>
                  <Input id="providerAddress" value={businessDetails.address} onChange={(e) => setBusinessDetails({...businessDetails, address: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="providerPhone">Phone</Label>
                  <Input id="providerPhone" value={businessDetails.phone} onChange={(e) => setBusinessDetails({...businessDetails, phone: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="providerDescription">Description</Label>
                  <Textarea id="providerDescription" value={businessDetails.description} onChange={(e) => setBusinessDetails({...businessDetails, description: e.target.value})} />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          <p><Building className="inline h-4 w-4 mr-2 text-muted-foreground" /> Address: {businessDetails.address}</p>
          <p className="mt-1">Description: {businessDetails.description}</p>
        </CardContent>
      </Card>

      <Separator />

      {/* Manage Listings Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ListChecks className="h-6 w-6 mr-2 text-primary" />Manage Listings</CardTitle>
          <CardDescription>Add, edit, or remove your products and services.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-4 space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="h-4 w-4 mr-2" /> Add New Product</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label htmlFor="productName">Product Name</Label><Input id="productName" placeholder="e.g., Fresh Apples" /></div>
                    <div><Label htmlFor="productPrice">Price (PKR)</Label><Input id="productPrice" type="number" placeholder="e.g., 200" /></div>
                    <div><Label htmlFor="productStock">Stock Quantity</Label><Input id="productStock" type="number" placeholder="e.g., 50" /></div>
                    <div><Label htmlFor="productDescription">Description</Label><Textarea id="productDescription" placeholder="Briefly describe the product" /></div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button>Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <ScrollArea className="h-72 mt-4 border rounded-md p-4">
                {mockProductsList.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Price: PKR {product.price} | Stock: {product.stock}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
                 {mockProductsList.length === 0 && <p className="text-muted-foreground text-center">No products added yet.</p>}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="services" className="mt-4 space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="h-4 w-4 mr-2" /> Add New Service</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Add New Service</DialogTitle></DialogHeader>
                   <div className="space-y-4 py-4">
                    <div><Label htmlFor="serviceName">Service Name</Label><Input id="serviceName" placeholder="e.g., Plumbing Repair" /></div>
                    <div><Label htmlFor="serviceCategory">Category</Label><Input id="serviceCategory" placeholder="e.g., Home Repair" /></div>
                    <div><Label htmlFor="servicePrice">Price/Range</Label><Input id="servicePrice" placeholder="e.g., PKR 1000 or 500-1500" /></div>
                    <div><Label htmlFor="serviceDescription">Description</Label><Textarea id="serviceDescription" placeholder="Describe the service offered" /></div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button>Add Service</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
               <ScrollArea className="h-72 mt-4 border rounded-md p-4">
                {mockServicesList.map(service => (
                  <div key={service.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">Category: {service.category} | Price: {service.priceRange}</p>
                    </div>
                     <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
                {mockServicesList.length === 0 && <p className="text-muted-foreground text-center">No services added yet.</p>}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Customer Feedback Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Star className="h-6 w-6 mr-2 text-primary" />Customer Feedback</CardTitle>
          <CardDescription>Manage reviews and respond to customer enquiries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reviews">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
              <TabsTrigger value="enquiries">Enquiries/Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-4">
              <ScrollArea className="h-72 border rounded-md p-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="p-2 border-b last:border-b-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{review.customer} - <span className="text-yellow-500">{'\u2605'.repeat(review.rating)}{'\u2606'.repeat(5-review.rating)}</span></p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <p className="text-sm mt-1">{review.comment}</p>
                  </div>
                ))}
                {mockReviews.length === 0 && <p className="text-muted-foreground text-center">No reviews yet.</p>}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="enquiries" className="mt-4">
              <ScrollArea className="h-72 border rounded-md p-4">
                {mockEnquiries.map(enquiry => (
                  <div key={enquiry.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{enquiry.customer}: <span className="font-normal">{enquiry.subject}</span></p>
                      <p className="text-xs text-muted-foreground">{enquiry.date} - Status: {enquiry.status}</p>
                    </div>
                    <Button variant="outline" size="sm">View/Reply</Button>
                  </div>
                ))}
                {mockEnquiries.length === 0 && <p className="text-muted-foreground text-center">No enquiries yet.</p>}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Gallery Management Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ImagePlus className="h-6 w-6 mr-2 text-primary" />Manage Gallery</CardTitle>
          <CardDescription>Showcase your store, products, or services with images.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button><PlusCircle className="h-4 w-4 mr-2" /> Upload New Image</Button>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {mockGalleryImages.map(image => (
              <div key={image.id} className="relative aspect-video rounded-md overflow-hidden border">
                <img src={image.url} alt={image.alt} className="object-cover w-full h-full" data-ai-hint={image.dataAiHint} />
                <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {mockGalleryImages.length === 0 && <p className="text-muted-foreground col-span-full text-center">No images uploaded yet.</p>}
          </div>
        </CardContent>
      </Card>

      {businessDetails.isRestaurant && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Utensils className="h-6 w-6 mr-2 text-primary" />Manage Menu</CardTitle>
            <CardDescription>For restaurants and cafes: add or update your menu items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="h-4 w-4 mr-2" /> Add Menu Item</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Add Menu Item</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div><Label htmlFor="menuItemName">Item Name</Label><Input id="menuItemName" placeholder="e.g., Chicken Biryani" /></div>
                    <div><Label htmlFor="menuItemPrice">Price (PKR)</Label><Input id="menuItemPrice" type="number" placeholder="e.g., 350" /></div>
                    <div><Label htmlFor="menuItemDescription">Description</Label><Textarea id="menuItemDescription" placeholder="Describe the menu item" /></div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            <ScrollArea className="h-72 mt-4 border rounded-md p-4">
              {mockMenuItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">PKR {item.price} - {item.description}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              ))}
              {mockMenuItems.length === 0 && <p className="text-muted-foreground text-center">No menu items added yet.</p>}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><ShoppingBag className="h-6 w-6 mr-2 text-primary" />Orders & Bookings</CardTitle>
          <CardDescription>View and manage incoming orders and service bookings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-center py-8">Order and booking management features will appear here.</p>
        </CardContent>
      </Card>

    </div>
  );
}

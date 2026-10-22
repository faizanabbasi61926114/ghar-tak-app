
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Store, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function BecomeProviderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you'd handle form submission to your backend here.
    toast({
      title: "Application Submitted!",
      description: "Welcome! Redirecting you to your new provider dashboard.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="text-center mb-12">
        <Briefcase className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline text-primary">Join Ghar Tak as a Provider</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Offer your products or services to thousands of local customers.
        </p>
      </div>

      <Card className="shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Register Your Business</CardTitle>
            <CardDescription>Fill out the form below to get started. We'll review your application and get back to you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="e.g., Mike's Plumbing, FreshMart Online" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Type of Business</Label>
              <Input id="businessType" placeholder="e.g., Store, Service Provider, Restaurant" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea id="description" placeholder="Tell us a bit about what you offer..." rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input id="address" placeholder="123 Main St, Anytown" required />
            </div>
            <Button type="submit" className="w-full text-lg py-6">
              Submit Application
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2 items-center text-sm text-muted-foreground">
          <p>By applying, you agree to our <Link href="/terms-of-service" className="underline hover:text-primary">Terms for Providers</Link>.</p>
          <p>
            Already have a provider account?{" "}
            <Link href="/signin" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-headline font-semibold mb-6">Why Partner with Ghar Tak?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
            <Store className="h-12 w-12 text-accent mb-3" />
            <h3 className="text-lg font-semibold mb-1">Reach More Customers</h3>
            <p className="text-muted-foreground text-sm">Expand your reach in your local community and connect with new customers.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
            <Briefcase className="h-12 w-12 text-accent mb-3" />
            <h3 className="text-lg font-semibold mb-1">Easy Management</h3>
            <p className="text-muted-foreground text-sm">Manage your listings, orders, and bookings through our simple platform.</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
            <CheckCircle className="h-12 w-12 text-accent mb-3" />
            <h3 className="text-lg font-semibold mb-1">Grow Your Business</h3>
            <p className="text-muted-foreground text-sm">Leverage our marketing and tools to increase your sales and service bookings.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, PackageSearch, RefreshCw, Send, Truck } from "lucide-react";

export default function SupportPage() {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setTrackingResult("Please enter a valid tracking ID.");
      return;
    }
    setIsLoadingTracking(true);
    setTrackingResult(null);
    // Simulate API call
    setTimeout(() => {
      // Mock responses based on tracking ID for demonstration
      if (trackingId.toLowerCase() === "ghar123") {
        setTrackingResult(`Order ${trackingId}: Shipped. Expected delivery: 2-3 business days.`);
      } else if (trackingId.toLowerCase() === "tak456") {
        setTrackingResult(`Order ${trackingId}: Out for delivery. Arriving today.`);
      } else {
        setTrackingResult(`Order ${trackingId}: No information found. Please check the ID or contact support.`);
      }
      setIsLoadingTracking(false);
    }, 1500);
  };

  const supportFAQs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order using the 'Track Your Order' section on this page. Enter your tracking ID provided in your order confirmation email.",
    },
    {
      question: "What is your return policy?",
      answer: "Please refer to our 'Refund Policy' section above for detailed information on returns and refunds. Generally, items can be returned within 7 days if they are in original condition.",
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary depending on your location and the vendor. Estimated delivery times are provided at checkout and can be found in the 'Shipping Information' section.",
    },
    {
      question: "What if I receive a damaged item?",
      answer: "We're sorry to hear that! Please contact our support team immediately with your order number and photos of the damaged item. We'll arrange for a replacement or refund.",
    },
     {
      question: "How can I contact customer support?",
      answer: "You can reach us via the contact details provided on our Contact Us page. For urgent issues, please call us.",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl space-y-12">
      <header className="text-center mb-12">
        <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Customer Support
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          We're here to help! Find answers and track your orders.
        </p>
      </header>

      <section id="order-tracking">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <PackageSearch className="h-6 w-6 mr-3 text-primary" />
              Track Your Order
            </CardTitle>
            <CardDescription>Enter your tracking ID to see the status of your shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter Tracking ID (e.g., GHAR123)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-grow text-base h-11"
                  aria-label="Tracking ID"
                />
                <Button type="submit" className="w-full sm:w-auto h-11" disabled={isLoadingTracking}>
                  {isLoadingTracking ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Track Order
                </Button>
              </div>
            </form>
            {trackingResult && (
              <div className="mt-6 p-4 bg-muted/50 rounded-md border">
                <p className="text-foreground">{trackingResult}</p>
              </div>
            )}
             {isLoadingTracking && !trackingResult && (
              <div className="mt-6 p-4 bg-muted/50 rounded-md border flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">Fetching tracking details...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="refund-policy">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <RefreshCw className="h-6 w-6 mr-3 text-primary" />
              Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert max-w-none">
            <p>Our goal is to ensure you are completely satisfied with your purchases from Ghar Tak. If you are not satisfied, you may be eligible for a refund or exchange subject to the conditions below.</p>
            <h3 className="font-semibold text-foreground">Eligibility for Refund:</h3>
            <ul>
              <li>Products must be returned within 7 days of receipt.</li>
              <li>Products must be in their original, unopened, and undamaged condition.</li>
              <li>Perishable goods (e.g., fresh food) are generally not eligible for return unless received damaged or spoiled.</li>
              <li>Services once rendered are typically non-refundable, but please contact us if you have issues.</li>
            </ul>
            <h3 className="font-semibold text-foreground">Process:</h3>
            <p>To initiate a refund, please contact our customer support with your order number and reason for return. We may require photographic evidence for damaged goods. Once approved, you will receive instructions on how to return the item. Refunds will be processed to your original payment method within 5-7 business days after we receive and inspect the returned item.</p>
            <p className="text-sm"><em>Ghar Tak reserves the right to amend this policy at any time.</em></p>
          </CardContent>
        </Card>
      </section>

      <section id="shipping-info">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Truck className="h-6 w-6 mr-3 text-primary" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert max-w-none">
            <p>Ghar Tak aims to deliver your orders as quickly and efficiently as possible. Our hyperlocal model connects you with the nearest vendors and service providers.</p>
            <h3 className="font-semibold text-foreground">Delivery Times:</h3>
            <ul>
              <li><strong>Hyperlocal (Selected Areas):</strong> We aim for a 5-15 minute ETA for products from nearby stores.</li>
              <li><strong>Standard Delivery:</strong> For most products, delivery within Lahore, Karachi, and Islamabad is typically within 1-3 hours. Other cities may take 24-72 hours.</li>
              <li><strong>Services:</strong> Service professional arrival times are confirmed upon booking and depend on their availability.</li>
            </ul>
            <h3 className="font-semibold text-foreground">Shipping Costs:</h3>
            <p>Delivery fees vary based on distance, order size, and urgency. The applicable fee will be clearly displayed at checkout. Some promotions may offer free delivery.</p>
            <h3 className="font-semibold text-foreground">Order Tracking:</h3>
            <p>Once your order is dispatched or a service is confirmed, you will receive a tracking ID (if applicable) which you can use on our 'Track Your Order' section on this page or through the link in your confirmation email/SMS.</p>
             <p className="text-sm"><em>Please note that delivery times are estimates and can be affected by traffic, weather, or other unforeseen circumstances.</em></p>
          </CardContent>
        </Card>
      </section>

      <section id="faqs">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <HelpCircle className="h-6 w-6 mr-3 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {supportFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground prose dark:prose-invert max-w-none">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// Loader icon for button
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

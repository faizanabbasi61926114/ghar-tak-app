import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Link } from 'wouter';
import { ArrowLeft, MapPin, Star, CalendarClock, ShoppingBag, Phone, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/react';

export default function ServiceProviderDetailPage({ params }: { params: { category: string; id: string } }) {
  const { serviceProviders, serviceCategories } = useData();
  const { user } = useUser();
  const { toast } = useToast();
  const provider = serviceProviders.find(p => p.id === params.id);

  const [msgOpen, setMsgOpen] = useState(false);
  const [name, setName] = useState(user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '');
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress ?? '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!provider) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Service provider not found</h1>
        <Link href="/services" className="text-primary hover:underline">Back to all services</Link>
      </div>
    );
  }

  const category = serviceCategories.find(c => c.id === provider.serviceCategory);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          providerId: provider.id,
          providerName: provider.name,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      toast({ variant: 'destructive', title: 'Send failed', description: 'Could not send your message. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link href={`/services/${provider.serviceCategory}`} className="flex items-center text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {category ? `Back to ${category.name}` : 'Back to services'}
        </Link>

        <div className="rounded-xl overflow-hidden aspect-[16/7] w-full mb-6">
          <img
            src={provider.imageUrl || `https://placehold.co/800x350.png?text=${encodeURIComponent(provider.name)}`}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">{provider.name}</h1>
            {category && <Badge variant="secondary" className="mb-3">{category.name}</Badge>}
            {provider.description && <p className="text-muted-foreground">{provider.description}</p>}
          </div>
          {provider.rating && (
            <div className="flex items-center gap-1 text-yellow-500 font-semibold text-lg flex-shrink-0">
              <Star className="h-5 w-5 fill-yellow-500" />
              {Number(provider.rating ?? 0).toFixed(1)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Location</p>
              <p className="text-muted-foreground text-sm">{provider.location.address || 'Service area varies'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <CalendarClock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Availability</p>
              <p className="text-muted-foreground text-sm">{provider.availability}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {provider.productsSold && provider.productsSold.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Products Also Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {provider.productsSold.map((product, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {product}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="flex-1">
          <CalendarClock className="mr-2 h-5 w-5" />
          Book Now
        </Button>
        <Button size="lg" variant="outline" className="flex-1" onClick={() => { setSent(false); setMsgOpen(true); }}>
          <MessageSquare className="mr-2 h-5 w-5" />
          Message Provider
        </Button>
        <Button size="lg" variant="outline" className="flex-1" asChild>
          <a href="tel:+923315033761">
            <Phone className="mr-2 h-5 w-5" />
            Call
          </a>
        </Button>
      </div>

      {/* Message dialog */}
      <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Message {provider.name}
            </DialogTitle>
            <DialogDescription>
              Your message will be forwarded to the provider and Ghar Tak team.
            </DialogDescription>
          </DialogHeader>
          {sent ? (
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <CheckCircle className="h-14 w-14 text-green-500" />
              <p className="font-semibold text-lg">Message sent!</p>
              <p className="text-muted-foreground text-sm">The provider will get back to you soon.</p>
              <Button variant="outline" onClick={() => setMsgOpen(false)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3 pt-2">
              <div>
                <Label htmlFor="msg-name">Your Name</Label>
                <Input id="msg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="msg-email">Email</Label>
                <Input id="msg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="msg-body">Message</Label>
                <Textarea id="msg-body" value={message} onChange={e => setMessage(e.target.value)} placeholder={`Hi ${provider.name}, I'd like to enquire about...`} rows={4} required className="mt-1" />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

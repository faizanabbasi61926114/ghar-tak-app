import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@workspace/api-client-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Minus, Plus, Trash2, ShoppingCart, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateOrderRequestPaymentMethod } from '@workspace/api-client-react';

const PAYMENT_LABELS: Record<string, string> = {
  cash_on_delivery: 'Cash on Delivery',
  jazzcash: 'JazzCash',
  easypaisa: 'EasyPaisa',
  card: 'Card',
};

export default function CartDrawer() {
  const { items, providerId, providerName, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string>(CreateOrderRequestPaymentMethod.cash_on_delivery);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [ordered, setOrdered] = useState(false);
  const { toast } = useToast();

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        setOrdered(true);
        clearCart();
        toast({
          title: '🎉 Order placed!',
          description: `Your order #${order.id.slice(0, 8)} from ${order.providerName} has been placed and is pending confirmation.`,
        });
        // Reset and close after a short delay so user sees the success state
        setTimeout(() => {
          setOrdered(false);
          closeCart();
          setDeliveryAddress('');
          setNotes('');
          setPaymentMethod(CreateOrderRequestPaymentMethod.cash_on_delivery);
        }, 2500);
      },
      onError: () => {
        toast({
          title: 'Order failed',
          description: 'Unable to place your order. Please try again.',
          variant: 'destructive',
        });
      },
    },
  });

  function handlePlaceOrder() {
    if (!providerId || items.length === 0) return;
    createOrder({
      data: {
        providerId,
        paymentMethod: paymentMethod as (typeof CreateOrderRequestPaymentMethod)[keyof typeof CreateOrderRequestPaymentMethod],
        deliveryAddress: deliveryAddress || undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          serviceId: null,
          name: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      },
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <SheetContent className="flex flex-col w-full sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Your Cart
            {totalItems > 0 && (
              <Badge className="ml-1">{totalItems}</Badge>
            )}
          </SheetTitle>
          {providerName && (
            <p className="text-sm text-muted-foreground">From: <span className="font-medium text-foreground">{providerName}</span></p>
          )}
        </SheetHeader>

        {ordered ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Order Placed!</h3>
            <p className="text-muted-foreground text-sm">Your order has been submitted. The provider will confirm shortly.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
            <h3 className="text-lg font-medium text-muted-foreground">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add products from a store to get started.</p>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto space-y-3 py-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 bg-muted/40 rounded-lg p-3">
                  <img
                    src={product.imageUrl || `https://placehold.co/56x56.png?text=${encodeURIComponent(product.name[0])}`}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-primary text-sm font-semibold mt-0.5">PKR {product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeItem(product.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Checkout form */}
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">PKR {totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payment-method" className="text-sm">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CreateOrderRequestPaymentMethod).map((m) => (
                      <SelectItem key={m} value={m}>{PAYMENT_LABELS[m] ?? m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="delivery-address" className="text-sm">Delivery Address <span className="text-muted-foreground">(optional)</span></Label>
                <Input
                  id="delivery-address"
                  placeholder="Enter your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="text-sm">Notes <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </div>

            <SheetFooter className="pt-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isPending || items.length === 0}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  `Place Order · PKR ${totalPrice.toFixed(2)}`
                )}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

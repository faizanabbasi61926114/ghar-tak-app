import {
  useListPlans,
  useGetMySubscription,
  useSubscribeToPlan,
  useGetMyProvider,
  getListPlansQueryKey,
  getGetMySubscriptionQueryKey,
  getGetMyProviderQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@clerk/react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const { data: plans, isLoading: plansLoading } = useListPlans({ query: { queryKey: getListPlansQueryKey() } });
  const { data: myProvider, isLoading: providerLoading } = useGetMyProvider({
    query: { enabled: !!user, queryKey: getGetMyProviderQueryKey(), retry: false },
  });
  const isProvider = !!myProvider;
  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = useGetMySubscription({
    query: { enabled: isProvider, queryKey: getGetMySubscriptionQueryKey(), retry: false },
  });

  const subscribeMutation = useSubscribeToPlan();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    subscribeMutation.mutate(
      { data: { planId } },
      {
        onSuccess: () => {
          toast({ title: "Subscribed successfully", description: "Your plan has been updated." });
          refetchSub();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to subscribe to plan.", variant: "destructive" });
        }
      }
    );
  };

  if (plansLoading || !isLoaded || (!!user && providerLoading) || (isProvider && subLoading)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-primary">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the right plan to grow your business on Ghar Tak. No hidden fees.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {(Array.isArray(plans) ? plans : []).map((plan) => {
          const isCurrentPlan = subscription?.planId === plan.id;
          
          return (
            <Card key={plan.id} className={`flex flex-col relative ${plan.isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold font-headline">{plan.name}</CardTitle>
                <CardDescription className="pt-1.5">
                  <span className="text-3xl font-bold text-foreground">PKR {Number(plan.price ?? 0).toLocaleString()}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Up to {plan.productLimit} Products</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Up to {plan.serviceLimit} Services</span>
                  </li>
                  {plan.features?.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {user ? (
                  isProvider ? (
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : (plan.isPopular ? "default" : "outline")}
                      disabled={isCurrentPlan || subscribeMutation.isPending}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {subscribeMutation.isPending && !isCurrentPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isCurrentPlan ? "Current Plan" : "Upgrade"}
                    </Button>
                  ) : (
                    <Button className="w-full" variant={plan.isPopular ? "default" : "outline"} asChild>
                      <Link href="/become-provider">Become a Provider</Link>
                    </Button>
                  )
                ) : (
                  <Button className="w-full" variant={plan.isPopular ? "default" : "outline"} asChild>
                    <Link href="/sign-up">Sign up to Start</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {!plans?.length && (
         <div className="text-center py-12 bg-muted/50 rounded-xl border">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No plans available</h3>
            <p className="text-muted-foreground">Please check back later or contact support.</p>
         </div>
      )}
    </div>
  );
}

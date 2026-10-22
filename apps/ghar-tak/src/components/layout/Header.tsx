import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Menu, LogOut, Loader2, QrCode, Image as ImageIcon, Briefcase, Heart, CreditCard, ShoppingCart, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from '@/components/shared/ThemeToggleButton';
import { useUser, useClerk } from '@clerk/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { totalItems, openCart } = useCart();

  const navLinks = [
    { href: "/", label: "Near Me" },
    { href: "/services", label: "Services" },
    { href: "/stores", label: "Stores" },
    { href: "/pricing", label: "Pricing" },
  ];
  
  const conditionalNavLinks = user
    ? [
        { href: "/favorites", label: "Favorites" },
        { href: "/messages", label: "Messages" },
      ]
    : [];
  
  const allNavLinks = [...navLinks, ...conditionalNavLinks];

  const UserMenuItems = () => {
    if (!isLoaded) {
      return <DropdownMenuItem disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</DropdownMenuItem>;
    }
    if (user) {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link href="/profile">My Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/messages">Messages</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Provider Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ redirectUrl: basePath || "/" })} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </DropdownMenuItem>
        </>
      );
    }
    return (
      <>
        <DropdownMenuItem asChild>
          <Link href="/sign-in">Sign In</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/sign-up">Sign Up</Link>
        </DropdownMenuItem>
      </>
    );
  };
  
  const MobileNavLinks = () => (
    <>
      {allNavLinks.map(link => (
        <SheetClose asChild key={`mobile-${link.label}`}>
          <Link href={link.href} className="text-muted-foreground hover:text-foreground py-1 block">
            {link.label}
          </Link>
        </SheetClose>
      ))}
       <SheetClose asChild>
        <Link href="/qr-scanner" className="text-muted-foreground hover:text-foreground py-1 flex items-center">
           <QrCode className="mr-2 h-4 w-4" /> QR Scanner
        </Link>
      </SheetClose>
       <SheetClose asChild>
        <Link href="/image-analyzer" className="text-muted-foreground hover:text-foreground py-1 flex items-center">
           <ImageIcon className="mr-2 h-4 w-4" /> Image Analyzer
        </Link>
      </SheetClose>
      {user && (
        <SheetClose asChild>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground py-1 flex items-center">
                <Briefcase className="mr-2 h-4 w-4" /> Provider Dashboard
            </Link>
        </SheetClose>
      )}
      {user && (
        <SheetClose asChild>
            <Link href="/messages" className="text-muted-foreground hover:text-foreground py-1 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" /> Messages
            </Link>
        </SheetClose>
      )}
      <DropdownMenuSeparator className="my-2"/>
      {!isLoaded && <div className="text-muted-foreground py-1 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</div>}
      {isLoaded && user && (
        <>
          <SheetClose asChild>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground py-1 block">My Account</Link>
          </SheetClose>
          <DropdownMenuSeparator className="my-2"/>
          <SheetClose asChild>
            <Button variant="ghost" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="text-muted-foreground hover:text-foreground justify-start px-0 py-1 w-full">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </SheetClose>
        </>
      )}
      {isLoaded && !user && (
         <>
          <SheetClose asChild>
            <Link href="/sign-in" className="text-muted-foreground hover:text-foreground py-1 block">Sign In</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/sign-up" className="text-muted-foreground hover:text-foreground py-1 block">Sign Up</Link>
          </SheetClose>
        </>
      )}
    </>
  );

  return (
    <header className="glass sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Ghar Tak" className="h-10 w-10 rounded-md object-contain" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-grow justify-center">
          {allNavLinks.map(link => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center md:hidden flex-1">
            <Link href="/" className="flex items-center">
                <img src="/logo.png" alt="Ghar Tak" className="h-10 w-10 rounded-md object-contain" />
            </Link>
        </div>


        <div className="flex items-center space-x-2 ml-auto">
           <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/qr-scanner">
              <QrCode className="h-5 w-5" />
              <span className="sr-only">QR Code Scanner</span>
            </Link>
          </Button>
           <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/image-analyzer">
              <ImageIcon className="h-5 w-5" />
              <span className="sr-only">Image Analyzer</span>
            </Link>
          </Button>
          {isLoaded && user && (
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
              <Link href="/dashboard">
                <Briefcase className="h-5 w-5" />
                <span className="sr-only">Provider Dashboard</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" onClick={openCart} aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {totalItems > 99 ? '99+' : totalItems}
              </Badge>
            )}
          </Button>

          <ThemeToggleButton />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                {user ? (
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>{user.firstName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle className="h-5 w-5" />
                )}
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user ? (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                ) : "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <UserMenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center mb-6 px-4">
                <img src="/logo.png" alt="Ghar Tak" className="h-10 w-10 rounded-md object-contain" />
              </Link>
              <div className="flex flex-col space-y-1 px-4">
                <MobileNavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

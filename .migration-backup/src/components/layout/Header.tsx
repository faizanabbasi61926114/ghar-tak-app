"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircle, Menu, LogOut, Loader2, QrCode, Image as ImageIcon, Briefcase, Heart } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Near Me" },
    { href: "/services", label: "Services" },
    { href: "/stores", label: "Stores" },
  ];
  
  const conditionalNavLinks = user 
    ? [
        { href: "/favorites", label: "Favorites" },
      ] 
    : [];
  
  const allNavLinks = [...navLinks, ...conditionalNavLinks];

  const UserMenuItems = () => {
    if (loading) {
      return <DropdownMenuItem disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</DropdownMenuItem>;
    }
    if (user) {
      return (
        <>
          <DropdownMenuItem asChild>
            <Link href="/profile">My Account</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </DropdownMenuItem>
        </>
      );
    }
    return (
      <>
        <DropdownMenuItem asChild>
          <Link href="/signin">Sign In</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/signup">Sign Up</Link>
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
                <Briefcase className="mr-2 h-4 w-4" /> Switch to Selling
            </Link>
        </SheetClose>
      )}
      <DropdownMenuSeparator className="my-2"/>
      {loading && <div className="text-muted-foreground py-1 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</div>}
      {!loading && user && (
        <>
          <SheetClose asChild>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground py-1 block">My Account</Link>
          </SheetClose>
          <DropdownMenuSeparator className="my-2"/>
          <SheetClose asChild>
            <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground justify-start px-0 py-1 w-full">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </SheetClose>
        </>
      )}
      {!loading && !user && (
         <>
          <SheetClose asChild>
            <Link href="/signin" className="text-muted-foreground hover:text-foreground py-1 block">Sign In</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/signup" className="text-muted-foreground hover:text-foreground py-1 block">Sign Up</Link>
          </SheetClose>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center">
            <span className="font-bold font-headline text-lg">Ghar Tak</span>
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
                <span className="font-bold font-headline text-lg">Ghar Tak</span>
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
          {!loading && user && (
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
              <Link href="/dashboard">
                <Briefcase className="h-5 w-5" />
                <span className="sr-only">Switch to Selling</span>
              </Link>
            </Button>
          )}
          <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? (user.email || "My Account") : "My Account"}</DropdownMenuLabel>
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
                <span className="font-bold font-headline text-lg">Ghar Tak</span>
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

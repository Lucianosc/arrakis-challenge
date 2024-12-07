"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "lucide-react";

// Types
interface HeaderMenuLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Navigation Links Configuration
const menuLinks: HeaderMenuLink[] = [];

// Navigation Links Component
const NavigationLinks: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => (
        <li key={href} className="list-none">
          <Link
            href={href}
            className={`
              ${pathname === href ? "bg-amber-900/40" : ""}
              hover:bg-amber-800/30 
              px-3 py-1.5 rounded-full text-sm text-amber-100
              flex items-center gap-2 transition-colors
            `}
          >
            {icon}
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </>
  );
};

// Main Header Component
export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky lg:static top-0 z-20 w-full">
      <nav className="flex justify-between items-center min-h-[4rem] px-0 sm:px-2 bg-neutral-900 border-b border-amber-900/20">
        {/* Left Section */}
        <div className="flex items-center w-auto lg:w-1/2">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 text-amber-100 hover:bg-amber-900/20 hover:text-amber-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-neutral-800 border-amber-900/20">
              <nav className="flex flex-col gap-2 mt-4">
                <NavigationLinks />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 ml-4 mr-6 h-10">
            <div className="flex flex-col">
              <h2 className="font-bold text-xl text-amber-50 mb-0 leading-none">Arrakis challenge</h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex lg:items-center gap-2">
            <NavigationLinks />
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center mr-4">
          <ConnectButton showBalance={false} />
        </div>
      </nav>
    </header>
  );
};

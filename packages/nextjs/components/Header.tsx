"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

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
        <li key={href}>
          <Link
            href={href}
            className={`
              ${pathname === href ? "bg-secondary shadow-md" : ""}
              hover:bg-secondary hover:shadow-md focus:bg-secondary
              active:text-neutral py-1.5 px-3 text-sm rounded-full
              gap-2 grid grid-flow-col
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useOutsideClick(burgerMenuRef, handleOutsideClick);

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  return (
    <header className="sticky lg:static top-0 z-20 w-full">
      <nav className="navbar bg-base-100 min-h-0 flex-shrink-0 justify-between shadow-md shadow-secondary px-0 sm:px-2">
        {/* Left Section */}
        <div className="navbar-start w-auto lg:w-1/2">
          {/* Mobile Menu */}
          {/* <div className="lg:hidden dropdown" ref={burgerMenuRef}>
            <button
              type="button"
              aria-label="Toggle menu"
              className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
              onClick={toggleDrawer}
            >
              <Bars3Icon className="h-1/2" />
            </button>

            {isDrawerOpen && (
              <ul
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                onClick={handleOutsideClick}
              >
                <NavigationLinks />
              </ul>
            )}
          </div> */}

          {/* Desktop Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 ml-4 mr-6 shrink-0 h-10">
            <div className="flex flex-col">
              <h2 className="font-bold leading-tight text-xl m-0">Arrakis challenge</h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
            <NavigationLinks />
          </ul> */}
        </div>

        {/* Right Section */}
        <div className="navbar-end flex-grow mr-4">
          <ConnectButton showBalance={false} />
          <FaucetButton />
        </div>
      </nav>
    </header>
  );
};

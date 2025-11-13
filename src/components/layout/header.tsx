'use client';

import { useState } from 'react';
import { signOut, useSession } from '@/lib/auth-client';
import { Package, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


type AuthUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role: "admin" | "user";
};

export default function Header() {

    const { data: session, isPending } = useSession();
    const user = session?.user as AuthUser; 
    console.log(user);
    
    const isAdminUser = user?.role === "admin";


  const pathName = usePathname();
  const router = useRouter();
  const isLoginPage: boolean = pathName === '/login';

  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoginPage) return null;

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {

      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-teal-500">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg md:text-xl text-gray-800">
            Invoice Platform
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/gallery" className="text-sm font-medium hover:text-teal-600 transition-colors">
            Gallery
          </Link>

          {!isPending && user && !isAdminUser && (
            <>
              <Link href="/user-dashboard/assets" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Assets
              </Link>
              <Link href="/user-dashboard/purchases" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Purchases
              </Link>
            </>
          )}

          {!isPending && user && isAdminUser && (
            <>
              <Link href="/admin-dashboard/asset-approval" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Asset Approval
              </Link>
              <Link href="/admin-dashboard/settings" className="text-sm font-medium hover:text-teal-600 transition-colors">
                Settings
              </Link>
            </>
          )}
        </nav>

        {/* Right: Profile / Login */}
        <div className="flex items-center gap-4">
          {isPending ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Login</Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-white shadow-inner"
          >
            <div className="flex flex-col p-4 space-y-3">
              <Link
                href="/gallery"
                className="text-sm font-medium hover:text-teal-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Gallery
              </Link>

              {!isPending && user && !isAdminUser && (
                <>
                  <Link
                    href="/user-dashboard/assets"
                    className="text-sm font-medium hover:text-teal-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Assets
                  </Link>
                  <Link
                    href="/user-dashboard/purchases"
                    className="text-sm font-medium hover:text-teal-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Purchases
                  </Link>
                </>
              )}

              {!isPending && user && isAdminUser && (
                <>
                  <Link
                    href="/admin-dashboard/asset-approval"
                    className="text-sm font-medium hover:text-teal-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Asset Approval
                  </Link>
                  <Link
                    href="/admin-dashboard/settings"
                    className="text-sm font-medium hover:text-teal-600 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

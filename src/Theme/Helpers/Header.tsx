"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useAppSelector } from "@/lib/redux/hook";
import { useCart } from "@/context/Cart-Context";
import SearchOverlay from "./SearchOverlay";
import { settings } from "@/lib/redux/features/website/settings";
import { getAuthToken } from "@/services/Auth-Token";
import { logoutUser } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../shadcn/components/ui/tooltip";
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const websiteData = useAppSelector((state) => state.website.data);
  const { openCart } = useCart();
  const { logo, store_name } = settings();
  const token = getAuthToken();

  const Logout = async () => {
    const response = await logoutUser();
    if (response) {
      toast.success("Logout successful.");
      router.push("/sign-in");
      localStorage.removeItem("auth");
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* ── Desktop header — always fixed, always white ── */}
      <header className="font-manrope w-full hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="border-b border-gray-200 bg-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-widest flex-shrink-0"
            >
              {logo !== "" ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
                  alt="Logo"
                  height={70}
                  width={70}
                />
              ) : (
                <p className="capitalize">{store_name}</p>
              )}
            </Link>

            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="py-5 text-[12px] font-semibold text-gray-900 hover:text-black"
              >
                HOME
              </Link>
              <NavItem
                label="SHOP"
                categories={websiteData?.productCategories}
              />
              <Link
                href="/about-us"
                className="py-5 text-[12px] font-semibold text-gray-900 hover:text-black"
              >
                ABOUT US
              </Link>
              <Link
                href="/blogs"
                className="py-5 text-[12px] font-semibold text-gray-900 hover:text-black"
              >
                BLOGS
              </Link>
              <Link
                href="/contact-us"
                className="py-5 text-[12px] font-semibold text-gray-900 hover:text-black"
              >
                CONTACTS
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-gray-600">
              {token ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={Logout}
                      className="hover:text-gray-900 cursor-pointer"
                    >
                      <LogOut size={20} />
                      <span className="sr-only">Logout</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/sign-in" className="hover:text-gray-900">
                      <LogIn size={20} />
                      <span className="sr-only">Login</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/profile/dashboard"
                    className="hover:text-gray-900"
                  >
                    <User size={20} />
                    <span className="sr-only">Account</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchOpen(true);
                }}
                className="hover:text-gray-900"
              >
                <Search size={20} />
                <span className="sr-only">Search</span>
              </Link>
              <Link href="/wishlist" className="hover:text-gray-900">
                <Heart size={20} />
                <span className="sr-only">Wishlist</span>
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openCart();
                }}
                className="hover:text-gray-900"
              >
                <ShoppingBag size={20} />
                <span className="sr-only">Cart</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile header — always fixed, always white ── */}
      <header className="font-manrope w-full flex items-center justify-between px-4 py-3 lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link href="/" className="text-lg font-bold tracking-widest">
          {logo !== "" ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${logo}`}
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <p>SHOPICO ECOM</p>
          )}
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSearchOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <Search size={20} />
            <span className="sr-only">Search</span>
          </Link>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openCart();
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <ShoppingBag size={20} />
            <span className="sr-only">Cart</span>
          </Link>
        </div>
      </header>

      <MobileMenuDrawer
        open={mobileMenuOpen}
        categories={websiteData?.productCategories}
        onClose={() => setMobileMenuOpen(false)}
      />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
}
interface NavItemProps {
  label: string;
  categories?: Category[];
}

function NavItem({ label, categories }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const showCategoriesDropdown =
    label === "SHOP" && categories && categories.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="py-5">
      <button
        ref={buttonRef}
        onClick={() => showCategoriesDropdown && setIsOpen(!isOpen)}
        onMouseOver={() => setIsOpen(true)}
        className="flex items-center cursor-pointer text-[12px] font-semibold text-gray-900 hover:text-black"
      >
        {label}
        {showCategoriesDropdown && (
          <ChevronDown
            size={16}
            className={`ml-1 text-gray-900 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {showCategoriesDropdown && isOpen && (
        <div
          ref={dropdownRef}
          onMouseOver={() => setIsOpen(true)}
          onMouseOut={() => setIsOpen(false)}
          className="absolute left-0 right-0 top-full z-50 w-screen bg-white shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-4 gap-6 px-12 py-6">
            {categories!.map((category) => (
              <ul key={category.id} className="space-y-2">
                <CategoryItem category={category} />
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryItem({
  category,
  depth = 0,
}: {
  category: Category;
  depth?: number;
}) {
  return (
    <li className={`ml-${depth * 4}`}>
      <Link
        href={`/shop/${category.slug}`}
        className={`block hover:text-black ${depth === 0 ? "font-bold text-gray-900" : depth === 1 ? "text-gray-600" : "text-gray-500 text-sm"}`}
      >
        {category.name}
      </Link>
      {category.children && category.children.length > 0 && (
        <ul className="mt-2 space-y-2">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import ThemeLayout from "./Layout";
import Header from "./Helpers/Header";
import Footer from "./Helpers/Footer";
import CartDrawer from "./Helpers/Cart-Drawer";
import { fetchCart } from "@/lib/redux/features/cart/thunk";

/*
  Header heights:
    Desktop  : logo 70px + py-1 (4px top+bottom) + border-b ≈ 100px  → pt-[100px]
    Mobile   : logo 48px + py-3 (12px top+bottom) + border-b ≈ 74px  → pt-[74px]

  The spacer lives HERE — not inside <Header> — so the banner in <children>
  starts exactly at the bottom edge of the fixed header with zero extra gap.
*/

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <ThemeLayout>
      <Header />

      {/* ── Single spacer that offsets all page content below the fixed header ── */}
      <div className="hidden lg:block h-[100px]" aria-hidden="true" />
      <div className="lg:hidden h-[74px]" aria-hidden="true" />

      {children}
      <Footer />
      <CartDrawer />
    </ThemeLayout>
  );
}

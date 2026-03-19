"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hook";
import { Button } from "../shadcn/components/ui/button";

interface Slide {
  id: number;
  badge: string | null;
  title_one: string | null;
  title_two: string | null;
  image: string;
  status: number;
  serial: number;
  slider_location: string | null;
  product_slug: string | null;
  created_at: string;
  updated_at: string;
}

export default function HeroSlider() {
  const slides: Slide[] = useAppSelector(
    (state) => state.homepage.data?.sliders || [],
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) return null;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  return (
    <section
      className="
    relative
    w-screen
    overflow-hidden
    bg-black
    aspect-[1920/700]
  "
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0
            transition-opacity duration-1000
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}
          `}
        >
          {/* Image wrapper */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={sliderImport}
              alt={slide.title_one ?? `Slide ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
            <div className="max-w-3xl">
              {slide.title_one && (
                <h1 className="mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
                  {slide.title_one}
                </h1>
              )}

              {slide.title_two && (
                <p className="mb-6 text-sm sm:text-base md:text-lg lg:text-xl text-white drop-shadow">
                  {slide.title_two}
                </p>
              )}

              {slide.badge && slide.product_slug && (
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-white bg-white/10 backdrop-blur-sm px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white hover:text-black transition-colors"
                >
                  <a href={`/shop/${slide.product_slug}`}>{slide.badge}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${index === currentSlide ? "bg-white w-8" : "bg-white/50 w-4"}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState } from "react";
import AnnouncementMarquee from "@/Theme/Helpers/service-marque";
import ProductSlider from "@/Theme/Helpers/Product-Slider";
import HeroSlider from "@/Theme/Helpers/hero-slider";
import { useAppSelector } from "@/lib/redux/hook";
import AnnouncementModal from "@/Theme/Helpers/announcement-modal";
import CategoriesSpherical from "@/Theme/Helpers/categories-spherical";

type SectionTitles = { [key: string]: string };

const HomePage = () => {
  const homepageData = useAppSelector((state) => state.homepage.data);

  const [sectionTitles] = useState<SectionTitles>(() => {
    const titles: SectionTitles = {};
    homepageData?.section_title?.forEach((item) => {
      titles[item.key] = item.custom || item.default;
    });
    return titles;
  });

  const renderContent = () => {
    const productSliders = [
      {
        data: homepageData?.popularCategoryProducts,
        title: sectionTitles?.Popular_Category,
      },
      {
        data: homepageData?.topRatedProducts,
        title: sectionTitles?.Top_Rated_Products,
      },
      {
        data: homepageData?.newArrivalProducts,
        title: sectionTitles?.New_Arrivals,
      },
      {
        data: homepageData?.featuredCategoryProducts,
        title: sectionTitles?.Featured_Products,
      },
      { data: homepageData?.bestProducts, title: sectionTitles?.Best_Products },
    ].filter((slider) => slider.data);

    return productSliders.map((slider, index) => (
      <ProductSlider
        key={`slider-${index}`}
        data={slider.data}
        title={slider.title}
      />
    ));
  };

  return (
    <main>
      {/* AnnouncementModal is a portal/dialog — no layout impact */}
      <AnnouncementModal />

      {/*
        HeroSlider is OUTSIDE the space-y-5 wrapper so it sits flush
        against the header spacer with absolutely no extra top margin.
      */}
      <HeroSlider />

      {/* All remaining sections get consistent vertical spacing */}
      <div className="space-y-5 mt-5">
        <AnnouncementMarquee />
        <CategoriesSpherical
          featuredCategories={homepageData?.featuredCategories || []}
        />
        {renderContent()}
      </div>
    </main>
  );
};

export default HomePage;

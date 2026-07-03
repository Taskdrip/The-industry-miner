import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import TrustBar from "@/components/home/TrustBar";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CourseCatalog from "@/components/home/CourseCatalog";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <TrustBar />
        <WhatWeOffer />
        <FeaturedCourses />
        <CourseCatalog />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

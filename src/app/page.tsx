import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PopularDeals } from "@/components/sections/PopularDeals";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <PopularDeals />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

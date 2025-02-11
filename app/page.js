import Hero from "@/components/home/Hero";
import ServiceCategories from "@/components/home/ServiceCategories";
import TrendingServices from "@/components/home/TrendingServices";
import TrustSection from "@/components/home/TrustSection";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<main className="bg-white text-black">
			<Navbar	/>
			<Hero />
			<ServiceCategories />
			<TrendingServices />
			<TrustSection />
			<Testimonials />
			<CallToAction />
			<Footer />
		</main>
	);
}

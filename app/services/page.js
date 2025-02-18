import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/Navbar";
import ServicesPage from "@/components/user/services";

export default async function Service() {
	return (
		<>
			<Navbar />
			<ServicesPage />
			<Footer />
		</>
	);
}

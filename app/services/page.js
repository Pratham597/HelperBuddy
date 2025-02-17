import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/Navbar";
import ServicesPage from "@/components/user/services";
import axios from "axios";

export default async function Service() {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/service`);
    const services = res.data;
	return (
		<>
			<Navbar />
			<ServicesPage initialServices={services} />
			<Footer />
		</>
	);
}

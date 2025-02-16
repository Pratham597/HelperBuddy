import Booking from "@/models/Booking";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import User from "@/models/User";
import connectDB from "@/db/connect";

const registeredEntities = async () => {
	await connectDB();
	try {
		const bookings = await Booking.countDocuments({ isPaid: true });
		const users = await User.countDocuments({});
		const partners = await Partner.countDocuments({ isApproved: true });
		const services = await Service.countDocuments({});

		return { bookings, users, partners, services };
	} catch (error) {
		console.error("Error fetching entity counts:", error);
		return { bookings: 0, users: 0, partners: 0, services: 0 }; // Return safe default values
	}
};

export default registeredEntities;

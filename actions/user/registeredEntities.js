import Booking from "@/models/Booking";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import ServiceOrder from "@/models/ServiceOrder";
import User from "@/models/User";


export default registeredEntities=async()=>{
    const bookings=await Booking.countDocuments({isPaid:true});
    const users=await User.countDocuments({})
    const partners=await Partner.countDocuments({isApproved:true})
    const services=await Service.countDocuments({});

    return {bookings,users,partners,services};
}
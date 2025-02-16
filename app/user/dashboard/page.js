import { redirect } from "next/navigation";

export default function Dashboard() {
	redirect("/user/dashboard/profile/userInformation"); // Automatically redirects
	return null;
}

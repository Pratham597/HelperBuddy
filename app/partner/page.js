import { redirect } from "next/navigation";

export default function Home() {
  redirect("/partner/dashboard/profile/partnerInformation");
  return (
    <> 
    <div>Hello World</div>
    </>
  );
}
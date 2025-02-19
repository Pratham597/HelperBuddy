import { redirect } from "next/navigation";

export default function Home() {
  redirect("admin/dashboard/profile/adminInformation")
  return (
    <> 
    <div>Hello World</div>
    </>
  );
}
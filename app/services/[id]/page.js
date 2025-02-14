import ServiceDetailsContent from "@/components/user/serviceDetailsContent";
import Navbar from "@/components/navbar/Navbar";

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params; 

  return (
    <>
      <Navbar />
      <ServiceDetailsContent slug={id} />
    </>
  );
}

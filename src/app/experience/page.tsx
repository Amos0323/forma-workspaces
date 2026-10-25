import { pageMetadata } from "@/lib/metadata";
import { Showroom } from "@/components/showroom/showroom";
export const metadata = pageMetadata("Cape Town Workplace Interior Configurator", "Explore a fictional Cape Town workplace. Compare coordinated interior themes, timber, flooring, upholstery and lighting in FORMA's interactive 3D showroom.",
  "/experience"
);
export default function Experience() { return <Showroom />; }

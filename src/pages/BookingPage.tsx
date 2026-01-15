import { AppLayout } from "@/components/Layout/AppLayout";
import { FloorPlan } from "@/components/Floor/FloorPlan";
import { BookingSidebar } from "@/components/Sidebar/BookingSidebar";

export default function BookingPage() {
  return <AppLayout left={<FloorPlan />} right={<BookingSidebar />} />;
}

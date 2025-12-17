import { AppLayout } from "@/components/Layout/AppLayout";
import { FloorPlan } from "@/components/Floor/FloorPlan";
import { MyBookingsSidebar } from "@/components/Sidebar/MyBookingsSidebar";

export function MyBookingsPage() {
    return <AppLayout left={<FloorPlan />} right={<MyBookingsSidebar />} />;
}

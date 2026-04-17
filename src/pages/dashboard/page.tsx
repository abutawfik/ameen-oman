import { useSearchParams } from "react-router-dom";
import i18n from "@/i18n";
import { type EntityType } from "@/mocks/dashboardData";
import DashboardMain from "./components/DashboardMain";

// Home view for /dashboard — renders inside DashboardLayout's <Outlet />.
// The title bar + sidebar are provided by the layout, so this page just
// supplies the primary content area.
const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const entityType = (searchParams.get("type") as EntityType) || "hotel";
  const isAr = (i18n.language || "en") === "ar";
  return <DashboardMain entityType={entityType} isAr={isAr} />;
};

export default DashboardPage;

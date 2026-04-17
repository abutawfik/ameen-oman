import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContext } from "./DashboardLayout";
import DashboardMain from "./components/DashboardMain";

// Home view for /dashboard — renders inside DashboardLayout's <Outlet />.
// The title bar + sidebar are provided by the layout, so this page just
// supplies the primary content area. Language state flows from the layout
// via outlet context so the AR toggle in the title bar actually reaches here.
const DashboardPage = () => {
  const { isAr, entityType } = useOutletContext<DashboardOutletContext>();
  return <DashboardMain entityType={entityType} isAr={isAr} />;
};

export default DashboardPage;

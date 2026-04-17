import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LoginPage from "../pages/login/page";
import RegisterPage from "../pages/register/page";
import DashboardPage from "../pages/dashboard/page";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import HotelEventsPage from "../pages/dashboard/hotel-events/page";
import CarRentalEventsPage from "../pages/dashboard/car-rental-events/page";
import MobileEventsPage from "../pages/dashboard/mobile-events/page";
import MunicipalityEventsPage from "../pages/dashboard/municipality-events/page";
import FinancialEventsPage from "../pages/dashboard/financial-events/page";
import BorderIntelligencePage from "../pages/dashboard/border-intelligence/page";
import UtilityEventsPage from "../pages/dashboard/utility-events/page";
import TransportIntelligencePage from "../pages/dashboard/transport-intelligence/page";
import HealthcareEventsPage from "../pages/dashboard/healthcare-events/page";
import TourismEventsPage from "../pages/dashboard/tourism-events/page";
import MarineEventsPage from "../pages/dashboard/marine-events/page";
import PostalEventsPage from "../pages/dashboard/postal-events/page";
import EducationEventsPage from "../pages/dashboard/education-events/page";
import EmploymentRegistryPage from "../pages/dashboard/employment-registry/page";
import EcommerceIntelligencePage from "../pages/dashboard/ecommerce-intelligence/page";
import SocialIntelligencePage from "../pages/dashboard/social-intelligence/page";
import CalendarEventsPage from "../pages/dashboard/calendar-events/page";
import BatchReportsPage from "../pages/dashboard/batch-reports/page";
import CommandCenterPage from "../pages/dashboard/command-center/page";
import RiskAssessmentPage from "../pages/dashboard/risk-assessment/page";
import OsintRiskEnginePage from "../pages/dashboard/osint-risk-engine/page";
import PatternEnginePage from "../pages/dashboard/pattern-engine/page";
import PredictiveAnalyticsPage from "../pages/dashboard/predictive-analytics/page";
import Person360Page from "../pages/dashboard/person-360/page";
import NotificationsPage from "../pages/dashboard/notifications/page";
import MobileFieldPage from "../pages/mobile-field/page";
import SystemAdminPage from "../pages/dashboard/system-admin/page";
import ApiPortalPage from "../pages/dashboard/api-portal/page";
import BrandIdentityPage from "../pages/dashboard/brand-identity/page";
import HospitalityLoginPage from "../pages/hospitality/login/page";
import HospitalitySetupPage from "../pages/hospitality/setup/page";
import HospitalityAppPage from "../pages/hospitality/app/page";
import IdentityFusionPage from "../pages/dashboard/identity-fusion/page";
import LinkAnalysisPage from "../pages/dashboard/link-analysis/page";
import WatchlistPage from "../pages/dashboard/watchlist/page";
import CustomsCargoPage from "../pages/dashboard/customs-cargo/page";
import ComplianceScorecardPage from "../pages/dashboard/compliance-scorecard/page";
import NationalSecurityPage from "../pages/dashboard/national-security/page";
import DigitalDossierPage from "../pages/dashboard/digital-dossier/page";
import GeointPage from "../pages/dashboard/geoint/page";
import ThreatIntelPage from "../pages/dashboard/threat-intel/page";
import CaseManagementPage from "../pages/dashboard/case-management/page";
import ExecutiveDashboardPage from "../pages/dashboard/executive/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "hotel-events", element: <HotelEventsPage /> },
      { path: "car-rental-events", element: <CarRentalEventsPage /> },
      { path: "mobile-events", element: <MobileEventsPage /> },
      { path: "municipality-events", element: <MunicipalityEventsPage /> },
      { path: "financial-events", element: <FinancialEventsPage /> },
      { path: "border-intelligence", element: <BorderIntelligencePage /> },
      { path: "utility-events", element: <UtilityEventsPage /> },
      { path: "transport-intelligence", element: <TransportIntelligencePage /> },
      { path: "healthcare-events", element: <HealthcareEventsPage /> },
      { path: "tourism-events", element: <TourismEventsPage /> },
      { path: "marine-events", element: <MarineEventsPage /> },
      { path: "postal-events", element: <PostalEventsPage /> },
      { path: "education-events", element: <EducationEventsPage /> },
      { path: "employment-registry", element: <EmploymentRegistryPage /> },
      { path: "ecommerce-intelligence", element: <EcommerceIntelligencePage /> },
      { path: "social-intelligence", element: <SocialIntelligencePage /> },
      { path: "calendar", element: <CalendarEventsPage /> },
      { path: "event-list", element: <CalendarEventsPage /> },
      { path: "batch-upload", element: <BatchReportsPage /> },
      { path: "reports", element: <BatchReportsPage /> },
      { path: "manage-users", element: <BatchReportsPage /> },
      { path: "help", element: <BatchReportsPage /> },
      { path: "command-center", element: <CommandCenterPage /> },
      { path: "risk-assessment", element: <RiskAssessmentPage /> },
      { path: "osint-risk-engine", element: <OsintRiskEnginePage /> },
      { path: "pattern-engine", element: <PatternEnginePage /> },
      { path: "predictive-analytics", element: <PredictiveAnalyticsPage /> },
      { path: "person-360", element: <Person360Page /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "system-admin", element: <SystemAdminPage /> },
      { path: "api-portal", element: <ApiPortalPage /> },
      { path: "brand-identity", element: <BrandIdentityPage /> },
      { path: "identity-fusion", element: <IdentityFusionPage /> },
      { path: "link-analysis", element: <LinkAnalysisPage /> },
      { path: "watchlist", element: <WatchlistPage /> },
      { path: "customs-cargo", element: <CustomsCargoPage /> },
      { path: "compliance-scorecard", element: <ComplianceScorecardPage /> },
      { path: "national-security", element: <NationalSecurityPage /> },
      { path: "digital-dossier", element: <DigitalDossierPage /> },
      { path: "geoint", element: <GeointPage /> },
      { path: "threat-intel", element: <ThreatIntelPage /> },
      { path: "case-management", element: <CaseManagementPage /> },
      { path: "executive", element: <ExecutiveDashboardPage /> },
    ],
  },
  {
    path: "/mobile-field",
    element: <MobileFieldPage />,
  },
  {
    path: "/hospitality/login",
    element: <HospitalityLoginPage />,
  },
  {
    path: "/hospitality/setup",
    element: <HospitalitySetupPage />,
  },
  {
    path: "/hospitality/app",
    element: <HospitalityAppPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

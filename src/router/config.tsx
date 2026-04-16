import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LoginPage from "../pages/login/page";
import RegisterPage from "../pages/register/page";
import DashboardPage from "../pages/dashboard/page";
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
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/hotel-events",
    element: <HotelEventsPage />,
  },
  {
    path: "/dashboard/car-rental-events",
    element: <CarRentalEventsPage />,
  },
  {
    path: "/dashboard/mobile-events",
    element: <MobileEventsPage />,
  },
  {
    path: "/dashboard/municipality-events",
    element: <MunicipalityEventsPage />,
  },
  {
    path: "/dashboard/financial-events",
    element: <FinancialEventsPage />,
  },
  {
    path: "/dashboard/border-intelligence",
    element: <BorderIntelligencePage />,
  },
  {
    path: "/dashboard/utility-events",
    element: <UtilityEventsPage />,
  },
  {
    path: "/dashboard/transport-intelligence",
    element: <TransportIntelligencePage />,
  },
  {
    path: "/dashboard/healthcare-events",
    element: <HealthcareEventsPage />,
  },
  {
    path: "/dashboard/tourism-events",
    element: <TourismEventsPage />,
  },
  {
    path: "/dashboard/marine-events",
    element: <MarineEventsPage />,
  },
  {
    path: "/dashboard/postal-events",
    element: <PostalEventsPage />,
  },
  {
    path: "/dashboard/education-events",
    element: <EducationEventsPage />,
  },
  {
    path: "/dashboard/employment-registry",
    element: <EmploymentRegistryPage />,
  },
  {
    path: "/dashboard/ecommerce-intelligence",
    element: <EcommerceIntelligencePage />,
  },
  {
    path: "/dashboard/social-intelligence",
    element: <SocialIntelligencePage />,
  },
  {
    path: "/dashboard/calendar",
    element: <CalendarEventsPage />,
  },
  {
    path: "/dashboard/event-list",
    element: <CalendarEventsPage />,
  },
  {
    path: "/dashboard/batch-upload",
    element: <BatchReportsPage />,
  },
  {
    path: "/dashboard/reports",
    element: <BatchReportsPage />,
  },
  {
    path: "/dashboard/manage-users",
    element: <BatchReportsPage />,
  },
  {
    path: "/dashboard/help",
    element: <BatchReportsPage />,
  },
  {
    path: "/dashboard/command-center",
    element: <CommandCenterPage />,
  },
  {
    path: "/dashboard/risk-assessment",
    element: <RiskAssessmentPage />,
  },
  {
    path: "/dashboard/pattern-engine",
    element: <PatternEnginePage />,
  },
  {
    path: "/dashboard/predictive-analytics",
    element: <PredictiveAnalyticsPage />,
  },
  {
    path: "/dashboard/person-360",
    element: <Person360Page />,
  },
  {
    path: "/dashboard/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/mobile-field",
    element: <MobileFieldPage />,
  },
  {
    path: "/dashboard/system-admin",
    element: <SystemAdminPage />,
  },
  {
    path: "/dashboard/api-portal",
    element: <ApiPortalPage />,
  },
  {
    path: "/dashboard/brand-identity",
    element: <BrandIdentityPage />,
  },
  {
    path: "/dashboard/identity-fusion",
    element: <IdentityFusionPage />,
  },
  {
    path: "/dashboard/link-analysis",
    element: <LinkAnalysisPage />,
  },
  {
    path: "/dashboard/watchlist",
    element: <WatchlistPage />,
  },
  {
    path: "/dashboard/customs-cargo",
    element: <CustomsCargoPage />,
  },
  {
    path: "/dashboard/compliance-scorecard",
    element: <ComplianceScorecardPage />,
  },
  {
    path: "/dashboard/national-security",
    element: <NationalSecurityPage />,
  },
  {
    path: "/dashboard/digital-dossier",
    element: <DigitalDossierPage />,
  },
  {
    path: "/dashboard/geoint",
    element: <GeointPage />,
  },
  {
    path: "/dashboard/threat-intel",
    element: <ThreatIntelPage />,
  },
  {
    path: "/dashboard/case-management",
    element: <CaseManagementPage />,
  },
  {
    path: "/dashboard/executive",
    element: <ExecutiveDashboardPage />,
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

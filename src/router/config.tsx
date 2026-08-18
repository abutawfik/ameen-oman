import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";

// ── Eager: landing, login, not-found, 404 shell, dashboard layout ───────────
// These render on the first paint or within a tick of app mount. Keeping them
// eager avoids a loading flash on the most common entry paths.
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import LoginPage from "../pages/login/page";
import RegisterPage from "../pages/register/page";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import DashboardPage from "../pages/dashboard/page";

// ── Lazy: every other dashboard sub-page + hospitality sub-app ──────────────
// Each route is its own chunk. First paint ships only the landing + chrome;
// the individual pages load on demand when the operator navigates.
const HotelEventsPage           = lazy(() => import("../pages/dashboard/hotel-events/page"));
const CarRentalEventsPage       = lazy(() => import("../pages/dashboard/car-rental-events/page"));
const MobileEventsPage          = lazy(() => import("../pages/dashboard/mobile-events/page"));
const MunicipalityEventsPage    = lazy(() => import("../pages/dashboard/municipality-events/page"));
const FinancialEventsPage       = lazy(() => import("../pages/dashboard/financial-events/page"));
const BorderIntelligencePage    = lazy(() => import("../pages/dashboard/border-intelligence/page"));
const UtilityEventsPage         = lazy(() => import("../pages/dashboard/utility-events/page"));
const TransportIntelligencePage = lazy(() => import("../pages/dashboard/transport-intelligence/page"));
const HealthcareEventsPage      = lazy(() => import("../pages/dashboard/healthcare-events/page"));
const TourismEventsPage         = lazy(() => import("../pages/dashboard/tourism-events/page"));
const MarineEventsPage          = lazy(() => import("../pages/dashboard/marine-events/page"));
const PostalEventsPage          = lazy(() => import("../pages/dashboard/postal-events/page"));
const EducationEventsPage       = lazy(() => import("../pages/dashboard/education-events/page"));
const EmploymentRegistryPage    = lazy(() => import("../pages/dashboard/employment-registry/page"));
const EcommerceIntelligencePage = lazy(() => import("../pages/dashboard/ecommerce-intelligence/page"));
const SocialIntelligencePage    = lazy(() => import("../pages/dashboard/social-intelligence/page"));
const CalendarEventsPage        = lazy(() => import("../pages/dashboard/calendar-events/page"));
const BatchReportsPage          = lazy(() => import("../pages/dashboard/batch-reports/page"));
const CommandCenterPage         = lazy(() => import("../pages/dashboard/command-center/page"));
const RiskAssessmentPage        = lazy(() => import("../pages/dashboard/risk-assessment/page"));
const OsintRiskEnginePage       = lazy(() => import("../pages/dashboard/osint-risk-engine/page"));
const PatternEnginePage         = lazy(() => import("../pages/dashboard/pattern-engine/page"));
const PredictiveAnalyticsPage   = lazy(() => import("../pages/dashboard/predictive-analytics/page"));
const Person360Page             = lazy(() => import("../pages/dashboard/person-360/page"));
const NotificationsPage         = lazy(() => import("../pages/dashboard/notifications/page"));
const MobileFieldPage           = lazy(() => import("../pages/mobile-field/page"));
const SystemAdminPage           = lazy(() => import("../pages/dashboard/system-admin/page"));
const ApiPortalPage             = lazy(() => import("../pages/dashboard/api-portal/page"));
const BrandIdentityPage         = lazy(() => import("../pages/dashboard/brand-identity/page"));
const HospitalityLoginPage      = lazy(() => import("../pages/hospitality/login/page"));
const HospitalitySetupPage      = lazy(() => import("../pages/hospitality/setup/page"));
const HospitalityAppPage        = lazy(() => import("../pages/hospitality/app/page"));
const IdentityFusionPage        = lazy(() => import("../pages/dashboard/identity-fusion/page"));
const LinkAnalysisPage          = lazy(() => import("../pages/dashboard/link-analysis/page"));
const WatchlistPage             = lazy(() => import("../pages/dashboard/watchlist/page"));
const CustomsCargoPage          = lazy(() => import("../pages/dashboard/customs-cargo/page"));
const ComplianceScorecardPage   = lazy(() => import("../pages/dashboard/compliance-scorecard/page"));
const NationalSecurityPage      = lazy(() => import("../pages/dashboard/national-security/page"));
const DigitalDossierPage        = lazy(() => import("../pages/dashboard/digital-dossier/page"));
const GeointPage                = lazy(() => import("../pages/dashboard/geoint/page"));
const ThreatIntelPage           = lazy(() => import("../pages/dashboard/threat-intel/page"));
const CaseManagementPage        = lazy(() => import("../pages/dashboard/case-management/page"));
const ExecutiveDashboardPage    = lazy(() => import("../pages/dashboard/executive/page"));
const AuditLogPage              = lazy(() => import("../pages/dashboard/audit-log/page"));
const EntityResolutionPage      = lazy(() => import("../pages/dashboard/entity-resolution/page"));
const ReportsPage               = lazy(() => import("../pages/dashboard/reports/page"));
const SubjectTimelinePage       = lazy(() => import("../pages/dashboard/subject-timeline/page"));
const SearchPage                = lazy(() => import("../pages/dashboard/search/page"));
const PersonsOfInterestPage     = lazy(() => import("../pages/dashboard/persons-of-interest/page"));
const RiskTrackerPage           = lazy(() => import("../pages/dashboard/risk-tracker/page"));
const ManageProfilesPage        = lazy(() => import("../pages/dashboard/manage-profiles/page"));
const RiskRulesPage             = lazy(() => import("../pages/dashboard/risk-rules/page"));
const MLModelsPage              = lazy(() => import("../pages/dashboard/ml-models/page"));
const ManageUsersPage           = lazy(() => import("../pages/dashboard/manage-users/page"));
const UserProfilePage           = lazy(() => import("../pages/dashboard/user-profile/page"));
const IdentityComparePage       = lazy(() => import("../pages/dashboard/identity-compare/page"));
const TargetMatchPage           = lazy(() => import("../pages/dashboard/target-match/page"));
const VizLibraryPage            = lazy(() => import("../pages/dashboard/viz-library/page"));
const ServicesDashboardPage     = lazy(() => import("../pages/dashboard/services-dashboard/page"));
const BorderDashboardPage       = lazy(() => import("../pages/dashboard/border-dashboard/page"));
const ForgotPasswordPage        = lazy(() => import("../pages/forgot-password/page"));
const ResetPasswordPage         = lazy(() => import("../pages/reset-password/page"));
const SetPasswordPage           = lazy(() => import("../pages/set-password/page"));

// ── Route-level Suspense fallback — brand-aligned, silent, fast ─────────────
// Renders for ~100-400ms while a lazy chunk loads. Subtle enough to not feel
// like a loading screen; purposeful enough that the operator knows something
// is happening.
const RouteFallback = () => (
  <div
    style={{
      minHeight: "min(60vh, 480px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--alm-ocean-800, #051428)",
      color: "#D6B47E",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: "0.75rem",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      gap: "0.75rem",
    }}
    role="status"
    aria-live="polite"
  >
    <span
      aria-hidden
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#D6B47E",
        animation: "pulse 1.4s ease-in-out infinite",
        boxShadow: "0 0 8px rgba(214,180,126,0.6)",
      }}
    />
    Loading…
  </div>
);

// Wrap a lazy route's element in Suspense so the fallback renders on demand.
// Keeps the JSX in the routes table readable.
const L = (El: React.ComponentType) => (
  <Suspense fallback={<RouteFallback />}>
    <El />
  </Suspense>
);

const routes: RouteObject[] = [
  { path: "/",         element: <Home /> },
  { path: "/login",           element: <LoginPage /> },
  { path: "/register",       element: <RegisterPage /> },
  { path: "/forgot-password", element: L(ForgotPasswordPage) },
  { path: "/reset-password",  element: L(ResetPasswordPage) },
  { path: "/set-password",    element: L(SetPasswordPage) },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "hotel-events",            element: L(HotelEventsPage) },
      { path: "car-rental-events",       element: L(CarRentalEventsPage) },
      { path: "mobile-events",           element: L(MobileEventsPage) },
      { path: "municipality-events",     element: L(MunicipalityEventsPage) },
      { path: "financial-events",        element: L(FinancialEventsPage) },
      { path: "border-intelligence",     element: L(BorderIntelligencePage) },
      { path: "utility-events",          element: L(UtilityEventsPage) },
      { path: "transport-intelligence",  element: L(TransportIntelligencePage) },
      { path: "healthcare-events",       element: L(HealthcareEventsPage) },
      { path: "tourism-events",          element: L(TourismEventsPage) },
      { path: "marine-events",           element: L(MarineEventsPage) },
      { path: "postal-events",           element: L(PostalEventsPage) },
      { path: "education-events",        element: L(EducationEventsPage) },
      { path: "employment-registry",     element: L(EmploymentRegistryPage) },
      { path: "ecommerce-intelligence",  element: L(EcommerceIntelligencePage) },
      { path: "social-intelligence",     element: L(SocialIntelligencePage) },
      { path: "calendar",                element: L(CalendarEventsPage) },
      { path: "event-list",              element: L(CalendarEventsPage) },
      { path: "batch-upload",            element: L(BatchReportsPage) },
      { path: "reports",                 element: L(ReportsPage) },
      { path: "manage-users",            element: L(ManageUsersPage) },
      { path: "help",                    element: L(BatchReportsPage) },
      { path: "command-center",          element: L(CommandCenterPage) },
      { path: "risk-assessment",         element: L(RiskAssessmentPage) },
      { path: "osint-risk-engine",       element: L(OsintRiskEnginePage) },
      { path: "audit-log",               element: L(AuditLogPage) },
      { path: "entity-resolution",       element: L(EntityResolutionPage) },
      { path: "pattern-engine",          element: L(PatternEnginePage) },
      { path: "predictive-analytics",    element: L(PredictiveAnalyticsPage) },
      { path: "person-360",              element: L(Person360Page) },
      { path: "subject-timeline",        element: L(SubjectTimelinePage) },
      { path: "search",                  element: L(SearchPage) },
      { path: "persons-of-interest",     element: L(PersonsOfInterestPage) },
      { path: "risk-tracker",            element: L(RiskTrackerPage) },
      { path: "manage-profiles",         element: L(ManageProfilesPage) },
      { path: "risk-rules",              element: L(RiskRulesPage) },
      { path: "ml-models",              element: L(MLModelsPage) },
      { path: "user-profile",            element: L(UserProfilePage) },
      { path: "identity-compare",        element: L(IdentityComparePage) },
      { path: "target-match",            element: L(TargetMatchPage) },
      { path: "viz-library",             element: L(VizLibraryPage) },
      { path: "services-dashboard",     element: L(ServicesDashboardPage) },
      { path: "border-dashboard",       element: L(BorderDashboardPage) },
      { path: "notifications",           element: L(NotificationsPage) },
      { path: "system-admin",            element: L(SystemAdminPage) },
      { path: "api-portal",              element: L(ApiPortalPage) },
      { path: "brand-identity",          element: L(BrandIdentityPage) },
      { path: "identity-fusion",         element: L(IdentityFusionPage) },
      { path: "link-analysis",           element: L(LinkAnalysisPage) },
      { path: "watchlist",               element: L(WatchlistPage) },
      { path: "customs-cargo",           element: L(CustomsCargoPage) },
      { path: "compliance-scorecard",    element: L(ComplianceScorecardPage) },
      { path: "national-security",       element: L(NationalSecurityPage) },
      { path: "digital-dossier",         element: L(DigitalDossierPage) },
      { path: "geoint",                  element: L(GeointPage) },
      { path: "threat-intel",            element: L(ThreatIntelPage) },
      { path: "case-management",         element: L(CaseManagementPage) },
      { path: "executive",               element: L(ExecutiveDashboardPage) },
    ],
  },
  {
    path: "/mobile-field",
    element: L(MobileFieldPage),
  },
  {
    path: "/hospitality/login",
    element: L(HospitalityLoginPage),
  },
  {
    path: "/hospitality/setup",
    element: L(HospitalitySetupPage),
  },
  {
    path: "/hospitality/app",
    element: L(HospitalityAppPage),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

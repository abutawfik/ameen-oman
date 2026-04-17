import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";
import PaletteSwitcher from "./brand/PaletteSwitcher";
import { ClearanceProvider } from "./brand/clearance";
import DemoNarration from "./components/demo/DemoNarration";

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <ClearanceProvider>
          <ScrollToTop />
          <AppRoutes />
          {/* Runtime ocean-palette toggle — floats over every page so brand reviews
              can compare v1.0 vs v1.1 without a rebuild. Reads/writes to
              localStorage["ameen:palette"] and flips <html data-palette="..."> */}
          <PaletteSwitcher />
          {/* Wave 3 · D4 — press N to toggle a guided narration overlay that
              walks the current page's key features. Scripts live in
              osintData.DEMO_NARRATIONS; hooks are `[data-narrate-id="…"]`. */}
          <DemoNarration />
        </ClearanceProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

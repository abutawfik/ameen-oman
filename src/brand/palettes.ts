// ============================================================================
// Al-Ameen · Runtime Palette Registry
// ----------------------------------------------------------------------------
// Declarative list of ocean-ramp variants so we can A/B compare palette
// proposals at runtime without rebuilding. The PaletteSwitcher component is
// the only consumer — it applies the active palette by setting
// `document.documentElement.dataset.palette` which flips the CSS vars
// declared in src/index.css.
//
// Only the ocean ramp differs between palettes. Brass, Persian Rose,
// Alabaster, and Risk Tiers are held constant across every variant.
// ============================================================================

export type PaletteId = "v1" | "v1.1";

export interface PaletteOceanRamp {
  900: string;
  800: string;
  700: string;
  600: string;
  500: string;
  400: string;
  300: string;
  200: string;
  100: string;
}

export interface PaletteDef {
  id: PaletteId;
  name: string;
  description: string;
  ocean: PaletteOceanRamp;
}

export const PALETTES: Record<PaletteId, PaletteDef> = {
  "v1": {
    id: "v1",
    name: "Majlis Azure \u00B7 v1.0",
    description: "Deep navy \u2014 sovereign, restrained",
    ocean: {
      900: "#020A14",
      800: "#051428",
      700: "#0A2540",
      600: "#10325A",
      500: "#1A4578",
      400: "#2C5F8F",
      300: "#4A7AA8",
      200: "#7A9CBF",
      100: "#B0C5DB",
    },
  },
  "v1.1": {
    id: "v1.1",
    name: "Majlis Azure \u00B7 v1.1",
    description: "Brighter royal blue \u2014 diplomatic, international",
    ocean: {
      900: "#06143A",
      800: "#0F2B5C",
      700: "#163B78",
      600: "#1F4B92",
      500: "#2D5AA8",
      400: "#4571B8",
      300: "#6B8FCC",
      200: "#9AB3E0",
      100: "#C4D2EC",
    },
  },
};

export const PALETTE_ORDER: PaletteId[] = ["v1", "v1.1"];
export const DEFAULT_PALETTE: PaletteId = "v1";
export const PALETTE_STORAGE_KEY = "ameen:palette";
export const PALETTE_CHANGED_EVENT = "ameen:palette-changed";

export const isPaletteId = (value: unknown): value is PaletteId =>
  value === "v1" || value === "v1.1";

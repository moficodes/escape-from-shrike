import type { Metadata } from "next";
import { 
  Plus_Jakarta_Sans, 
  Cinzel, 
  Share_Tech_Mono, 
  Orbitron, 
  Special_Elite, 
  Macondo, 
  Berkshire_Swash, 
  Uncial_Antiqua,
  Lora,
  Marcellus,
  Spectral,
  Courier_Prime,
  Rancho,
  Fredoka,
  Oxanium,
  Rajdhani,
  EB_Garamond,
  Creepster,
  Crimson_Text,
  Metamorphous,
  Syne,
  Quicksand,
  Russo_One,
  Chivo,
  Rye,
  PT_Mono
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/navbar";
import { getCampaignData } from "@/lib/data";
import { getThemeStyles } from "@/lib/themes";

const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"] });
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"] });
const shareTechMono = Share_Tech_Mono({ variable: "--font-share-tech-mono", weight: "400", subsets: ["latin"] });
const orbitron = Orbitron({ variable: "--font-orbitron", subsets: ["latin"] });
const specialElite = Special_Elite({ variable: "--font-special-elite", weight: "400", subsets: ["latin"] });
const macondo = Macondo({ variable: "--font-macondo", weight: "400", subsets: ["latin"] });
const berkshireSwash = Berkshire_Swash({ variable: "--font-berkshire-swash", weight: "400", subsets: ["latin"] });
const uncialAntiqua = Uncial_Antiqua({ variable: "--font-uncial-antiqua", weight: "400", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", weight: "400", subsets: ["latin"] });
const marcellus = Marcellus({ variable: "--font-marcellus", weight: "400", subsets: ["latin"] });
const spectral = Spectral({ variable: "--font-spectral", weight: "400", subsets: ["latin"] });
const courierPrime = Courier_Prime({ variable: "--font-courier-prime", weight: "400", subsets: ["latin"] });
const rancho = Rancho({ variable: "--font-rancho", weight: "400", subsets: ["latin"] });
const fredoka = Fredoka({ variable: "--font-fredoka", weight: "400", subsets: ["latin"] });
const oxanium = Oxanium({ variable: "--font-oxanium", weight: "400", subsets: ["latin"] });
const rajdhani = Rajdhani({ variable: "--font-rajdhani", weight: "500", subsets: ["latin"] });
const ebGaramond = EB_Garamond({ variable: "--font-eb-garamond", weight: "400", subsets: ["latin"] });
const creepster = Creepster({ variable: "--font-creepster", weight: "400", subsets: ["latin"] });
const crimsonText = Crimson_Text({ variable: "--font-crimson-text", weight: "400", subsets: ["latin"] });
const metamorphous = Metamorphous({ variable: "--font-metamorphous", weight: "400", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", weight: "400", subsets: ["latin"] });
const quicksand = Quicksand({ variable: "--font-quicksand", weight: "400", subsets: ["latin"] });
const russoOne = Russo_One({ variable: "--font-russo-one", weight: "400", subsets: ["latin"] });
const chivo = Chivo({ variable: "--font-chivo", weight: "400", subsets: ["latin"] });
const rye = Rye({ variable: "--font-rye", weight: "400", subsets: ["latin"] });
const ptMono = PT_Mono({ variable: "--font-pt-mono", weight: "400", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const data = getCampaignData();
  const header = data.home.header;
  return {
    title: header?.title || "Sablewood Chronicles",
    description: header?.description || "A Living Chronicle",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = getCampaignData();
  const navBrand = data.home.header?.navBrand || "Sablewood";
  
  // Dynamic Settings
  const settings = data.settings || { gameSystem: "daggerheart", themePreset: "fantasy-parchment" };
  const themePreset = settings.themePreset || "fantasy-parchment";
  
  // Get CSS String with inline overrides
  const themeStyles = getThemeStyles(themePreset, settings.customTheme);

  const backgrounds = settings.backgrounds;

  const fontVariables = [
    plusJakartaSans.variable,
    cinzel.variable,
    shareTechMono.variable,
    orbitron.variable,
    specialElite.variable,
    macondo.variable,
    berkshireSwash.variable,
    uncialAntiqua.variable,
    lora.variable,
    marcellus.variable,
    spectral.variable,
    courierPrime.variable,
    rancho.variable,
    fredoka.variable,
    oxanium.variable,
    rajdhani.variable,
    ebGaramond.variable,
    creepster.variable,
    crimsonText.variable,
    metamorphous.variable,
    syne.variable,
    quicksand.variable,
    russoOne.variable,
    chivo.variable,
    rye.variable,
    ptMono.variable
  ].join(" ");

  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface relative">
        {backgrounds?.global && (
          <div 
            className="fixed inset-0 -z-50 bg-cover bg-center pointer-events-none opacity-10 mix-blend-multiply dark:mix-blend-overlay"
            style={{ backgroundImage: `url(${backgrounds.global})` }}
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar brand={navBrand} />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

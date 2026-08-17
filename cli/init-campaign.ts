import readline from "readline";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log("\n==================================================");
  console.log("   Welcome to the Campaign Guide Setup Wizard!");
  console.log("==================================================\n");
  console.log("This tool will guide you through initializing a brand-new");
  console.log("campaign website using the Sablewood Chronicles engine.\n");

  const title = await question("What is the title of your campaign? (e.g., Curse of Strahd): ");
  const description = await question("Describe your campaign in a short tagline: ");
  const navBrand = await question("What name should appear in the navigation bar? (e.g., Strahd): ");

  console.log("\nChoose your Rules System:");
  console.log("1) D&D 5th Edition");
  console.log("2) Pathfinder 2nd Edition");
  console.log("3) Daggerheart");
  console.log("4) Generic RPG");
  const systemChoice = await question("Select a system (1-4): ");
  let gameSystem = "generic";
  if (systemChoice === "1") gameSystem = "dnd5e";
  else if (systemChoice === "2") gameSystem = "pathfinder2e";
  else if (systemChoice === "3") gameSystem = "daggerheart";

  console.log("\nChoose a Visual Theme Preset:");
  console.log("1) Fantasy Parchment (Warm creams, magic purples, leather textures)");
  console.log("2) Gothic Horror (Charcoals, deep crimsons, eerie vellums)");
  console.log("3) Whimsical / High Magic (Pastel lavenders, lush emeralds)");
  console.log("4) Heroic / Epic Fantasy (Radiant golds, royal blues)");
  console.log("5) Gritty / Dark Fantasy (Rusted iron-grays, muddy ambers)");
  console.log("6) Cyberpunk (Vibrant purples, neon greens, pitch-black space)");
  console.log("7) Space Sci-Fi (Deep void blues, cool cyans, steel grays)");
  const themeChoice = await question("Select a theme preset (1-7): ");
  let themePreset = "fantasy-parchment";
  if (themeChoice === "2") themePreset = "gothic-horror";
  else if (themeChoice === "3") themePreset = "whimsical";
  else if (themeChoice === "4") themePreset = "heroic";
  else if (themeChoice === "5") themePreset = "gritty";
  else if (themeChoice === "6") themePreset = "cyberpunk";
  else if (themeChoice === "7") themePreset = "space-scifi";

  const calendarChoice = await question("\nDo you want to use the standard Gregorian Calendar? (y/n): ");
  const calendar: any = { type: "gregorian" };
  if (calendarChoice.toLowerCase() === "n") {
    calendar.type = "custom";
    calendar.eras = [{ name: "Age of Myth", abbreviation: "AM", startYear: 1 }];
    calendar.months = [
      { name: "Frostfall", days: 30 },
      { name: "Dawn-light", days: 30 },
      { name: "High-sun", days: 30 },
      { name: "Reap-tide", days: 30 },
    ];
    calendar.daysOfWeek = ["Moonsday", "Solaris", "Thornsday", "Reapday", "Starday"];
    console.log("-> Configured standard custom calendar template (Frostfall, Dawn-light, etc.)");
  }

  const campaignConfig = {
    settings: {
      gameSystem,
      themePreset,
      calendar,
      backgrounds: {
        global: "",
        home: "",
        players: "",
        npcs: "",
        locations: "",
        timeline: "",
      },
    },
    home: {
      header: {
        title,
        description,
        navBrand,
      },
      nextSession: "To Be Announced",
      questList: [],
      mostWanted: [],
    },
    locations: [],
    timeline: {
      title: "Campaign Timeline",
      subtitle: "The story so far",
      description: "Chronology of historical events and milestones",
      events: [],
    },
    players: [],
    npcs: [],
  };

  const yamlStr = yaml.dump(campaignConfig, { lineWidth: -1, noRefs: true });
  
  // Ensure data folder exists
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });

  const targetPath = path.join(dataDir, "campaign.yml");
  await fs.writeFile(targetPath, yamlStr, "utf-8");

  console.log("\n==================================================");
  console.log("   Campaign initialized successfully!");
  console.log("==================================================");
  console.log(`Saved settings to: ${targetPath}`);
  console.log("\nYou are ready to build or start your campaign server!");
  console.log("Run 'bun dev' or edit players, npcs, and locations!");
  console.log("==================================================\n");

  rl.close();
}

main().catch((err) => {
  console.error("Error running setup wizard:", err);
  rl.close();
  process.exit(1);
});

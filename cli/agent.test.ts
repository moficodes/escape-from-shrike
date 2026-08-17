import { expect, test, beforeEach, afterAll } from "bun:test";
import { spawnSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import yaml from "js-yaml";

// Tests run the agent CLI as a subprocess against a temp campaign file.
// We use a temporary cwd so CAMPAIGN_FILE (which is process.cwd() + data/campaign.yml)
// points into our fixture.

const REPO_ROOT = path.resolve(__dirname, "..");

async function setupFixture(seed: object): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(REPO_ROOT, ".agent-test-"));
  await fs.mkdir(path.join(tmpDir, "data"));
  await fs.writeFile(
    path.join(tmpDir, "data", "campaign.yml"),
    yaml.dump(seed),
    "utf8",
  );
  return tmpDir;
}

async function cleanupFixture(tmpDir: string): Promise<void> {
  await fs.rm(tmpDir, { recursive: true, force: true });
}

function runAgent(cwd: string, args: string[]) {
  return spawnSync("bun", ["run", path.join(REPO_ROOT, "cli/agent.ts"), ...args], {
    cwd,
    encoding: "utf8",
  });
}

const baseCampaign = {
  home: {
    header: { title: "T", description: "D", navBrand: "N" },
  },
  locations: [],
  timeline: { title: "T", subtitle: "S", description: "D", events: [] },
  players: [],
  npcs: [
    { id: "elder", name: "Elder Maeve", role: "elder", location: "hush", description: "wise" },
  ],
};

let fixture: string;

beforeEach(async () => {
  fixture = await setupFixture(baseCampaign);
});

afterAll(async () => {
  // Best-effort cleanup of any stragglers
  const entries = await fs.readdir(REPO_ROOT);
  for (const e of entries) {
    if (e.startsWith(".agent-test-")) {
      await fs.rm(path.join(REPO_ROOT, e), { recursive: true, force: true }).catch(() => {});
    }
  }
});

test("player update accepts all scalar player fields", async () => {
  // Add a player to the fixture first
  const seed = {
    ...baseCampaign,
    players: [
      {
        id: "orna",
        name: "Orna Kaan",
        class: "Sorcerer",
        level: 1,
        ancestry: "",
        community: "",
        subclass: "",
        tier: 1,
        image: "",
        description: "",
        backstory: "",
        stats: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 },
        backgroundQuestions: [],
        connectionQuestions: [],
      },
    ],
  };
  const localFixture = await setupFixture(seed);

  const result = runAgent(localFixture, [
    "player", "update", "orna",
    "--ancestry", "Galapa",
    "--community", "Loreborn",
    "--subclass", "Primal Origin",
    "--tier", "2",
    "--image", "/images/orna.webp",
    "--description", "A wise sorcerer.",
    "--backstory", "She was raised by turtles.",
  ]);
  expect(result.status).toBe(0);

  const written = yaml.load(
    await fs.readFile(path.join(localFixture, "data/campaign.yml"), "utf8"),
  ) as typeof seed;
  const orna = written.players.find((p) => p.id === "orna") as any;
  expect(orna.ancestry).toBe("Galapa");
  expect(orna.community).toBe("Loreborn");
  expect(orna.subclass).toBe("Primal Origin");
  expect(orna.tier).toBe(2);
  expect(orna.image).toBe("/images/orna.webp");
  expect(orna.description).toBe("A wise sorcerer.");
  expect(orna.backstory).toBe("She was raised by turtles.");
  // Existing fields preserved
  expect(orna.name).toBe("Orna Kaan");
  expect(orna.class).toBe("Sorcerer");

  await cleanupFixture(localFixture);
});

test("npc update accepts --image and --attitudeTowardParty", async () => {
  const result = runAgent(fixture, [
    "npc", "update", "elder",
    "--image", "/images/elder.webp",
    "--attitudeTowardParty", "friendly",
  ]);
  expect(result.status).toBe(0);

  const written = yaml.load(
    await fs.readFile(path.join(fixture, "data/campaign.yml"), "utf8"),
  ) as typeof baseCampaign;
  const elder = written.npcs.find((n) => n.id === "elder") as any;
  expect(elder.image).toBe("/images/elder.webp");
  expect(elder.attitudeTowardParty).toBe("friendly");
  // Existing fields preserved
  expect(elder.role).toBe("elder");

  await cleanupFixture(fixture);
});

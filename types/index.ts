export interface QA {
  question: string;
  answer: string;
}

export interface MemorableInteraction {
  description: string;
  highlight?: string;
  pcInvolved?: string;
  pcsInvolved?: string[];
}

export interface Location {
  id: string;
  name: string;
  region: string;
  description: string;
  images?: string[];
  memorableInteractions?: MemorableInteraction[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  location: string;
  description: string;
  image?: string;
  attitudeTowardParty?: string;
  memorableInteractions?: MemorableInteraction[];
}

export interface PlayerStats {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export interface Player {
  id: string;
  name: string;
  image: string;
  ancestry: string;
  community: string;
  class: string;
  subclass: string;
  level: number;
  tier: number;
  description: string;
  backstory: string;
  stats: PlayerStats;
  backgroundQuestions: QA[];
  connectionQuestions: QA[];
}

export interface GameTime {
  era: string;
  year: number;
  month: string;
  day: number;
  hour?: number;
  minute?: number;
}

export type EventType = 'location_change' | 'achievement' | 'drawback' | 'npc_meet' | 'combat' | 'general';
export type SagaArc = string;

export interface PCNote {
  pcId: string;
  note: string;
}

export interface TimelineData {
  title?: string;
  subtitle?: string;
  description?: string;
  events?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  time: GameTime;
  type: EventType;
  sagaArc?: SagaArc;
  description: string;
  pcNotes?: PCNote[];
  locationId?: string;
  npcIds?: string[];
}

export interface Quest {
  title: string;
  status: 'active' | 'completed' | 'pending';
  locationId?: string;
  description?: string;
}

export interface WantedPerson {
  name: string;
  reward: string;
  image: string;
  lastSeenLocation?: string;
}

export interface HomeHeader {
  title: string;
  description: string;
  navBrand: string;
}

export interface HomeData {
  header?: HomeHeader;
  nextSession?: string;
  activeQuest?: Quest;
  questList?: Quest[];
  mostWanted?: WantedPerson[];
  lastLocationId?: string;
  nextDestinationId?: string;
}

export interface ThemeColorSet {
  surface: string;
  surfaceDim?: string;
  surfaceContainerLowest?: string;
  surfaceContainerLow?: string;
  surfaceContainer?: string;
  surfaceContainerHigh?: string;
  surfaceContainerHighest?: string;
  primary: string;
  primaryContainer?: string;
  primaryDim?: string;
  onSurface: string;
  outlineVariant?: string;
  secondary?: string;
  secondaryContainer?: string;
  onSecondaryContainer?: string;
  tertiary?: string;
  tertiaryContainer?: string;
  radiusContainer?: string;
  borderContainer?: string;
  shadowContainer?: string;
  clipPathContainer?: string;
  transitionSpeed?: string;
  hoverTransform?: string;
  hoverShadow?: string;
  hoverBorderColor?: string;
}

export interface CalendarConfig {
  type: 'gregorian' | 'custom';
  eras?: { name: string; abbreviation: string; startYear: number }[];
  months?: { name: string; days: number }[];
  daysOfWeek?: string[];
  hoursPerDay?: number;
}

export interface CampaignSettings {
  gameSystem: string;
  themePreset: string;
  backgrounds?: Record<string, string>;
  calendar?: CalendarConfig;
  customTheme?: {
    light: ThemeColorSet;
    dark: ThemeColorSet;
  };
}

export interface CampaignData {
  settings?: CampaignSettings;
  home: HomeData;
  locations: Location[];
  timeline: TimelineData;
  players: Player[];
  npcs: NPC[];
}

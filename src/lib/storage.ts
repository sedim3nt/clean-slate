"use client";

export interface CheckIn {
  date: string;
  mood: number;
  cravings: number;
  gratitude: string;
  timestamp: number;
}

export interface JournalEntry {
  date: string;
  prompt: string;
  entry: string;
  timestamp: number;
}

export type SpiritualPath =
  | "traditional"
  | "nature"
  | "mindfulness"
  | "humanist"
  | "philosophical"
  | "exploring";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Start date
export function getStartDate(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem("cs_start_date");
}

export function setStartDate(date: string): void {
  if (!isBrowser()) return;
  localStorage.setItem("cs_start_date", date);
}

export function resetStartDate(newDate: string): void {
  setStartDate(newDate);
}

export function isExploring(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem("cs_exploring") === "true";
}

export function setExploring(val: boolean): void {
  if (!isBrowser()) return;
  localStorage.setItem("cs_exploring", val.toString());
}

// Days sober
export function getDaysSober(): number {
  const start = getStartDate();
  if (!start) return 0;
  const startDate = new Date(start);
  const now = new Date();
  startDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

// Check-ins
export function getCheckIns(): CheckIn[] {
  return getItem<CheckIn[]>("cs_checkins", []);
}

export function addCheckIn(data: Omit<CheckIn, "timestamp">): void {
  const checkins = getCheckIns();
  const existing = checkins.findIndex((c) => c.date === data.date);
  const entry: CheckIn = { ...data, timestamp: Date.now() };
  if (existing >= 0) {
    checkins[existing] = entry;
  } else {
    checkins.push(entry);
  }
  setItem("cs_checkins", checkins);
}

export function getTodayCheckIn(): CheckIn | undefined {
  const today = new Date().toISOString().split("T")[0];
  return getCheckIns().find((c) => c.date === today);
}

export function getLast7DaysCheckIns(): CheckIn[] {
  const checkins = getCheckIns();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return checkins
    .filter((c) => new Date(c.date) >= sevenDaysAgo)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Journal
export function getJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>("cs_journal", []);
}

export function addJournalEntry(data: Omit<JournalEntry, "timestamp">): void {
  const entries = getJournalEntries();
  entries.push({ ...data, timestamp: Date.now() });
  setItem("cs_journal", entries);
}

// Spiritual path
export function getSelectedPath(): SpiritualPath | null {
  if (!isBrowser()) return null;
  return localStorage.getItem("cs_path") as SpiritualPath | null;
}

export function setSelectedPath(path: SpiritualPath): void {
  if (!isBrowser()) return;
  localStorage.setItem("cs_path", path);
}

// Sponsor
export function getSponsorPhone(): string {
  if (!isBrowser()) return "";
  return localStorage.getItem("cs_sponsor") || "";
}

export function setSponsorPhone(phone: string): void {
  if (!isBrowser()) return;
  localStorage.setItem("cs_sponsor", phone);
}

// Milestones calculation
export interface MilestoneInfo {
  days: number;
  name: string;
  message: string;
}

export function getCurrentMilestone(
  daysSober: number,
  milestones: MilestoneInfo[]
): MilestoneInfo | null {
  const sorted = [...milestones].sort((a, b) => b.days - a.days);
  return sorted.find((m) => daysSober >= m.days) || null;
}

export function getNextMilestone(
  daysSober: number,
  milestones: MilestoneInfo[]
): MilestoneInfo | null {
  const sorted = [...milestones].sort((a, b) => a.days - b.days);
  return sorted.find((m) => m.days > daysSober) || null;
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { getStartDate, setStartDate } from "@/lib/storage";
import meetings from "@/data/meetings.json";

const allPrograms = [
  ...meetings.twelveStep.map((m) => m.name),
  ...meetings.nonTwelveStep.map((m) => m.name),
];

const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
const spiritualPaths = [
  "Traditional Faith",
  "Nature-Based",
  "Mindfulness",
  "Humanist",
  "Philosophical",
  "Exploring",
];

const usStates = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

interface Profile {
  display_name: string;
  sobriety_date: string;
  preferred_program: string;
  favorite_meetings: string[];
  location_city: string;
  location_state: string;
  age_range: string;
  gender: string;
  spiritual_path: string;
  bio: string;
  is_visible: boolean;
}

const emptyProfile: Profile = {
  display_name: "",
  sobriety_date: "",
  preferred_program: "",
  favorite_meetings: [],
  location_city: "",
  location_state: "",
  age_range: "",
  gender: "",
  spiritual_path: "",
  bio: "",
  is_visible: false,
};

export default function ProfilePage() {
  const { user, setShowAuthModal } = useAuth();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    async function load() {
      const { data } = await supabase
        .from("cs_profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (data) {
        setProfile({
          display_name: data.display_name || "",
          sobriety_date: data.sobriety_date || getStartDate() || "",
          preferred_program: data.preferred_program || "",
          favorite_meetings: data.favorite_meetings || [],
          location_city: data.location_city || "",
          location_state: data.location_state || "",
          age_range: data.age_range || "",
          gender: data.gender || "",
          spiritual_path: data.spiritual_path || "",
          bio: data.bio || "",
          is_visible: data.is_visible || false,
        });
      } else {
        // Pre-fill sobriety date from localStorage
        const localDate = getStartDate();
        if (localDate) {
          setProfile((p) => ({ ...p, sobriety_date: localDate }));
        }
      }
      setLoadingProfile(false);
    }

    load();
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.from("cs_profiles").upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      // Sync sobriety date to localStorage
      if (profile.sobriety_date) {
        setStartDate(profile.sobriety_date);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function toggleMeeting(name: string) {
    setProfile((p) => ({
      ...p,
      favorite_meetings: p.favorite_meetings.includes(name)
        ? p.favorite_meetings.filter((m) => m !== name)
        : [...p.favorite_meetings, name],
    }));
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
        <h1 className="font-display text-3xl font-bold mb-4">Profile</h1>
        <p className="text-diluted mb-6">
          Sign in to create your profile and sync data across devices.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="bg-sumi text-warm-white px-6 py-2.5 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-diluted">Loading...</p>
      </div>
    );
  }

  const labelClass = "block text-sm text-diluted mb-1";
  const inputClass =
    "w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm";
  const selectClass =
    "w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Profile</h1>
      <p className="text-diluted text-sm mb-8">
        This information is optional and private by default.
      </p>

      <div className="space-y-5">
        {/* Display name */}
        <div>
          <label className={labelClass}>Display name</label>
          <input
            type="text"
            value={profile.display_name}
            onChange={(e) => update("display_name", e.target.value)}
            placeholder="How you'd like to be called"
            className={inputClass}
          />
        </div>

        {/* Sobriety date */}
        <div>
          <label className={labelClass}>Sobriety date</label>
          <input
            type="date"
            value={profile.sobriety_date}
            onChange={(e) => update("sobriety_date", e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-diluted mt-1">
            Syncs with your daily counter
          </p>
        </div>

        {/* Preferred program */}
        <div>
          <label className={labelClass}>Preferred program</label>
          <select
            value={profile.preferred_program}
            onChange={(e) => update("preferred_program", e.target.value)}
            className={selectClass}
          >
            <option value="">Select...</option>
            {allPrograms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Favorite meetings */}
        <div>
          <label className={labelClass}>Favorite meetings</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto border border-paper/30 rounded-md p-3">
            {allPrograms.map((name) => (
              <label
                key={name}
                className="flex items-center gap-2 text-xs text-sumi cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={profile.favorite_meetings.includes(name)}
                  onChange={() => toggleMeeting(name)}
                  className="rounded border-paper"
                />
                <span className="truncate">{name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={profile.location_city}
              onChange={(e) => update("location_city", e.target.value)}
              placeholder="City"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select
              value={profile.location_state}
              onChange={(e) => update("location_state", e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {usStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age range */}
        <div>
          <label className={labelClass}>Age range</label>
          <select
            value={profile.age_range}
            onChange={(e) => update("age_range", e.target.value)}
            className={selectClass}
          >
            <option value="">Select...</option>
            {ageRanges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className={labelClass}>Gender</label>
          <select
            value={profile.gender}
            onChange={(e) => update("gender", e.target.value)}
            className={selectClass}
          >
            <option value="">Select...</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Spiritual path */}
        <div>
          <label className={labelClass}>Spiritual path</label>
          <select
            value={profile.spiritual_path}
            onChange={(e) => update("spiritual_path", e.target.value)}
            className={selectClass}
          >
            <option value="">Select...</option>
            {spiritualPaths.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) =>
              update("bio", e.target.value.slice(0, 500))
            }
            placeholder="A little about your journey..."
            rows={3}
            className={inputClass}
          />
          <p className="text-xs text-diluted mt-1 text-right">
            {profile.bio.length}/500
          </p>
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between border border-paper/40 rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-sumi">
              Make my profile visible to community
            </p>
            <p className="text-xs text-diluted">
              Other members can see your display name, program, and bio
            </p>
          </div>
          <button
            onClick={() => update("is_visible", !profile.is_visible)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              profile.is_visible ? "bg-sumi" : "bg-paper/60"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-warm-white rounded-full transition-transform duration-200 ${
                profile.is_visible ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-sumi text-warm-white py-2.5 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Profile"}
        </button>
      </div>

      <p className="text-xs text-diluted mt-6 text-center italic">
        Your journal never leaves your device unless you sign in. Even then,
        only you can read it.
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getSponsorPhone, setSponsorPhone } from "@/lib/storage";

const resources = [
  {
    name: "SAMHSA Helpline",
    number: "1-800-662-4357",
    tel: "tel:1-800-662-4357",
    desc: "Free, confidential, 24/7 treatment referral",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    tel: "sms:741741&body=HOME",
    desc: "Free crisis counseling via text",
  },
  {
    name: "Suicide & Crisis Lifeline",
    number: "988",
    tel: "tel:988",
    desc: "24/7 suicide and crisis support",
  },
  {
    name: "AA Meeting Finder",
    number: "aa.org/find-aa",
    url: "https://www.aa.org/find-aa",
    desc: "Find a meeting near you",
  },
  {
    name: "NA Meeting Finder",
    number: "na.org/meetingsearch",
    url: "https://www.na.org/meetingsearch",
    desc: "Narcotics Anonymous meetings",
  },
  {
    name: "SMART Recovery",
    number: "smartrecovery.org/community",
    url: "https://www.smartrecovery.org/community/",
    desc: "Science-based recovery support",
  },
];

export default function EmergencyContacts() {
  const [sponsor, setSponsor] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setSponsor(getSponsorPhone());
  }, []);

  function saveSponsor() {
    setSponsorPhone(sponsor);
    setEditing(false);
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">
        Emergency Contacts
      </h2>
      <p className="text-diluted text-sm mb-6">
        You don&apos;t have to do this alone.
      </p>

      {/* Sponsor */}
      <div className="border border-paper/40 rounded-lg p-4 mb-6 bg-warm-white">
        <h3 className="font-display font-semibold text-sm mb-2">
          My Sponsor
        </h3>
        {editing ? (
          <div className="flex gap-2">
            <input
              type="tel"
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              placeholder="Phone number"
              className="flex-1 border border-paper/50 rounded-md px-3 py-2 text-sm bg-warm-white"
            />
            <button
              onClick={saveSponsor}
              className="bg-sumi text-warm-white px-4 py-2 rounded-md text-sm font-semibold"
            >
              Save
            </button>
          </div>
        ) : sponsor ? (
          <div className="flex items-center justify-between">
            <a
              href={`tel:${sponsor}`}
              className="bg-sumi text-warm-white px-4 py-2 rounded-md text-sm font-display font-semibold hover:bg-sumi/90 transition-colors"
            >
              Call Sponsor
            </a>
            <button
              onClick={() => setEditing(true)}
              className="text-diluted text-xs underline"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-diluted text-sm underline hover:text-sumi transition-colors"
          >
            + Add sponsor&apos;s number
          </button>
        )}
      </div>

      {/* Resources */}
      <div className="space-y-3">
        {resources.map((r) => (
          <div
            key={r.name}
            className="border border-paper/30 rounded-lg p-4 bg-warm-white flex items-center justify-between"
          >
            <div>
              <h3 className="font-display font-semibold text-sm">{r.name}</h3>
              <p className="text-xs text-diluted">{r.desc}</p>
            </div>
            {"tel" in r && r.tel ? (
              <a
                href={r.tel}
                className="bg-sumi text-warm-white px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 ml-3 hover:bg-sumi/90 transition-colors"
              >
                {r.number}
              </a>
            ) : r.url ? (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-diluted text-xs underline shrink-0 ml-3 hover:text-sumi transition-colors"
              >
                Visit →
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

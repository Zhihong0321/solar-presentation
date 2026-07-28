"use client";

import { useEffect, useRef, useState } from "react";
import type { PresentationData } from "@/lib/invoice";
import { getSlideSpokenText } from "@/lib/numberToWords";
import ChineseDeck from "./ChineseDeck";
import EnglishDeck from "./EnglishDeck";
import "./DeckCn.css";

const SLIDES = 8;

// Narration clips per slide index, in play order. Files live in
// web/public/narration/<clip>.wav (English) and <clip>_zh.wav (Chinese).
const CLIPS: string[][] = [
  ["s0"],
  ["s1"],
  ["s2"],
  ["s3"],
  ["s4a", "s4b"],
  ["s5a", "s5b", "s5c"],
  ["s6"],
  ["s7"],
];

type Lang = "en" | "zh";

const START_COPY = {
  en: {
    subtitle: "A two-minute narrated walkthrough. Sound on.",
    button: "▶ Start presentation",
    title: "Your Solar PV Proposal",
    forName: (name: string) => `for ${name}`,
  },
  zh: {
    subtitle: "两分钟语音导览 — 请开启声音。",
    button: "▶ 开始演示",
    title: "您的太阳能发电方案",
    forName: (name: string) => `为 ${name} 准备`,
  },
};

export default function Deck({ data }: { data: PresentationData }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("zh");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const copy = START_COPY[lang];

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(".slide"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number((entry.target as HTMLElement).dataset.idx);
          setActive(index);
          entry.target
            .querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((element) => element.classList.add("reveal"));
        });
      },
      { root, threshold: 0.55 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [lang]);

  // Play the active slide's narration once the presentation has started.
  // Language changes stop the current clip and select the matching files.
  useEffect(() => {
    if (!started) return;

    const sequence = CLIPS[active] ?? [];
    let cancelled = false;
    let audio: HTMLAudioElement | null = null;
    let index = 0;

    const playNext = async () => {
      if (cancelled || index >= sequence.length) return;

      const subIndex = index;
      const name = sequence[index++];
      const spoken = getSlideSpokenText({
        slideIndex: active,
        clipSubIndex: subIndex,
        data,
        lang,
      });

      let audioSrc = `/narration/${name}${lang === "zh" ? "_zh" : ""}.mp3`;

      // If slide numbers are customized for this invoice, generate/fetch on-the-fly TTS
      if (!spoken.isDefault) {
        try {
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: spoken.text }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              audioSrc = data.url;
            }
          }
        } catch (e) {
          console.warn("Dynamic TTS fetch failed, falling back to static audio", e);
        }
      }

      if (cancelled) return;

      audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.addEventListener("ended", playNext);
      audio.onerror = () => {
        // Fallback to .wav if .mp3 is not found
        if (!cancelled && audio) {
          const fallbackPath = `/narration/${name}${lang === "zh" ? "_zh" : ""}.wav`;
          const fallback = new Audio(fallbackPath);
          audioRef.current = fallback;
          fallback.addEventListener("ended", playNext);
          fallback.play().catch(() => {});
        }
      };
      audio.play().catch(() => {
        /* Autoplay may be blocked or interrupted. */
      });
    };

    playNext();
    return () => {
      cancelled = true;
      if (audio) audio.pause();
      audioRef.current = null;
    };
  }, [active, started, lang, data]);

  const firstName = data.customerName?.split(" ")[0] ?? null;

  return (
    <div className={`phone cn-mode ${lang === "en" ? "en-mode" : "zh-mode"}`}>
      {!started ? (
        <div className="start-overlay">
          <div className="start-brand">Eternalgy Solar</div>
          <h2 className="start-title">
            {copy.title}
            {firstName ? (
              <>
                <br />
                {copy.forName(firstName)}
              </>
            ) : null}
          </h2>
          <p className="start-sub">{copy.subtitle}</p>
          <div className="start-lang">
            <button
              className={`lang-chip ${lang === "en" ? "on" : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
            <button
              className={`lang-chip ${lang === "zh" ? "on" : ""}`}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
          <button className="start-btn" onClick={() => setStarted(true)}>
            {copy.button}
          </button>
        </div>
      ) : (
        <button
          className="lang-toggle"
          onClick={() => setLang((current) => (current === "en" ? "zh" : "en"))}
          aria-label="Switch presentation language"
        >
          {lang === "en" ? "EN · 中文" : "中文 · EN"}
        </button>
      )}

      <div className="progress-rail" aria-label="Slide progress">
        {Array.from({ length: SLIDES }).map((_, index) => (
          <div
            key={index}
            className={`dot ${index === active ? "on" : ""}`}
          />
        ))}
      </div>

      <div className="deck" ref={scroller}>
        {lang === "zh" ? (
          <ChineseDeck data={data} firstName={firstName} />
        ) : (
          <EnglishDeck data={data} />
        )}
      </div>
    </div>
  );
}

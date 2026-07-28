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
    preparing: "Preparing your narration…",
  },
  zh: {
    subtitle: "两分钟语音导览 — 请开启声音。",
    button: "▶ 开始演示",
    title: "您的太阳能发电方案",
    forName: (name: string) => `为 ${name} 准备`,
    preparing: "正在准备您的专属语音讲解…",
  },
};

const NEXT_CUE_COPY: Record<Lang, string> = {
  en: "Scroll down",
  zh: "向下滑动",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Deck({ data }: { data: PresentationData }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [preparing, setPreparing] = useState(true);
  const [lang, setLang] = useState<Lang>("zh");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Cache of pre-generated TTS audio URLs, keyed by "slideIndex-subIndex",
  // filled by the prefetch effect below so playback never has to wait on
  // the MiniMax round-trip once the user actually scrolls to a slide.
  const preloadCache = useRef<Map<string, string>>(new Map());
  // True once the active slide's full narration sequence has finished
  // playing. Read by the wheel/touch lock below — kept as a ref (not
  // state) since it's only ever read inside event handlers, not rendered.
  const narrationDoneRef = useRef(true);
  // Mirrors narrationDoneRef but as state, purely to drive the "scroll
  // down" cue below — the ref stays the source of truth the lock reads.
  const [canAdvance, setCanAdvance] = useState(false);
  const copy = START_COPY[lang];

  // 3s loading beat on the cover, purely cosmetic — gives the prefetch
  // below a head start on the first customized clip before Start is shown.
  useEffect(() => {
    setPreparing(true);
    const timer = setTimeout(() => setPreparing(false), 3000);
    return () => clearTimeout(timer);
  }, [lang]);

  // Generate every customized (non-default) narration clip for this invoice
  // as soon as we have the data — not on scroll. We already know every
  // number the moment the invoice loads, so there's no reason to make the
  // visitor wait mid-presentation for a MiniMax round-trip. Fired in slide
  // order (the order they'll actually be heard) with a 3s stagger between
  // requests so we don't slam the API with a burst of concurrent calls.
  useEffect(() => {
    let cancelled = false;
    const cache = preloadCache.current;

    const items: { key: string; text: string }[] = [];
    for (let slideIndex = 0; slideIndex < SLIDES; slideIndex++) {
      const subCount = CLIPS[slideIndex]?.length ?? 1;
      for (let subIndex = 0; subIndex < subCount; subIndex++) {
        const spoken = getSlideSpokenText({ slideIndex, clipSubIndex: subIndex, data, lang });
        if (spoken.isDefault) continue;
        items.push({ key: `${slideIndex}-${subIndex}`, text: spoken.text });
      }
    }

    (async () => {
      for (const item of items) {
        if (cancelled) return;
        fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: item.text }),
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            if (json?.url) cache.set(item.key, json.url);
          })
          .catch((err) => console.error("TTS prefetch failed:", err));
        if (items.indexOf(item) < items.length - 1) await sleep(3000);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data, lang]);

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
    narrationDoneRef.current = sequence.length === 0;
    setCanAdvance(narrationDoneRef.current);

    const playNext = async () => {
      if (cancelled) return;
      if (index >= sequence.length) {
        narrationDoneRef.current = true;
        setCanAdvance(true);
        return;
      }

      const subIndex = index;
      const name = sequence[index++];
      const spoken = getSlideSpokenText({
        slideIndex: active,
        clipSubIndex: subIndex,
        data,
        lang,
      });

      let audioSrc = `/narration/${name}${lang === "zh" ? "_zh" : ""}.mp3`;

      // If slide numbers are customized for this invoice, use the clip the
      // prefetch effect already generated. Only fall back to a live fetch
      // if the visitor scrolled here faster than the prefetch could finish.
      if (!spoken.isDefault) {
        const cacheKey = `${active}-${subIndex}`;
        const cached = preloadCache.current.get(cacheKey);
        if (cached) {
          audioSrc = cached;
        } else {
          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: spoken.text }),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error("TTS generation failed:", errData.error || res.statusText);
            return; // Strictly stop playback rather than playing wrong default audio numbers!
          }
          const ttsJson = await res.json();
          if (ttsJson.url) {
            audioSrc = ttsJson.url;
            preloadCache.current.set(cacheKey, ttsJson.url);
          } else {
            console.error("TTS API did not return a valid audio URL");
            return;
          }
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
          audio = fallback; // keep the outer ref current so cleanup/scroll-away pauses THIS element
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
      // Scrolling away (active/lang/started change) must always kill the
      // clip that's currently speaking — never let two slides talk at once.
      if (audio) audio.pause();
      audioRef.current = null;
    };
  }, [active, started, lang, data]);

  // Block scrolling FORWARD to the next slide while the current slide's
  // narration is still speaking. Backward scroll (revisiting an earlier
  // slide, which also cuts the audio via the effect above) is always
  // allowed. A blocked attempt gives an elastic "rubber band" bounce
  // instead of silently swallowing the gesture, so it reads as "not yet"
  // rather than "broken".
  useEffect(() => {
    const root = scroller.current;
    if (!root || !started) return;

    let touchStartY = 0;
    let touching = false;
    let bounceTimer: ReturnType<typeof setTimeout> | null = null;

    const bounce = () => {
      root.classList.remove("rubber-band");
      void root.offsetWidth; // restart the CSS animation
      root.classList.add("rubber-band");
      if (bounceTimer) clearTimeout(bounceTimer);
      bounceTimer = setTimeout(() => root.classList.remove("rubber-band"), 420);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && !narrationDoneRef.current) {
        e.preventDefault();
        bounce();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touching = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touching || narrationDoneRef.current) return;
      const draggedUp = touchStartY - e.touches[0].clientY; // >0 = swiping forward
      if (draggedUp > 8) {
        e.preventDefault();
        const resisted = Math.min(draggedUp / 4, 36);
        root.style.transform = `translateY(-${resisted}px)`;
      }
    };

    const onTouchEnd = () => {
      touching = false;
      if (root.style.transform) {
        root.style.transition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
        root.style.transform = "";
        setTimeout(() => {
          root.style.transition = "";
        }, 400);
      }
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      if (bounceTimer) clearTimeout(bounceTimer);
    };
  }, [started]);

  // Full customer name — do NOT split to first word only, it was cutting
  // multi-word names in half everywhere this is shown (cover title, start
  // screen greeting).
  const firstName = data.customerName ?? null;

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
          {preparing ? (
            <div className="start-preparing">
              <span className="start-spinner" aria-hidden="true" />
              <p>{copy.preparing}</p>
            </div>
          ) : (
            <>
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
            </>
          )}
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

      {started && canAdvance && active < SLIDES - 1 ? (
        <div className="next-cue" aria-hidden="true">
          <span className="next-cue-arrow" />
          <span className="next-cue-label">{NEXT_CUE_COPY[lang]}</span>
        </div>
      ) : null}

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

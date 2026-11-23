import { useEffect, useRef, useState } from "react";

const weddingDate = new Date("2026-08-01T18:15:00+05:30");

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  function calculateTimeLeft() {
    const difference = targetDate.getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function PistacioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeLeft = useCountdown(weddingDate);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      audio.volume = 0.45;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <main className="pistacio-page">
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      <button
        className="pistacio-music"
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <span className="material-symbols-outlined">
          {isPlaying ? "music_note" : "music_off"}
        </span>
      </button>

      <section className="pistacio-hero">
        <div className="pistacio-hero__photo" aria-hidden="true">
          <img src="/pic.png" alt="" />
        </div>
        <div className="pistacio-hero__content">
          <p className="pistacio-kicker">Nikah Invitation</p>
          <h1>
            Ziya
            <span>&</span>
            Nooha
          </h1>
          <p className="pistacio-hero__copy">
            A soft pistachio garden celebration filled with duas, family, and a
            dinner shared in joy.
          </p>
          <div className="pistacio-date-row">
            <span>August 1, 2026</span>
            <span>6:15 PM</span>
            <span>Mangaluru</span>
          </div>
        </div>
      </section>

      <section className="pistacio-section pistacio-blessing">
        <div>
          <p className="pistacio-label">With Blessings</p>
          <h2>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
        </div>
        <p>
          With the grace of Almighty and the love of our families, we request
          your presence and duas as we begin this beautiful new chapter.
        </p>
      </section>

      <section className="pistacio-section pistacio-countdown">
        <p className="pistacio-label">Counting Down</p>
        <div className="pistacio-countdown__grid">
          <div>
            <strong>{timeLeft.days}</strong>
            <span>Days</span>
          </div>
          <div>
            <strong>{timeLeft.hours}</strong>
            <span>Hours</span>
          </div>
          <div>
            <strong>{timeLeft.minutes}</strong>
            <span>Minutes</span>
          </div>
          <div>
            <strong>{timeLeft.seconds}</strong>
            <span>Seconds</span>
          </div>
        </div>
      </section>

      <section className="pistacio-section pistacio-theme">
        <div className="pistacio-section__heading">
          <p className="pistacio-label">Theme</p>
          <h2>Pistachio, ivory, and antique gold</h2>
        </div>
        <div className="pistacio-theme__grid">
          <article>
            <span className="pistacio-swatch pistacio-swatch--sage" />
            <h3>Pistachio Garden</h3>
            <p>Fresh green tones, leafy edges, and a calm outdoor feeling.</p>
          </article>
          <article>
            <span className="pistacio-swatch pistacio-swatch--ivory" />
            <h3>Ivory Glow</h3>
            <p>Warm surfaces, soft contrast, and space for the names to breathe.</p>
          </article>
          <article>
            <span className="pistacio-swatch pistacio-swatch--gold" />
            <h3>Gold Details</h3>
            <p>Small metallic accents for ceremony, elegance, and celebration.</p>
          </article>
        </div>
      </section>

      <section className="pistacio-section pistacio-details">
        <div className="pistacio-detail-card">
          <span className="material-symbols-outlined">diversity_1</span>
          <h2>Nikah Ceremony</h2>
          <p>Walima Dinner followed by Nikah</p>
          <strong>August 1, 2026 at 6:15 PM</strong>
        </div>
        <div className="pistacio-detail-card">
          <span className="material-symbols-outlined">location_on</span>
          <h2>TMA Pai International Convention Centre</h2>
          <p>MG Road, Kodailbail, Mangaluru</p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=12.8809,74.8399"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
          </a>
        </div>
      </section>

      <section className="pistacio-section pistacio-rsvp">
        <p className="pistacio-label">RSVP</p>
        <h2>Will you celebrate with us?</h2>
        {!rsvpStatus ? (
          <div className="pistacio-rsvp__actions">
            <button type="button" onClick={() => setRsvpStatus("attending")}>
              Joyfully Accept
            </button>
            <button type="button" onClick={() => setRsvpStatus("not-attending")}>
              Regretfully Decline
            </button>
          </div>
        ) : (
          <p className="pistacio-rsvp__note">
            {rsvpStatus === "attending"
              ? "Thank you. We cannot wait to celebrate with you."
              : "Thank you for letting us know. Your duas mean so much to us."}
          </p>
        )}
      </section>
    </main>
  );
}

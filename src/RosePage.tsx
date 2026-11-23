import { useEffect, useRef, useState } from "react";
import "./RosePage.css";

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

export default function RosePage() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | null>(null);
  const [blooms, setBlooms] = useState<Array<{ id: number; x: number; y: number; rotate: number }>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bloomIdRef = useRef(0);
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
      audio.volume = 0.46;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const openInvitation = async () => {
    setIsOpened(true);

    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.46;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const createBloom = (x: number, y: number) => {
    const id = bloomIdRef.current++;
    setBlooms((current) => [
      ...current,
      { id, x, y, rotate: Math.round(Math.random() * 120) - 60 },
    ]);
    window.setTimeout(() => {
      setBlooms((current) => current.filter((bloom) => bloom.id !== id));
    }, 1800);
  };

  useEffect(() => {
    if (!isOpened) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (Math.random() > 0.94) {
        createBloom(event.clientX, event.clientY);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      for (let i = 0; i < 4; i += 1) {
        window.setTimeout(() => {
          createBloom(
            event.clientX + (Math.random() - 0.5) * 64,
            event.clientY + (Math.random() - 0.5) * 64,
          );
        }, i * 55);
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpened]);

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {blooms.map((bloom) => (
        <span
          key={bloom.id}
          className="rose-bloom"
          style={{ left: bloom.x, top: bloom.y, rotate: `${bloom.rotate}deg` }}
          aria-hidden="true"
        />
      ))}

      {!isOpened && (
        <button className="rose-intro" onClick={openInvitation} type="button">
          <span className="rose-intro__veil rose-intro__veil--left" />
          <span className="rose-intro__veil rose-intro__veil--right" />
          <span className="rose-intro__content">
            <span className="rose-intro__kicker">Click to open</span>
            <span className="rose-intro__monogram">
              <span>Z</span>
              <span>&</span>
              <span>N</span>
            </span>
            <span className="rose-intro__seal" aria-hidden="true">
              <span />
            </span>
            <span className="rose-intro__line">A rose garden invitation</span>
          </span>
        </button>
      )}

      {isOpened && (
        <>
          <div className="rose-intro rose-intro--opening" aria-hidden="true">
            <span className="rose-intro__veil rose-intro__veil--left" />
            <span className="rose-intro__veil rose-intro__veil--right" />
          </div>

          <main className="rose-page">
            <button
              className="rose-music"
              onClick={toggleMusic}
              type="button"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <span className="material-symbols-outlined">
                {isPlaying ? "music_note" : "music_off"}
              </span>
            </button>

            <div className="rose-petal-field" aria-hidden="true">
              {Array.from({ length: 36 }).map((_, index) => (
                <span
                  key={index}
                  className="rose-petal"
                  style={{
                    left: `${(index * 7) % 100}%`,
                    animationDelay: `-${index * 0.9}s`,
                    animationDuration: `${14 + (index % 7) * 2.4}s`,
                  }}
                />
              ))}
            </div>

            <section className="rose-hero">
              <div className="rose-hero__photo" aria-hidden="true">
                <img src="/couple.jpg" alt="" />
              </div>
              <div className="rose-hero__content">
                <p className="rose-eyebrow">Wedding Day</p>
                <h1>
                  <span>Mohammed Ziya</span>
                  <span>&</span>
                  <span>Aysha Nooha</span>
                </h1>
                <p className="rose-hero__copy">
                  A tender rose-lit evening of duas, family, dinner, and the beginning
                  of forever.
                </p>
                <div className="rose-date-strip" aria-label="Wedding date and location">
                  <span>Saturday</span>
                  <strong>01 August 2026</strong>
                  <span>6:15 PM</span>
                  <span>Mangaluru</span>
                </div>
              </div>
            </section>

            <section className="rose-letter rose-section">
              <div className="rose-letter__script" aria-hidden="true">Dear</div>
              <div className="rose-section__copy">
                <p className="rose-eyebrow">Dear Friends and Family</p>
                <h2>We would be honored to have you with us.</h2>
                <p>
                  With the blessings of Almighty and the love of our families, we
                  invite you to celebrate our Nikah and share in the joy of this
                  blessed occasion. Your presence and duas will mean the world to us.
                </p>
              </div>
            </section>

            <section className="rose-countdown rose-section">
              <p className="rose-eyebrow">The Celebration Begins In</p>
              <div className="rose-countdown__grid">
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

            <section className="rose-schedule rose-section">
              <div className="rose-section__heading">
                <p className="rose-eyebrow">Schedule of Events</p>
                <h2>A graceful evening, softly unfolding.</h2>
              </div>
              <div className="rose-timeline">
                <article>
                  <time>6:15 PM</time>
                  <h3>Guest Arrival</h3>
                  <p>Welcome, greetings, and a quiet moment with family.</p>
                </article>
                <article>
                  <time>7:00 PM</time>
                  <h3>Nikah Ceremony</h3>
                  <p>The blessed ceremony begins with prayers and duas.</p>
                </article>
                <article>
                  <time>8:00 PM</time>
                  <h3>Walima Dinner</h3>
                  <p>Dinner, conversation, and celebration shared together.</p>
                </article>
                <article>
                  <time>9:00 PM</time>
                  <h3>Portraits & Blessings</h3>
                  <p>Photos, warm wishes, and memories for the new chapter.</p>
                </article>
              </div>
            </section>

            <section className="rose-location rose-section">
              <div className="rose-location__panel">
                <p className="rose-eyebrow">Location</p>
                <h2>TMA Pai International Convention Centre</h2>
                <p>MG Road, Kodailbail, Mangaluru</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=12.8809,74.8399"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined">directions</span>
                  Get Directions
                </a>
              </div>
            </section>

            <section className="rose-dress rose-section">
              <div className="rose-section__heading">
                <p className="rose-eyebrow">Dress Code</p>
                <h2>Elegant attire in rose, ivory, and evening neutrals.</h2>
              </div>
              <div className="rose-palette">
                <span className="rose-swatch rose-swatch--rose">Rose</span>
                <span className="rose-swatch rose-swatch--ivory">Ivory</span>
                <span className="rose-swatch rose-swatch--mauve">Mauve</span>
                <span className="rose-swatch rose-swatch--ink">Ink</span>
              </div>
              <p>
                Polished formalwear is encouraged. Gentle rose tones, classic suits,
                and refined fabrics will sit beautifully with the evening mood.
              </p>
            </section>

            <section className="rose-rsvp rose-section">
              <p className="rose-eyebrow">RSVP</p>
              <h2>Will you celebrate with us?</h2>
              {!rsvpStatus ? (
                <div className="rose-rsvp__actions">
                  <button type="button" onClick={() => setRsvpStatus("attending")}>
                    Joyfully Accept
                  </button>
                  <button type="button" onClick={() => setRsvpStatus("not-attending")}>
                    Regretfully Decline
                  </button>
                </div>
              ) : (
                <p className="rose-rsvp__note">
                  {rsvpStatus === "attending"
                    ? "Thank you. We cannot wait to welcome you with love."
                    : "Thank you for letting us know. Your duas mean so much to us."}
                </p>
              )}
            </section>

            <footer className="rose-footer">
              <p>Ziya & Nooha</p>
              <span>01 - 08 - 2026</span>
            </footer>
          </main>
        </>
      )}
    </>
  );
}

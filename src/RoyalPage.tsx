import { useEffect, useRef, useState } from "react";
import "./RoyalPage.css";

const weddingDate = new Date("2026-08-01T18:15:00+05:30");

const photos = ["/couple.jpg", "/couple.png", "/pic.png"];

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
    const timer = window.setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function OrnamentCorner({ className = "" }: { className?: string }) {
  return (
    <svg className={`royal-ornament ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M5 5 L5 30 Q5 50 25 60 L50 70" />
      <path d="M8 5 L8 25 Q8 40 20 48" />
      <circle cx="5" cy="5" r="2" />
    </svg>
  );
}

export default function RoyalPage() {
  const [gatePressed, setGatePressed] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slide, setSlide] = useState(0);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [scratchMarks, setScratchMarks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [guestNote, setGuestNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const markIdRef = useRef(0);
  const timeLeft = useCountdown(weddingDate);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % photos.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isOpen]);

  const playMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.45;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const openDoors = () => {
    if (doorOpening) return;
    setGatePressed(true);
    void playMusic();
    window.setTimeout(() => setDoorOpening(true), 180);
    window.setTimeout(() => setIsOpen(true), 3780);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    await playMusic();
  };

  const scratch = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const id = markIdRef.current;
    markIdRef.current += 1;
    setScratchMarks((marks) => [...marks.slice(-26), { id, x, y }]);
    setScratchProgress((progress) => Math.min(progress + 9, 100));
  };

  const submitNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!guestNote.trim()) return;
    setNoteSent(true);
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {!isOpen && (
        <div
          className={`royal-gate ${gatePressed ? "royal-gate--pressed" : ""} ${doorOpening ? "royal-gate--opening" : ""}`}
        >
          <span className="royal-gate__glow" />
          <span className="royal-gate__panel royal-gate__panel--left">
            <OrnamentCorner className="royal-ornament--door-left-top" />
            <OrnamentCorner className="royal-ornament--door-left-bottom" />
            <span className="royal-gate__line royal-gate__line--right" />
          </span>
          <span className="royal-gate__panel royal-gate__panel--right">
            <OrnamentCorner className="royal-ornament--door-right-top" />
            <OrnamentCorner className="royal-ornament--door-right-bottom" />
            <span className="royal-gate__line royal-gate__line--left" />
          </span>
          <button
            className="royal-seal"
            type="button"
            onClick={openDoors}
            onPointerDown={() => setGatePressed(true)}
            onPointerLeave={() => {
              if (!doorOpening) setGatePressed(false);
            }}
            aria-label="Open invitation"
          >
            <span className="royal-seal__button">
              <span className="royal-seal__shine" />
              <span className="royal-seal__letter">Z</span>
              <span className="royal-seal__text">tap to open</span>
            </span>
          </button>
          {doorOpening && (
            <span className="royal-gate__burst" aria-hidden="true">
              {Array.from({ length: 24 }).map((_, index) => (
                <i
                  key={index}
                  style={
                    {
                      "--i": index,
                      "--tx": `${Math.cos(index * 0.72) * (180 + (index % 4) * 42)}px`,
                      "--ty": `${Math.sin(index * 0.72) * (180 + (index % 4) * 42)}px`,
                      "--spark-size": `${2 + (index % 4)}px`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          )}
        </div>
      )}

      {isOpen && (
        <main className="royal-noir">
          <button
            className="royal-audio"
            onClick={toggleMusic}
            type="button"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            <span className="material-symbols-outlined">
              {isPlaying ? "music_note" : "music_off"}
            </span>
          </button>

          <div className="royal-stars" aria-hidden="true">
            {Array.from({ length: 26 }).map((_, index) => (
              <span
                key={index}
                style={
                  {
                    "--i": index,
                    "--x": `${(index * 37) % 100}%`,
                    "--y": `${(index * 53) % 100}%`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <section className="royal-invite" aria-label="Wedding invitation">
            <div className="royal-invite__wash" />
            <OrnamentCorner className="royal-ornament--top-left" />
            <OrnamentCorner className="royal-ornament--top-right" />
            <OrnamentCorner className="royal-ornament--bottom-left" />
            <OrnamentCorner className="royal-ornament--bottom-right" />

            <div className="royal-invite__rule royal-invite__rule--top">
              <span />
            </div>

            <div className="royal-invite__content">
              <p className="royal-kicker">The wedding celebration of</p>
              <h1>
                <span>Mohammed Ziya</span>
                <em />
                <span>Aysha Nooha</span>
              </h1>
              <p className="royal-request">Request the honour of your presence</p>
            </div>

            <div className="royal-invite__rule royal-invite__rule--bottom">
              <span />
            </div>

            <div className="royal-scroll">
              <span>Scroll</span>
              <b>⌄</b>
            </div>
          </section>

          <section className="royal-welcome">
            <div className="royal-divider">
              <span />
              <i>✦</i>
              <span />
            </div>
            <p>
              With the blessings of Almighty and the love of our families, we invite
              you to witness a sacred beginning wrapped in emerald, gold, and joy.
            </p>
            <div className="royal-divider">
              <span />
              <i>✦</i>
              <span />
            </div>
          </section>

          <section className="royal-feature royal-feature--scratch">
            <div className="royal-feature__heading">
              <p className="royal-kicker">Scratch to Reveal</p>
              <h2>Our forever begins</h2>
            </div>

            <div
              className={`royal-scratch-card ${scratchProgress >= 76 ? "is-revealed" : ""}`}
              onPointerDown={scratch}
              onPointerMove={(event) => {
                if (event.buttons === 1) scratch(event);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setScratchProgress(100);
              }}
              role="button"
              tabIndex={0}
              aria-label="Scratch to reveal wedding date"
            >
              <div className="royal-scratch-card__date">
                <span>You're invited</span>
                <strong>01</strong>
                <span>August 2026</span>
                <small>6:15 PM</small>
              </div>
              <div
                className="royal-scratch-card__foil"
                style={{ opacity: Math.max(0, 1 - scratchProgress / 84) }}
              >
                {scratchMarks.map((mark) => (
                  <i key={mark.id} style={{ left: `${mark.x}%`, top: `${mark.y}%` }} />
                ))}
                <span>Scratch to Reveal</span>
              </div>
            </div>
          </section>

          <section className="royal-feature royal-feature--countdown">
            <p className="royal-kicker">Counting Down to Forever</p>
            <div className="royal-clock">
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

          <section className="royal-details">
            <article className="royal-detail-card">
              <span className="material-symbols-outlined">event</span>
              <p className="royal-kicker">Wedding Details</p>
              <h2>Nikah Ceremony</h2>
              <p>Saturday, August 1, 2026</p>
              <p>Walima dinner followed by Nikah</p>
            </article>

            <article className="royal-detail-card">
              <span className="material-symbols-outlined">location_on</span>
              <p className="royal-kicker">Venue</p>
              <h2>TMA Pai International Convention Centre</h2>
              <p>MG Road, Kodailbail, Mangaluru</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=12.8809,74.8399"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Google Maps
              </a>
            </article>
          </section>

          <section className="royal-gallery">
            <div className="royal-gallery__frame">
              {photos.map((photo, index) => (
                <img
                  key={photo}
                  src={photo}
                  alt={index === slide ? "Wedding gallery" : ""}
                  className={index === slide ? "is-visible" : ""}
                />
              ))}
            </div>
            <div className="royal-gallery__copy">
              <p className="royal-kicker">Photo Slideshow</p>
              <h2>Moments framed in emerald light.</h2>
              <p>
                A cinematic gallery space for the couple's story, designed to sit
                quietly behind the invitation instead of taking over the ceremony.
              </p>
            </div>
          </section>

          <section className="royal-guestbook">
            <div className="royal-guestbook__attendance">
              <p className="royal-kicker">Guest Attendance</p>
              <h2>Will you be there?</h2>
              {!attendance ? (
                <div className="royal-guestbook__actions">
                  <button type="button" onClick={() => setAttendance("yes")}>
                    Joyfully Accept
                  </button>
                  <button type="button" onClick={() => setAttendance("no")}>
                    Regretfully Decline
                  </button>
                </div>
              ) : (
                <p className="royal-guestbook__note">
                  {attendance === "yes"
                    ? "Your response has been added to the guest list."
                    : "Thank you for letting us know. Your blessings mean so much."}
                </p>
              )}
            </div>

            <form className="royal-guestbook__message" onSubmit={submitNote}>
              <p className="royal-kicker">Private Inbox</p>
              <h2>Send a blessing.</h2>
              {noteSent ? (
                <p className="royal-guestbook__note">Your message is sealed in the inbox.</p>
              ) : (
                <>
                  <textarea
                    value={guestNote}
                    onChange={(event) => setGuestNote(event.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                  />
                  <button type="submit">Send Message</button>
                </>
              )}
            </form>
          </section>

          <footer className="royal-noir__footer">
            <span>Emerald Noir</span>
            <strong>Ziya & Nooha</strong>
            <span>01 • 08 • 2026</span>
          </footer>
        </main>
      )}
    </>
  );
}

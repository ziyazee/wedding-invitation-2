import { useState, useEffect, useRef } from "react";
import "./MaroonPage.css";

const weddingDate = new Date("2026-08-01T18:15:00");

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

export default function MaroonPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeLeft = useCountdown(weddingDate);
  const sparkleIdRef = useRef(0);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const openInvitation = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Audio play failed:", err);
        });
    }
    setIsOpened(true);
  };

  const handleRsvp = (status: "attending" | "not-attending") => {
    setRsvpStatus(status);
    setTimeout(() => setShowRsvp(false), 2000);
  };

  const createSparkle = (x: number, y: number) => {
    const id = sparkleIdRef.current++;
    const size = Math.random() * 20 + 10;
    setSparkles((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  };

  useEffect(() => {
    if (!isOpened) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.92) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createSparkle(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60);
        }, i * 50);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick as any);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleClick as any);
    };
  }, [isOpened]);

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        <source src="/song.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="maroon-sparkle"
          style={{ left: sparkle.x, top: sparkle.y, width: sparkle.size, height: sparkle.size }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="#d4af37"/>
          </svg>
        </div>
      ))}

      {!isOpened && (
        <div className="maroon-intro" onClick={openInvitation}>
          <div className="maroon-intro__ornate-border">
            <div className="maroon-intro__corner maroon-intro__corner--tl"></div>
            <div className="maroon-intro__corner maroon-intro__corner--tr"></div>
            <div className="maroon-intro__corner maroon-intro__corner--bl"></div>
            <div className="maroon-intro__corner maroon-intro__corner--br"></div>
          </div>
          <div className="maroon-intro__content">
            <div className="maroon-intro__monogram">
              <span className="maroon-intro__letter">Z</span>
              <span className="maroon-intro__ampersand">&</span>
              <span className="maroon-intro__letter">N</span>
            </div>
            <div className="maroon-intro__divider">
              <span>✦</span>
              <span className="maroon-intro__line"></span>
              <span>✦</span>
            </div>
            <p className="maroon-intro__text">Touch to unveil your invitation</p>
            <div className="maroon-intro__pulse-ring"></div>
          </div>
        </div>
      )}

      {isOpened && (
        <>
          <div className="maroon-intro maroon-intro--opening">
            <div className="maroon-intro__content maroon-intro__content--fade"></div>
          </div>

          <div className="maroon-page">
            <button className="maroon-music-toggle" onClick={toggleMusic} type="button">
              <span className="material-symbols-outlined">
                {isPlaying ? "music_note" : "music_off"}
              </span>
            </button>

            {/* Floating rose petals */}
            <div className="maroon-petals-container">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="maroon-petal"
                  style={{
                    left: `${3 + (i * 6.5)}%`,
                    animationDelay: `-${i * 2}s`,
                    animationDuration: `${20 + (i % 4) * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Decorative mandala patterns */}
            <div className="maroon-mandala maroon-mandala--left"></div>
            <div className="maroon-mandala maroon-mandala--right"></div>

            <section className="maroon-hero">
              <div className="maroon-hero__frame">
                <div className="maroon-hero__content slide-in-up">
                  <div className="maroon-hero__badge">
                    <span>Wedding Invitation</span>
                  </div>
                  <div className="maroon-hero__ornament">❦</div>
                  <h1 className="maroon-hero__names">
                    <span className="maroon-hero__name maroon-hero__name--groom">Mohammed Ziya</span>
                    <span className="maroon-hero__heart">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                      </svg>
                    </span>
                    <span className="maroon-hero__name maroon-hero__name--bride">Aysha Nooha</span>
                  </h1>
                  <p className="maroon-hero__tagline">Request the pleasure of your company</p>
                  <div className="maroon-hero__date-box">
                    <div className="maroon-hero__date-item">
                      <span className="maroon-hero__date-label">Saturday</span>
                      <span className="maroon-hero__date-value">01</span>
                      <span className="maroon-hero__date-label">August 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="bismillah-section" className="maroon-section maroon-bismillah">
              <div className="maroon-card scale-in">
                <div className="maroon-card__border"></div>
                <h2 className="maroon-arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
                <p className="maroon-translation">
                  In the name of Allah, the Most Gracious, the Most Merciful
                </p>
                <div className="maroon-ornate-divider">
                  <span>◆</span>
                  <span className="maroon-ornate-line"></span>
                  <span>❧</span>
                  <span className="maroon-ornate-line"></span>
                  <span>◆</span>
                </div>
                <p className="maroon-message">
                  With the blessings of Almighty and our beloved families, we joyfully
                  invite you to celebrate our Nikah and share in the happiness of this
                  blessed occasion. Your presence and duas will be a cherished part of
                  our special day.
                </p>
              </div>
            </section>

            <section className="maroon-section maroon-countdown">
              <div className="maroon-countdown__bg-pattern"></div>
              <h2 className="maroon-section-title slide-in-up">Counting Down To Forever</h2>
              <div className="maroon-countdown-grid slide-in-up">
                <div className="maroon-countdown-item">
                  <div className="maroon-countdown-item__inner">
                    <span className="maroon-countdown-value">{timeLeft.days}</span>
                    <span className="maroon-countdown-label">Days</span>
                  </div>
                </div>
                <div className="maroon-countdown-item">
                  <div className="maroon-countdown-item__inner">
                    <span className="maroon-countdown-value">{timeLeft.hours}</span>
                    <span className="maroon-countdown-label">Hours</span>
                  </div>
                </div>
                <div className="maroon-countdown-item">
                  <div className="maroon-countdown-item__inner">
                    <span className="maroon-countdown-value">{timeLeft.minutes}</span>
                    <span className="maroon-countdown-label">Minutes</span>
                  </div>
                </div>
                <div className="maroon-countdown-item">
                  <div className="maroon-countdown-item__inner">
                    <span className="maroon-countdown-value">{timeLeft.seconds}</span>
                    <span className="maroon-countdown-label">Seconds</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="maroon-section maroon-couple">
              <h2 className="maroon-section-title slide-in-up">The Happy Couple</h2>
              <div className="maroon-couple-layout slide-in-up">
                <div className="maroon-couple-card maroon-couple-card--groom">
                  <div className="maroon-couple-card__ribbon">The Groom</div>
                  <h3>Mohammed Ziya</h3>
                  <p>S/o Mr. Ibrahim & Mrs. Zubaida</p>
                </div>
                <div className="maroon-couple-image">
                  <div className="maroon-couple-image__frame">
                    <img src="/pic.png" alt="Wedding Couple" />
                  </div>
                  <div className="maroon-couple-image__glow"></div>
                </div>
                <div className="maroon-couple-card maroon-couple-card--bride">
                  <div className="maroon-couple-card__ribbon">The Bride</div>
                  <h3>Aysha Nooha</h3>
                  <p>D/o Mr. Abdul Kamal & Mrs. Nasreen</p>
                </div>
              </div>
            </section>

            <section className="maroon-section maroon-events">
              <h2 className="maroon-section-title slide-in-up">Wedding Events</h2>
              <div className="maroon-events-grid slide-in-up">
                <div className="maroon-event-card">
                  <div className="maroon-event-card__shine"></div>
                  <div className="maroon-event-icon">
                    <span className="material-symbols-outlined">diversity_1</span>
                  </div>
                  <h3>Nikah Ceremony</h3>
                  <div className="maroon-event-details">
                    <p className="maroon-event-date">
                      <span className="material-symbols-outlined">calendar_month</span>
                      August 1, 2026
                    </p>
                    <p className="maroon-event-time">
                      <span className="material-symbols-outlined">schedule</span>
                      6:15 PM
                    </p>
                    <p className="maroon-event-note">Walima Dinner followed by Nikah</p>
                    <p className="maroon-event-venue">
                      <span className="material-symbols-outlined">location_on</span>
                      TMA Pai International Convention Centre
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="maroon-section maroon-venue">
              <h2 className="maroon-section-title slide-in-up">Venue</h2>
              <div className="maroon-venue-card slide-in-up">
                <div className="maroon-venue-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5!2d74.8399!3d12.8809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUyJzUxLjIiTiA3NMKwNTAnMjMuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Wedding Venue Location"
                  />
                </div>
                <div className="maroon-venue-details">
                  <h3>TMA Pai International Convention Centre</h3>
                  <p>MG Road, Kodailbail, Mangaluru</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=12.8809,74.8399"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maroon-venue-btn"
                  >
                    <span className="material-symbols-outlined">directions</span>
                    Get Directions
                  </a>
                </div>
              </div>
            </section>

            <section className="maroon-section maroon-rsvp">
              <h2 className="maroon-section-title slide-in-up">Will You Join Us?</h2>
              <p className="maroon-rsvp-message slide-in-up">
                Your presence would make our special day even more memorable
              </p>
              {!showRsvp && !rsvpStatus && (
                <button
                  className="maroon-rsvp-button slide-in-up"
                  onClick={() => setShowRsvp(true)}
                  type="button"
                >
                  <span className="maroon-rsvp-button__bg"></span>
                  <span className="material-symbols-outlined">mail</span>
                  RSVP Now
                </button>
              )}
              {showRsvp && !rsvpStatus && (
                <div className="maroon-rsvp-options slide-in-up">
                  <button
                    className="maroon-rsvp-option maroon-rsvp-option--yes"
                    onClick={() => handleRsvp("attending")}
                    type="button"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Joyfully Accept
                  </button>
                  <button
                    className="maroon-rsvp-option maroon-rsvp-option--no"
                    onClick={() => handleRsvp("not-attending")}
                    type="button"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Regretfully Decline
                  </button>
                </div>
              )}
              {rsvpStatus && (
                <div className="maroon-rsvp-confirmation slide-in-up">
                  <span className="material-symbols-outlined">
                    {rsvpStatus === "attending" ? "favorite" : "sentiment_sad"}
                  </span>
                  <p>
                    {rsvpStatus === "attending"
                      ? "Thank you! We can't wait to celebrate with you!"
                      : "We'll miss you! Thank you for letting us know."}
                  </p>
                </div>
              )}
            </section>

            <footer className="maroon-footer">
              <div className="maroon-footer__pattern"></div>
              <div className="maroon-footer__content">
                <p className="maroon-footer__names">Ziya & Nooha</p>
                <p className="maroon-footer__date">01 • 08 • 2026</p>
                <p className="maroon-footer__hashtag">#ZiyaWedsNooha</p>
              </div>
              <div className="maroon-footer__credits">
                <a 
                  href="https://www.instagram.com/digitalweddinginvitation2026" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="maroon-footer__link"
                >
                  <span className="material-symbols-outlined">link</span>
                  Connect us for digital invitation
                </a>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  );
}

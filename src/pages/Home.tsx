import { useEffect, useState } from 'react';
import { EVENT, DISTANCES, WHY_SIAVONGA, PACKAGE_ITEMS, SPONSORS } from '../data/event';
import { useCountdown } from '../hooks/useCountdown';
import { useAppDispatch } from '../store/hooks';
import { openRegistrationModal } from '../store/registrationSlice';
import { fetchRaceCategories } from '../api/registrationApi';
import type { BackendCategory } from '../api/registrationApi';
import Reveal from '../components/Reveal';
import TrackRegistration from '../components/TrackRegistration';
import tshirtMockup from '../assets/tshirt-mockup.jpg';
import tshirtSide from '../assets/tshirt-side.jpg';
import siavongaScenery from '../assets/siavonga-scenery.jpg';

const logos = import.meta.glob('../assets/logos/*.{png,jpg}', { eager: true, import: 'default' }) as Record<string, string>;

function logoSrc(file: string): string {
  const match = Object.entries(logos).find(([path]) => path.endsWith(file));
  return match ? match[1] : '';
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { days, hours, minutes, seconds } = useCountdown(EVENT.isoDate);

  const [categories, setCategories] = useState<BackendCategory[] | null>(null);

  useEffect(() => {
    fetchRaceCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function feeFor(code: string): number | null {
    const category = categories?.find((c) => c.code === code);
    if (!category) return null;
    const price = Number(category.price);
    return price > 0 ? price : null;
  }

  return (
    <main>
      <section className="sponsor-strip-top">
        <div className="section-inner sponsor-strip-top-inner">
          <span className="footer-label">Official partners</span>
          <div className="trust-strip">
            {SPONSORS.map((s, i) => (
              <Reveal
                as="img"
                key={s.name}
                delay={i * 80}
                className={s.logoClass ?? ''}
                src={logoSrc(s.file)}
                alt={s.name}
                title={s.name}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />

        <div className="hero-side hero-side-left" aria-hidden="true">
          <img src={tshirtSide} alt="" loading="lazy" />
        </div>
        <div className="hero-side hero-side-right" aria-hidden="true">
          <img src={tshirtSide} alt="" loading="lazy" />
        </div>

        <div className="hero-inner">
          <div className="eyebrow eyebrow-lg">{EVENT.date} · {EVENT.venue}</div>
          <h1>{EVENT.tagline}</h1>
          <p className="lede hero-lede">
            Celebrate Zambia's Independence Day in the beautiful lakeside town of Siavonga — choose your
            challenge, bring your friends and family, and run, walk and celebrate in one unforgettable
            Independence experience.
          </p>

          <div className="hero-facts">
            <span>{EVENT.date}</span>
            <span className="dot">·</span>
            <span>{EVENT.venue}</span>
          </div>

          <div className="hero-distances">
            {DISTANCES.map((d) => {
              const fee = feeFor(d.categoryCode);
              return (
                <span key={d.code} className="hero-distance-pill">
                  <span className="hero-distance-pill-main">
                    <strong>{d.code}</strong> {d.label}
                  </span>
                  <span className="hero-distance-pill-fee">{fee ? `K${fee}` : ''}</span>
                </span>
              );
            })}
          </div>

          <div className="hero-cta">
            <button type="button" className="btn-primary" onClick={() => dispatch(openRegistrationModal())}>
              Register now
            </button>
            <a href="#races" className="btn-ghost">See race categories</a>
          </div>

          <div className="countdown">
            <span className="countdown-label">Flag-off in</span>
            <div className="countdown-cells">
              <div className="cell"><div className="num">{days}</div><div className="lbl">Days</div></div>
              <div className="cell"><div className="num">{hours}</div><div className="lbl">Hrs</div></div>
              <div className="cell"><div className="num">{minutes}</div><div className="lbl">Min</div></div>
              <div className="cell"><div className="num">{seconds}</div><div className="lbl">Sec</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="section-inner narrow">
          <Reveal as="div">
            <div className="eyebrow">More than just a run</div>
            <h2>Run for Zambia. Experience Siavonga.</h2>
            <p className="lede">
              The Siavonga Independence Run brings together sport, fitness, national pride and the
              Siavonga experience. Run on Zambia's Independence Day while enjoying the unique atmosphere
              of Siavonga and Lake Kariba — known as the "Riviera of Zambia," a popular destination for
              recreation and tourism.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="destination-banner">
        <img src={siavongaScenery} alt="Lake Kariba shoreline at Siavonga, Zambia" loading="lazy" />
        <div className="destination-banner-caption">
          <span>Lake Kariba, Siavonga</span>
          <span className="destination-banner-credit">Photo: Mulengac / Wikimedia Commons, CC BY-SA 4.0</span>
        </div>
      </section>

      <section className="section compact" id="races">
        <div className="section-inner">
          <Reveal as="div" className="section-head-row">
            <div>
              <div className="eyebrow">Race categories</div>
              <h2>Choose your race</h2>
            </div>
            <a href="/races" className="section-head-link">All categories →</a>
          </Reveal>
          <div className="race-cards">
            {DISTANCES.map((d, i) => (
              <Reveal as="div" key={d.code} delay={i * 70} className="race-card">
                <div className="race-card-dist">{d.code}</div>
                <div className="race-card-label">{d.label}</div>
                <div className="race-card-meta">
                  <span className="race-card-fee">{feeFor(d.categoryCode) ? `K${feeFor(d.categoryCode)}` : ''}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section compact alt">
        <div className="section-inner">
          <Reveal as="div">
            <div className="eyebrow">Why Siavonga?</div>
            <h2>Run with a reason</h2>
          </Reveal>
          <div className="why-grid">
            {WHY_SIAVONGA.map((w, i) => (
              <Reveal as="div" key={w.title} delay={i * 70} className="why-card">
                <div className="why-card-icon" aria-hidden="true">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="section-inner">
          <Reveal as="div" className="merch-showcase">
            <img src={tshirtMockup} alt="Siavonga Independence Run 2026 official event t-shirt and finisher medal" loading="lazy" />
            <div>
              <div className="eyebrow">Race pack</div>
              <h2>Look the part on race day</h2>
              <p className="lede">
                Every entry includes the official event t-shirt and a finisher medal in the Siavonga
                Independence Run colours — plus your race bib, timing, hydration and finisher certificate.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section compact alt">
        <div className="section-inner">
          <div className="reg-panel">
            <Reveal as="div" className="reg-panel-info">
              <div className="eyebrow">Registration</div>
              <h2>One entry. Everything included.</h2>
              <p className="lede">Secure your place and pay by mobile money — your bib number and confirmation arrive by email.</p>
              <button type="button" className="btn-primary" onClick={() => dispatch(openRegistrationModal())}>
                Register now
              </button>
            </Reveal>
            <Reveal as="div" delay={100} className="reg-panel-package">
              <span className="footer-label">Your race pack includes</span>
              <ul className="package-grid compact">
                {PACKAGE_ITEMS.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section compact" id="track">
        <div className="section-inner narrow">
          <Reveal as="div">
            <div className="eyebrow">Already registered?</div>
            <h2>Track your registration</h2>
          </Reveal>
          <TrackRegistration />
        </div>
      </section>
    </main>
  );
}

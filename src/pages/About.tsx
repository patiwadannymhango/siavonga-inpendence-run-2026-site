import { EVENT } from '../data/event';
import { useAppDispatch } from '../store/hooks';
import { openRegistrationModal } from '../store/registrationSlice';
import Reveal from '../components/Reveal';

export default function About() {
  const dispatch = useAppDispatch();

  return (
    <main>
      <section className="page-hero">
        <div className="eyebrow">About the event</div>
        <h1>{EVENT.title}</h1>
        <p className="lede">
          A road running festival on the shores of Lake Kariba — starting and finishing at{' '}
          {EVENT.venue} on {EVENT.date}, Zambia's Independence Day.
        </p>
      </section>

      <section className="section">
        <div className="section-inner narrow">
          <Reveal as="div">
            <p className="lede">
              The Siavonga Independence Run brings together sport, fitness, national pride and the
              Siavonga experience — known as the "Riviera of Zambia," Siavonga offers a distinctive
              lakeside setting and is a popular destination for recreation and tourism. Run on
              Independence Day, then stay for the weekend and explore the destination.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="section-inner narrow">
          <Reveal as="div" className="quick-facts">
            <div><strong>Route</strong>Lakeshore start and finish on the shores of Lake Kariba</div>
            <div><strong>Support</strong>Hydration points along both distances</div>
            <div><strong>Timing</strong>Electronic chip timing for the 10KM Competitive Run</div>
            <div><strong>Community</strong>The 5KM Fun Run &amp; Walk is open to everyone — friends, family and colleagues</div>
          </Reveal>
        </div>
      </section>

      <section className="cta-band">
        <h2>Ready to join?</h2>
        <p>Pick your distance and lock in your entry.</p>
        <button type="button" className="btn-cta-light" onClick={() => dispatch(openRegistrationModal())}>
          Register now
        </button>
      </section>
    </main>
  );
}

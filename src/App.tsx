import { useEffect, useMemo, useState } from 'react'
import logo from './assets/logo.png'
import storefront from './assets/storefront.png'
import manicuresImg from './assets/manicures.jpg'
import gelImg from './assets/gel-manicures.jpg'
import pedicuresImg from './assets/pedicures.jpg'
import spaPedicuresImg from './assets/spa-pedicures.jpg'
import dipImg from './assets/dip-powder.jpg'
import enhancementsImg from './assets/nail-enhancements.jpg'
import waxingImg from './assets/waxing.jpg'
import lashesImg from './assets/lashes.jpg'
import massageImg from './assets/massage.jpg'
import permanentMakeupImg from './assets/permanent-makeup.jpg'
import nailArtImg from './assets/nail-art.jpg'
import comboImg from './assets/mani-pedi-combo.jpg'

/* ------------------------------------------------------------------ */
/* Verified business facts (Google panel, checked 2026-10-30)          */
/* ------------------------------------------------------------------ */

const BUSINESS = {
  name: 'Silk Nail',
  tagline: 'Nail Salon in Coppell, Texas',
  address: '1411 E Sandy Lake Rd Ste 110, Coppell, TX 75019',
  phoneDisplay: '(972) 745-1929',
  phoneHref: 'tel:+19727451929',
  rating: 4.5,
  reviewCount: 38,
  priceNote: 'Moderate · $$ · Credit cards accepted',
  facebook: 'https://www.facebook.com/1644272822481576',
  yelp: 'https://www.yelp.com/biz/silk-nail-coppell',
  directions:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Silk Nail, 1411 E Sandy Lake Rd Ste 110, Coppell, TX 75019'),
} as const

/** Hours in America/Chicago. dayIndex follows JS Date: 0 = Sunday. null = closed. */
interface DayHours {
  label: string
  open: number | null // minutes from midnight
  close: number | null
  display: string
}

const HOURS: DayHours[] = [
  { label: 'Sunday', open: null, close: null, display: 'Closed' },
  { label: 'Monday', open: 10 * 60, close: 19 * 60, display: '10:00 AM – 7:00 PM' },
  { label: 'Tuesday', open: 10 * 60, close: 19 * 60, display: '10:00 AM – 7:00 PM' },
  { label: 'Wednesday', open: 10 * 60, close: 19 * 60, display: '10:00 AM – 7:00 PM' },
  { label: 'Thursday', open: 10 * 60, close: 19 * 60, display: '10:00 AM – 7:00 PM' },
  { label: 'Friday', open: 10 * 60, close: 19 * 60, display: '10:00 AM – 7:00 PM' },
  { label: 'Saturday', open: 9 * 60, close: 17 * 60, display: '9:00 AM – 5:00 PM' },
]

/** Display order for the hours table: Monday first, Sunday last. */
const TABLE_ORDER = [1, 2, 3, 4, 5, 6, 0]

function formatMinutes(mins: number): string {
  const h24 = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return m === 0 ? `${h12}:00 ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** Current weekday (0 = Sunday) and minutes-from-midnight in America/Chicago. */
function chicagoNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  return {
    day: dayMap[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

interface OpenStatus {
  open: boolean
  text: string
  todayIndex: number
}

function getOpenStatus(): OpenStatus {
  const { day, minutes } = chicagoNow()
  const today = HOURS[day]
  if (today.open !== null && today.close !== null) {
    if (minutes >= today.open && minutes < today.close) {
      return { open: true, text: `Open now · Closes ${formatMinutes(today.close)} today`, todayIndex: day }
    }
    if (minutes < today.open) {
      return { open: false, text: `Closed · Opens ${formatMinutes(today.open)} today`, todayIndex: day }
    }
  }
  // Find the next day the salon opens.
  for (let offset = 1; offset <= 7; offset++) {
    const next = HOURS[(day + offset) % 7]
    if (next.open !== null) {
      const when = offset === 1 ? 'tomorrow' : next.label
      return {
        open: false,
        text: `Closed · Opens ${formatMinutes(next.open)} ${when}`,
        todayIndex: day,
      }
    }
  }
  return { open: false, text: 'Closed', todayIndex: day }
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

type GroupId = 'nails' | 'pedicures' | 'beauty'

interface Service {
  title: string
  description: string
  image: string
  imageAlt: string
  groups: GroupId[]
  keywords: string
}

const SERVICES: Service[] = [
  {
    title: 'Manicures',
    description: 'Classic manicure care with shaping, cuticle care and polish.',
    image: manicuresImg,
    imageAlt: 'A nail technician polishing a client’s nails',
    groups: ['nails'],
    keywords: 'manicure regular classic polish shaping cuticle hands',
  },
  {
    title: 'Gel Manicures',
    description: 'Gel polish manicures with a glossy, long-lasting finish — including wedding manicures.',
    image: gelImg,
    imageAlt: 'Glossy red gel manicure nails',
    groups: ['nails'],
    keywords: 'gel manicure glossy wedding polish red long lasting',
  },
  {
    title: 'Pedicures',
    description: 'Regular pedicures for clean, well-kept feet and toes.',
    image: pedicuresImg,
    imageAlt: 'A pedicure treatment in the salon',
    groups: ['pedicures'],
    keywords: 'pedicure feet toes regular polish',
  },
  {
    title: 'Spa Pedicures',
    description: 'Relaxing spa pedicure treatments — named on the salon’s own storefront window.',
    image: spaPedicuresImg,
    imageAlt: 'Feet soaking in a spa pedicure bowl with flowers and towels',
    groups: ['pedicures'],
    keywords: 'spa pedicure soak towels relaxing feet',
  },
  {
    title: 'Dip Powder Nails',
    description: 'Dipping powder nails — a service reviewers rave about at this salon.',
    image: dipImg,
    imageAlt: 'Finished pink dip powder nails with a glitter accent',
    groups: ['nails'],
    keywords: 'dip powder dipping nails pink glitter sns',
  },
  {
    title: 'Nail Enhancements',
    description: 'Nail enhancements for added length, strength and shape.',
    image: enhancementsImg,
    imageAlt: 'Long nail enhancements in a soft pink shade',
    groups: ['nails'],
    keywords: 'nail enhancements extensions length stiletto long strength',
  },
  {
    title: 'Waxing',
    description: 'Waxing services, including brow waxing and shaping.',
    image: waxingImg,
    imageAlt: 'Eyebrow waxing with a wax strip in a salon',
    groups: ['beauty'],
    keywords: 'waxing wax eyebrow brow hair removal shaping',
  },
  {
    title: 'Lashes',
    description: 'Eyelash services — reviews praise Leah’s lashes and her accommodating scheduling.',
    image: lashesImg,
    imageAlt: 'Eyelash extensions being applied',
    groups: ['beauty'],
    keywords: 'lashes eyelash extensions leah fill volume',
  },
  {
    title: 'Massage',
    description: 'Massage treatments — listed on the storefront window and in salon listings.',
    image: massageImg,
    imageAlt: 'A massage treatment with rolled towels',
    groups: ['beauty'],
    keywords: 'massage spa relaxing towel treatment',
  },
  {
    title: 'Permanent Make-Up',
    description: 'Permanent make-up — named on the salon’s storefront window signage.',
    image: permanentMakeupImg,
    imageAlt: 'Permanent eyebrow make-up result',
    groups: ['beauty'],
    keywords: 'permanent make-up makeup cosmetic brows eyebrows tattoo',
  },
  {
    title: 'Nail Art & Design',
    description: 'Custom nail art, shapes and designs — including the coffin shape with lace design shown in a review photo.',
    image: nailArtImg,
    imageAlt: 'Coffin-shaped nails with a black lace design resting on lace',
    groups: ['nails'],
    keywords: 'nail art design coffin shape lace custom manicure design',
  },
  {
    title: 'Mani-Pedi Combo',
    description: 'A manicure and pedicure together in one visit — the storefront window promotes a mani-pedi happy-hours special.',
    image: comboImg,
    imageAlt: 'A client receiving a manicure in the salon',
    groups: ['pedicures', 'nails'],
    keywords: 'combo manicure pedicure together happy hours mani pedi one visit',
  },
]

const FILTERS: { id: GroupId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'nails', label: 'Nails' },
  { id: 'pedicures', label: 'Pedicures' },
  { id: 'beauty', label: 'Beauty & Spa' },
]

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  const pct = (rating / 5) * 100
  return (
    <span className="stars" role="img" aria-label={`Rated ${rating} out of 5 stars`}>
      <span className="stars-bg" aria-hidden="true">★★★★★</span>
      <span className="stars-fg" style={{ width: `${pct}%` }} aria-hidden="true">★★★★★</span>
    </span>
  )
}

function Logo({ className }: { className?: string }) {
  return <img className={className} src={logo} alt="Silk Nail logo" />
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<GroupId | 'all'>('all')
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus())

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SERVICES.filter((s) => {
      const inGroup = filter === 'all' || s.groups.includes(filter)
      if (!inGroup) return false
      if (!q) return true
      return `${s.title} ${s.description} ${s.keywords}`.toLowerCase().includes(q)
    })
  }, [query, filter])

  return (
    <div className="site">
      {/* Header */}
      <header className="header">
        <a className="header-brand" href="#top" aria-label="Silk Nail — back to top">
          <Logo className="header-logo" />
        </a>
        <nav className="header-nav" aria-label="Main">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="btn btn-blue header-call" href={BUSINESS.phoneHref}>
          Call {BUSINESS.phoneDisplay}
        </a>
      </header>

      {/* Hero */}
      <section className="hero" id="top">
        <Logo className="hero-logo" />
        <h1 className="hero-title">Silk Nail</h1>
        <p className="hero-tagline">{BUSINESS.tagline}</p>
        <p className="hero-rating">
          <Stars rating={BUSINESS.rating} />{' '}
          <strong>{BUSINESS.rating.toFixed(1)}</strong> · {BUSINESS.reviewCount} Google reviews
        </p>
        <p className={`status-pill ${status.open ? 'is-open' : 'is-closed'}`}>
          <span className="status-dot" aria-hidden="true" />
          {status.text}
        </p>
        <p className="hero-address">{BUSINESS.address}</p>
        <div className="hero-actions">
          <a className="btn btn-blue" href={BUSINESS.phoneHref}>
            Call to Book
          </a>
          <a className="btn btn-outline" href={BUSINESS.directions} target="_blank" rel="noreferrer">
            Directions
          </a>
        </div>
        <img
          className="hero-photo"
          src={storefront}
          alt="Silk Nail storefront at 1411 E Sandy Lake Rd, Coppell"
        />
      </section>

      {/* Services */}
      <main>
        <section className="section" id="services">
          <h2 className="section-title">Services</h2>
          <p className="section-sub">
            Call <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a> to book — appointments are
            taken by phone.
          </p>

          <div className="controls">
            <input
              className="search"
              type="search"
              placeholder="Search services — try “gel”, “lash”, “coffin”…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />
            <div className="filters" role="group" aria-label="Filter services">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-btn ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="counter" aria-live="polite">
            Showing {visible.length} of {SERVICES.length} services
          </p>

          <div className="grid">
            {visible.map((s) => (
              <article className="card" key={s.title}>
                <img className="card-img" src={s.image} alt={s.imageAlt} loading="lazy" />
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="no-results">
              No services match “{query}”. Try “manicure”, “pedicure” or “waxing”.
            </p>
          )}
        </section>

        {/* About / Visit */}
        <section className="section visit" id="visit">
          <h2 className="section-title">Visit Us</h2>
          <div className="visit-layout">
            <img
              className="visit-photo"
              src={storefront}
              alt="Silk Nail storefront, showing the Silk NAIL sign and door number 1411"
            />
            <div className="visit-info" id="about">
              <h3>Silk Nail</h3>
              <p>{BUSINESS.address}</p>
              <p>
                <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
              </p>
              <p>{BUSINESS.priceNote}</p>
              <p className={`status-pill ${status.open ? 'is-open' : 'is-closed'}`}>
                <span className="status-dot" aria-hidden="true" />
                {status.text}
              </p>
              <table className="hours">
                <tbody>
                  {TABLE_ORDER.map((dayIdx) => {
                    const d = HOURS[dayIdx]
                    const isToday = dayIdx === status.todayIndex
                    return (
                      <tr key={d.label} className={isToday ? 'today' : ''}>
                        <th scope="row">
                          {d.label}
                          {isToday ? ' · Today' : ''}
                        </th>
                        <td>{d.display}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="hero-actions">
                <a className="btn btn-blue" href={BUSINESS.phoneHref}>
                  Call {BUSINESS.phoneDisplay}
                </a>
                <a className="btn btn-outline-dark" href={BUSINESS.directions} target="_blank" rel="noreferrer">
                  Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Follow */}
        <section className="follow">
          <Logo className="follow-logo" />
          <h2 className="section-title light">Follow Silk Nail</h2>
          <div className="hero-actions">
            <a className="btn btn-outline" href={BUSINESS.facebook} target="_blank" rel="noreferrer">
              Silk Nail on Facebook
            </a>
            <a className="btn btn-outline" href={BUSINESS.yelp} target="_blank" rel="noreferrer">
              Silk Nail on Yelp
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <Logo className="footer-logo" />
        <p className="footer-name">Silk Nail</p>
        <p>{BUSINESS.address}</p>
        <p>
          <a href={BUSINESS.phoneHref}>{BUSINESS.phoneDisplay}</a>
        </p>
        <p>Mon–Fri 10 AM–7 PM · Sat 9 AM–5 PM · Sun Closed</p>
        <nav className="footer-nav" aria-label="Explore">
          <a href="#services">Services</a>
          <a href="#visit">Visit</a>
          <a href={BUSINESS.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={BUSINESS.yelp} target="_blank" rel="noreferrer">
            Yelp
          </a>
        </nav>
      </footer>
    </div>
  )
}

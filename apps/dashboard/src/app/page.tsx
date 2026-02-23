import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Phone,
  Brain,
  CalendarCheck,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
} from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="bg-white">

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Blue-Collar Agent</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/plumbing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Plumbing</Link>
            <Link href="/hvac" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">HVAC</Link>
            <Link href="/electrical" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Electrical</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-24 text-white md:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Now answering calls for 500+ trade businesses
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Never miss an emergency<br className="hidden md:block" />
            <span className="text-blue-200"> call again</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 md:text-xl leading-relaxed">
            Blue-Collar Agent is an AI receptionist built for plumbers, HVAC techs, and electricians.
            It answers every call 24/7, triages emergencies, books jobs, and sends SMS confirmations —
            without you lifting a finger.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              See How It Works
            </Link>
          </div>

          <p className="mt-6 text-sm text-blue-200">
            14-day free trial · No credit card required · Setup in 15 minutes
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────────── */}
      <section className="border-b border-t border-gray-100 bg-gray-50 py-10 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { stat: '37%', label: 'of trade calls go unanswered', sub: 'industry average' },
              { stat: '< 2s', label: 'average answer time', sub: 'vs 4 rings on hold' },
              { stat: '$800+', label: 'average emergency job value', sub: 'one saved call = two months free' },
              { stat: '24/7', label: 'coverage, zero overtime', sub: 'nights, weekends & holidays' },
            ].map((s) => (
              <div key={s.stat} className="text-center">
                <p className="text-3xl font-extrabold text-blue-600">{s.stat}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">How It Works</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              From missed call to booked job in 60 seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Phone,
                step: '01',
                title: 'Call comes in',
                desc: 'Your AI agent answers instantly, 24/7 — no hold music, no voicemail.',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Brain,
                step: '02',
                title: 'AI triages the issue',
                desc: 'Identifies emergencies, quotes price ranges, and qualifies the job.',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: CalendarCheck,
                step: '03',
                title: 'Books the appointment',
                desc: 'Checks your live calendar and locks in a time slot on the spot.',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: MessageSquare,
                step: '04',
                title: 'You get a summary',
                desc: 'SMS + dashboard notification with the full call summary and lead score.',
                color: 'bg-orange-100 text-orange-600',
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-3 -left-1 text-5xl font-black text-gray-100 select-none leading-none">
                  {item.step}
                </div>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Features</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Everything a receptionist does, but better
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Emergency Triage',
                desc: 'Recognizes burst pipes, no heat, sparks, and gas leaks. Pages you immediately for life-safety calls.',
              },
              {
                icon: CalendarCheck,
                title: 'Live Calendar Booking',
                desc: 'Checks your Google Calendar in real time and books slots without double-booking.',
              },
              {
                icon: MessageSquare,
                title: 'SMS Confirmations',
                desc: 'Sends automatic booking confirmations and 24-hour reminders to cut no-shows.',
              },
              {
                icon: Clock,
                title: '24/7 Availability',
                desc: 'Answers at 2 AM on a Sunday. No overtime, no sick days, no missed calls.',
              },
              {
                icon: Users,
                title: 'Bilingual (EN + ES)',
                desc: 'Speaks English and Spanish fluently. Critical in TX, FL, CA, and AZ markets.',
              },
              {
                icon: TrendingUp,
                title: 'Lead Scoring',
                desc: 'Every caller gets a Hot / Warm / Cold lead score so you can follow up smart.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ──────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Industries</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Built for the trades
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                emoji: '🔧',
                trade: 'Plumbing',
                href: '/plumbing',
                color: 'from-blue-500 to-blue-700',
                emergencies: ['Burst pipe', 'Sewer backup', 'No hot water', 'Flooding'],
                stat: '$950 avg job',
              },
              {
                emoji: '❄️',
                trade: 'HVAC',
                href: '/hvac',
                color: 'from-sky-500 to-sky-700',
                emergencies: ['No heat', 'No AC', 'Refrigerant leak', 'Carbon monoxide'],
                stat: '$1,200 avg emergency',
              },
              {
                emoji: '⚡',
                trade: 'Electrical',
                href: '/electrical',
                color: 'from-yellow-500 to-orange-600',
                emergencies: ['Sparks / arcing', 'Power outage', 'Burning smell', 'Panel failure'],
                stat: '85% booking rate',
              },
            ].map((t) => (
              <Link key={t.trade} href={t.href} className="group block">
                <div className={`rounded-2xl bg-gradient-to-br ${t.color} p-6 text-white shadow-md hover:shadow-xl transition-shadow`}>
                  <div className="mb-3 text-4xl">{t.emoji}</div>
                  <h3 className="mb-1 text-xl font-bold">{t.trade}</h3>
                  <p className="text-sm font-semibold text-white/70 mb-4">{t.stat}</p>
                  <ul className="space-y-1.5 mb-5">
                    {t.emergencies.map((e) => (
                      <li key={e} className="flex items-center gap-2 text-sm text-white/90">
                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Testimonials</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Contractors who stopped missing calls
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                quote: "I used to miss 3–4 calls a night. Now I wake up to a full schedule. Made back my subscription fee in the first week.",
                name: 'Carlos R.',
                business: 'Rivera Plumbing — Houston, TX',
                rating: 5,
              },
              {
                quote: "Last July we had our busiest week ever. Instead of hiring a temp dispatcher, Blue-Collar Agent handled 200+ calls without breaking a sweat.",
                name: 'James L.',
                business: 'Lone Star HVAC — Dallas, TX',
                rating: 5,
              },
              {
                quote: "The emergency triage is what sold me. When a customer mentions sparks, I get a text immediately. That intelligence alone is worth it.",
                name: 'David K.',
                business: 'Kilowatt Electric — Austin, TX',
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-bold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">Pricing</p>
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4">
            One flat rate. No per-minute charges.
          </h2>
          <p className="text-gray-600 mb-12 text-lg">Plans start at $299/month. One saved emergency call pays for the whole year.</p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-10">
            {[
              { name: 'Starter', price: '$299', calls: '200 calls/mo', popular: false },
              { name: 'Growth', price: '$499', calls: '500 calls/mo', popular: true },
              { name: 'Scale',  price: '$799', calls: 'Unlimited',     popular: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 relative ${
                  p.popular
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <p className="font-bold text-gray-900 mb-1">{p.name}</p>
                <p className="text-3xl font-extrabold text-gray-900 mb-1">{p.price}<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500">{p.calls}</p>
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            See full pricing and feature comparison <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 px-6 text-white text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold mb-4 md:text-5xl">
            Your next emergency call is 10 minutes away
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Set up your AI agent in 15 minutes. It answers before the second ring.
            Free for 14 days — no credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-bold text-blue-700 shadow-xl hover:bg-blue-50 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-5 text-blue-300 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-white underline underline-offset-2 hover:text-blue-100">
              Sign in →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t bg-white py-12 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Blue-Collar Agent</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                AI-powered voice receptionist for plumbers, HVAC techs, and electricians.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Product</p>
                <ul className="space-y-2">
                  {[
                    { href: '/how-it-works', label: 'How It Works' },
                    { href: '/pricing', label: 'Pricing' },
                    { href: '/blog', label: 'Blog' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Industries</p>
                <ul className="space-y-2">
                  {[
                    { href: '/plumbing', label: 'Plumbing' },
                    { href: '/hvac', label: 'HVAC' },
                    { href: '/electrical', label: 'Electrical' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Account</p>
                <ul className="space-y-2">
                  {[
                    { href: '/sign-in', label: 'Sign In' },
                    { href: '/sign-up', label: 'Start Free Trial' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Blue-Collar Agent. All rights reserved.</p>
            <p className="text-xs text-gray-400">Built for the trades. Powered by AI.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

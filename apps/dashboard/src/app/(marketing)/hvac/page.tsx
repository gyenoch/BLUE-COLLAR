import Link from 'next/link'
import { Phone, Thermometer, Wind, Clock, Star, CheckCircle } from 'lucide-react'

const painPoints = [
  {
    icon: Thermometer,
    title: 'Peak season call floods',
    description:
      'Summer AC breakdowns and winter no-heat emergencies hit all at once. Your phones ring off the hook and you can\'t handle every call.',
  },
  {
    icon: Phone,
    title: 'After-hours emergencies',
    description:
      'A family with no heat at midnight will call whoever answers. If that\'s not you, it\'s your competitor collecting a $1,200 emergency job.',
  },
  {
    icon: Wind,
    title: 'Scheduling chaos between calls and jobs',
    description:
      'You\'re on a roof swapping out a condenser unit. Your phone rings. You miss it. That was $800 in tune-up revenue gone.',
  },
]

const features = [
  'Answers every call during peak season — no call left behind',
  'Recognizes HVAC emergencies: no heat, no AC, refrigerant leak, carbon monoxide',
  'Pages owner immediately for carbon monoxide and no-heat-in-winter emergencies',
  'Books seasonal tune-ups months in advance against your real calendar',
  'Quotes pricing ranges for tune-ups, refrigerant recharge, system replacement',
  'Bilingual English + Spanish — critical in TX, FL, CA, AZ markets',
  'Automated 24-hour appointment reminders to cut no-shows',
  'Full Jobber CRM sync for jobs, customers, and invoices',
  'Seasonal campaign automation — proactively calls your list before summer',
]

const testimonials = [
  {
    name: 'James L.',
    business: 'Lone Star HVAC — Dallas, TX',
    quote:
      'Last July we had our busiest week ever. Instead of hiring a temp dispatcher, we turned on Blue-Collar Agent. It handled 200+ calls that week without breaking a sweat. No missed jobs.',
    rating: 5,
  },
  {
    name: 'Sandra M.',
    business: 'Cool Breeze Air — Orlando, FL',
    quote:
      'The bilingual feature alone is worth it for us. I have a lot of Spanish-speaking customers who would hang up with our old system. Now they stay and book.',
    rating: 5,
  },
]

export default function HvacPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-blue-800 py-24 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-4">For HVAC Companies</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Handle seasonal call surges without hiring extra staff
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mb-10">
            Blue-Collar Agent answers every call during your busiest seasons, triages no-heat and no-AC emergencies, books tune-ups months out, and runs your scheduling on autopilot.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="bg-white text-sky-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="border border-sky-300 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sky-700 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sky-300 text-sm mt-6">14-day free trial · No credit card · Setup in 15 min</p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">The HVAC call problem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            When it&apos;s 95°F outside and every unit in the city is struggling, you physically can&apos;t answer every call. But every missed call is a job for your competitor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wide mb-2">Built for HVAC</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                An AI that knows HVAC season from off-season
              </h2>
              <p className="text-gray-600 mb-8">
                Blue-Collar Agent isn&apos;t generic. It understands the HVAC business cycle — proactively routing tune-up calls into your calendar during shoulder season so you&apos;re not scrambling when summer hits.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Try It Free
              </Link>
            </div>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Seasonal stat */}
      <section className="bg-sky-600 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '3×', label: 'more calls during peak season', sub: 'Most HVAC businesses can\'t staff for that spike' },
            { stat: '$1,200', label: 'average emergency AC/heat job', sub: 'One saved emergency call = four months subscription' },
            { stat: '92%', label: 'customer satisfaction rate', sub: 'When calls are answered immediately' },
          ].map((s) => (
            <div key={s.stat}>
              <p className="text-5xl font-extrabold mb-2">{s.stat}</p>
              <p className="font-semibold mb-1">{s.label}</p>
              <p className="text-sky-200 text-sm">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">HVAC owners trust it</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Be ready before the next heatwave hits
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Set up in 15 minutes. Your AI agent will be answering calls before your tech finishes the current job.
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-sky-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-sky-700 transition-colors"
        >
          Start Free Trial
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          See{' '}
          <Link href="/pricing" className="text-sky-600 hover:underline">
            pricing →
          </Link>
        </p>
      </section>
    </div>
  )
}

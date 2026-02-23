import Link from 'next/link'
import { Phone, Droplets, AlertTriangle, Clock, Star, CheckCircle } from 'lucide-react'

const painPoints = [
  {
    icon: Phone,
    title: 'Calls go to voicemail at 11 PM',
    description:
      'A burst pipe doesn\'t care about your business hours. Customers who can\'t reach you call your competitor instead.',
  },
  {
    icon: Droplets,
    title: 'You miss the flood emergency',
    description:
      'Every minute a customer spends on hold with a burst pipe is more water damage — and more blame on you for not answering.',
  },
  {
    icon: AlertTriangle,
    title: 'No-shows cost you truck rolls',
    description:
      'Without automated reminders, 15–20% of residential appointments end in wasted drive time and lost revenue.',
  },
]

const features = [
  'Answers every inbound call — even at 2 AM on a Sunday',
  'Recognizes plumbing emergencies: burst pipe, sewer backup, no hot water, flooding',
  'Immediately texts the owner for life-safety situations',
  'Books routine appointments against your live Google Calendar',
  'Quotes price ranges for drain cleaning, water heater repair, fixture replacement',
  'Sends SMS confirmations + 24-hour reminders to reduce no-shows',
  'Syncs jobs to Jobber CRM automatically',
  'Bilingual English + Spanish — no language barrier',
  'Full call transcript + AI summary in your dashboard',
]

const testimonials = [
  {
    name: 'Carlos R.',
    business: 'Rivera Plumbing — Houston, TX',
    quote:
      'I used to miss 3–4 calls a night. Now Blue-Collar Agent handles everything and I wake up to a full schedule. Made back my subscription fee in the first week.',
    rating: 5,
  },
  {
    name: 'Mike T.',
    business: 'Tanner\'s Plumbing — Phoenix, AZ',
    quote:
      'The emergency triage is spot-on. It knows exactly when to call me at 3 AM versus when to just book a morning appointment. That intelligence alone is worth it.',
    rating: 5,
  },
]

export default function PlumbingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-4">For Plumbers</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Never miss a plumbing emergency call again
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mb-10">
            Blue-Collar Agent answers your calls 24/7, triages burst pipes and flooding emergencies, books routine jobs, and sends SMS confirmations — all without you lifting a finger.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="border border-blue-300 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-blue-300 text-sm mt-6">14-day free trial · No credit card · Setup in 15 min</p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">The problem every plumber knows</h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            You can&apos;t answer calls when you&apos;re under a sink. But customers calling with a flooding basement won&apos;t wait.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-red-600" />
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
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">Built for Plumbers</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                An AI receptionist that understands plumbing
              </h2>
              <p className="text-gray-600 mb-8">
                Blue-Collar Agent isn&apos;t a generic chatbot. It&apos;s trained on plumbing emergency scenarios and knows the difference between a dripping faucet and a burst main line.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

      {/* Stats */}
      <section className="bg-blue-600 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '37%', label: 'of plumbing calls go unanswered', sub: 'That\'s revenue walking out the door' },
            { stat: '$950', label: 'average value of an emergency job', sub: 'One saved call = two months subscription' },
            { stat: '24/7', label: 'coverage without overtime', sub: 'No more answering service markups' },
          ].map((s) => (
            <div key={s.stat}>
              <p className="text-5xl font-extrabold mb-2">{s.stat}</p>
              <p className="font-semibold mb-1">{s.label}</p>
              <p className="text-blue-200 text-sm">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Plumbers love it</h2>
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
          Set up your AI plumbing receptionist in 15 minutes
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Free 14-day trial. No credit card. Cancel anytime. You&apos;ll be live before you finish your next job.
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          Start Free Trial
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Questions?{' '}
          <Link href="/how-it-works" className="text-blue-600 hover:underline">
            See how it works →
          </Link>
        </p>
      </section>
    </div>
  )
}

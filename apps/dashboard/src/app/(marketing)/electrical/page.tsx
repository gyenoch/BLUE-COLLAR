import Link from 'next/link'
import { Phone, Zap, AlertTriangle, Shield, Star, CheckCircle } from 'lucide-react'

const painPoints = [
  {
    icon: Zap,
    title: 'Electrical emergencies can\'t wait',
    description:
      'Sparking panels, power outages, and burning smells are safety emergencies. Every minute without a response puts the customer at risk — and your liability on the line.',
  },
  {
    icon: Phone,
    title: 'You\'re on-site and can\'t answer',
    description:
      'Electricians work in attics, crawlspaces, and service panels. Pulling out your phone mid-job isn\'t safe or practical. Calls get missed.',
  },
  {
    icon: AlertTriangle,
    title: 'Permit and inspection calls pile up',
    description:
      'Between scheduling rough-in inspections, scheduling final inspections, and chasing down permits — admin calls eat time you don\'t have.',
  },
]

const features = [
  'Answers every call — even when you\'re in a panel or on a ladder',
  'Triages electrical emergencies: sparks, burning smell, total power loss, arc faults',
  'Immediately pages you for shock/fire hazard emergencies',
  'Books residential and commercial service calls against your live calendar',
  'Quotes price ranges for panel upgrades, outlet installation, inspection prep',
  'Handles permit and inspection scheduling questions with your standard answers',
  'Sends SMS confirmations and 24-hour reminders to reduce missed appointments',
  'Bilingual English + Spanish for broader market coverage',
  'Full AI call summary and transcript after every call',
]

const testimonials = [
  {
    name: 'David K.',
    business: 'Kilowatt Electric — Austin, TX',
    quote:
      'My old answering service would take a message and email it to me. Blue-Collar Agent actually books the job. My close rate went from 40% to 85% because customers get confirmation right away.',
    rating: 5,
  },
  {
    name: 'Priya N.',
    business: 'NovaSpark Electrical — San Jose, CA',
    quote:
      'The emergency triage is what sold me. When a customer mentions sparks or a burning smell, the AI immediately texts me. I can respond in seconds even when I\'m buried in a job.',
    rating: 5,
  },
]

export default function ElectricalPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 py-24 px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-100 text-sm font-semibold uppercase tracking-widest mb-4">For Electricians</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Triage electrical emergencies around the clock
          </h1>
          <p className="text-xl text-yellow-100 max-w-2xl mb-10">
            Blue-Collar Agent answers your calls 24/7, immediately escalates sparks and power-loss emergencies to you, and books all your routine service calls automatically — so you can focus on the work.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="bg-white text-yellow-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/how-it-works"
              className="border border-yellow-200 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-yellow-200 text-sm mt-6">14-day free trial · No credit card · Setup in 15 min</p>
        </div>
      </section>

      {/* Safety badge */}
      <section className="bg-red-50 border-y border-red-100 py-5 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Shield className="h-8 w-8 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">
            <strong>Emergency escalation built-in:</strong> When a caller mentions sparks, burning smell, shock, or complete power loss — Blue-Collar Agent immediately texts and calls you, regardless of the hour.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">The electrician call problem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Electrical work demands focus. You can&apos;t split attention between a live panel and an incoming call. But missed calls mean missed revenue — and worse, missed emergencies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                  <p.icon className="h-5 w-5 text-yellow-600" />
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
              <p className="text-yellow-600 font-semibold text-sm uppercase tracking-wide mb-2">Built for Electricians</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your AI knows the difference between a routine job and a fire hazard
              </h2>
              <p className="text-gray-600 mb-8">
                Blue-Collar Agent is trained on electrical emergency scenarios. It collects the right information — location, symptoms, circuit behavior — and makes the right call about urgency so you never have to wonder.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
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
      <section className="bg-yellow-500 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '42%', label: 'of electricians miss 5+ calls/week', sub: 'Each missed call averages $400–$1,500 in lost revenue' },
            { stat: '<2s', label: 'owner notification on emergencies', sub: 'Text + call immediately — not after business hours' },
            { stat: '85%', label: 'booking rate when calls are answered', sub: 'vs 40% when customers leave voicemail' },
          ].map((s) => (
            <div key={s.stat}>
              <p className="text-5xl font-extrabold mb-2">{s.stat}</p>
              <p className="font-semibold mb-1">{s.label}</p>
              <p className="text-yellow-100 text-sm">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Electricians trust it</h2>
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
          Never miss an electrical emergency call again
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Set up your AI receptionist in 15 minutes and go back to focusing on the work that matters.
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-yellow-500 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-600 transition-colors"
        >
          Start Free Trial
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          See{' '}
          <Link href="/pricing" className="text-yellow-600 hover:underline">
            pricing →
          </Link>
        </p>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Phone, Brain, CalendarCheck, MessageSquare } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Phone,
    title: 'Customer calls your business number',
    description:
      'Your Twilio-powered business number rings. Blue-Collar Agent answers instantly — no hold music, no voicemail, no missed calls. Available 24/7 including nights, weekends, and holidays.',
    details: [
      'Answers in under 2 rings',
      'Professional greeting in your business name',
      'Available in English and Spanish',
      'No busy signals — every call gets answered',
    ],
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI triages the situation',
    description:
      'Powered by Claude AI, your agent listens and understands the caller\'s issue. It identifies whether the situation is an emergency, a routine service request, or a pricing inquiry — then responds accordingly.',
    details: [
      'Recognizes emergency keywords (flood, no heat, gas leak, sparks)',
      'Dispatches owner immediately for life-safety emergencies',
      'Qualifies service type, urgency level, and location',
      'Quotes price ranges for common jobs',
    ],
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Books the appointment',
    description:
      'The agent checks your real-time Google Calendar availability and offers the caller open slots. Appointments are confirmed on the spot — no callbacks, no back-and-forth.',
    details: [
      'Checks live calendar availability',
      'Offers multiple time options',
      'Sends SMS confirmation to the customer',
      'Syncs to your Google Calendar instantly',
    ],
  },
  {
    step: '04',
    icon: MessageSquare,
    title: 'You get a full summary',
    description:
      'After every call you receive a push notification and SMS with a complete call summary: who called, what they need, the urgency level, and what was scheduled. No surprises.',
    details: [
      'Call recording + AI transcript',
      'Lead score (Hot / Warm / Cold)',
      'Appointment details and customer contact info',
      'Full history in your owner dashboard',
    ],
  },
]

const integrations = [
  { name: 'Twilio', desc: 'Voice calls & SMS', color: 'bg-red-100 text-red-700' },
  { name: 'Claude AI', desc: 'Conversation intelligence', color: 'bg-purple-100 text-purple-700' },
  { name: 'Deepgram', desc: 'Speech-to-text', color: 'bg-blue-100 text-blue-700' },
  { name: 'ElevenLabs', desc: 'Natural AI voice', color: 'bg-orange-100 text-orange-700' },
  { name: 'Google Calendar', desc: 'Real-time availability', color: 'bg-green-100 text-green-700' },
  { name: 'Jobber CRM', desc: 'Job & customer sync', color: 'bg-teal-100 text-teal-700' },
]

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">How It Works</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Your AI agent answers, triages,<br className="hidden md:block" /> and books — automatically
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          From the moment a customer calls to the appointment confirmation SMS, Blue-Collar Agent handles everything without you lifting a finger.
        </p>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`flex flex-col md:flex-row gap-10 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Icon block */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-20 bg-blue-100 mt-4 hidden md:block" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-blue-600 font-bold text-sm tracking-widest mb-1">STEP {step.step}</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-5">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Powered by best-in-class infrastructure</h2>
          <p className="text-gray-600 mb-10">We connect the tools you already trust into one seamless AI agent.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {integrations.map((int) => (
              <div key={int.name} className="bg-white rounded-xl border border-gray-200 p-5 text-left shadow-sm">
                <span className={`inline-block text-xs font-bold px-2 py-1 rounded mb-2 ${int.color}`}>
                  {int.name}
                </span>
                <p className="text-sm text-gray-600">{int.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup timeline */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Live in 15 minutes</h2>
          <p className="text-gray-600 mb-12">Our onboarding wizard walks you through every step.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { min: '0–3 min', label: 'Create account' },
              { min: '3–7 min', label: 'Set business hours & emergency keywords' },
              { min: '7–11 min', label: 'Connect Google Calendar' },
              { min: '11–14 min', label: 'Set pricing ranges' },
              { min: '14–15 min', label: 'AI agent goes live' },
            ].map((t, i) => (
              <div key={t.label} className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-2">
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-blue-600">{t.min}</p>
                <p className="text-xs text-gray-600 text-center mt-1">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">See it in action</h2>
        <p className="text-blue-100 mb-8 text-lg">Start your free 14-day trial. No credit card required.</p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  )
}

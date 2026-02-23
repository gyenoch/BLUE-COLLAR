import Link from 'next/link'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 299,
    description: 'For solo operators getting started with AI call answering',
    cta: 'Start Free Trial',
    popular: false,
    features: [
      { text: 'Up to 200 calls/month', included: true },
      { text: 'Emergency triage (plumbing, HVAC, electrical)', included: true },
      { text: 'Appointment booking + SMS confirmations', included: true },
      { text: 'Google Calendar sync', included: true },
      { text: 'Owner dashboard', included: true },
      { text: 'Email support', included: true },
      { text: 'Bilingual (English + Spanish)', included: false },
      { text: 'Jobber CRM integration', included: false },
      { text: 'AI call summaries + transcripts', included: false },
      { text: 'Multi-technician dispatch', included: false },
    ],
  },
  {
    name: 'Growth',
    price: 499,
    description: 'For growing businesses taking more calls every day',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      { text: 'Up to 500 calls/month', included: true },
      { text: 'Emergency triage (plumbing, HVAC, electrical)', included: true },
      { text: 'Appointment booking + SMS confirmations', included: true },
      { text: 'Google Calendar sync', included: true },
      { text: 'Owner dashboard', included: true },
      { text: 'Priority support', included: true },
      { text: 'Bilingual (English + Spanish)', included: true },
      { text: 'Jobber CRM integration', included: true },
      { text: 'AI call summaries + transcripts', included: true },
      { text: 'Multi-technician dispatch', included: false },
    ],
  },
  {
    name: 'Scale',
    price: 799,
    description: 'For multi-tech operations running at full volume',
    cta: 'Contact Sales',
    popular: false,
    features: [
      { text: 'Unlimited calls', included: true },
      { text: 'Emergency triage (plumbing, HVAC, electrical)', included: true },
      { text: 'Appointment booking + SMS confirmations', included: true },
      { text: 'Google Calendar sync', included: true },
      { text: 'Owner dashboard', included: true },
      { text: 'Dedicated success manager', included: true },
      { text: 'Bilingual (English + Spanish)', included: true },
      { text: 'Jobber CRM integration', included: true },
      { text: 'AI call summaries + transcripts', included: true },
      { text: 'Multi-technician dispatch', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — every plan starts with a 14-day free trial. No credit card required.',
  },
  {
    q: 'What happens when I go over my call limit?',
    a: 'On Starter and Growth plans, additional calls are billed at $0.75/call. You\'ll get an email alert when you reach 80% of your limit.',
  },
  {
    q: 'Can I change plans anytime?',
    a: 'Absolutely. Upgrade or downgrade at any time. Changes take effect immediately and we prorate the difference.',
  },
  {
    q: 'Does the AI really answer 24/7?',
    a: 'Yes. Your AI agent answers calls around the clock — including nights, weekends, and holidays — without ever calling in sick.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live within 15 minutes. Our onboarding wizard walks you through business hours, emergency keywords, and pricing ranges.',
  },
  {
    q: 'What if the AI can\'t handle a call?',
    a: 'For situations the AI can\'t resolve, it can transfer the call to you or take a detailed message with the caller\'s contact info and issue summary.',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          No per-minute charges. No hidden fees. Just one flat monthly rate for unlimited AI-powered call answering.
        </p>
        <p className="text-sm text-gray-500">14-day free trial · No credit card required · Cancel anytime</p>
      </section>

      {/* Plans */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? 'border-blue-600 shadow-xl ring-2 ring-blue-600'
                  : 'border-gray-200 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 mb-2">/mo</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    {f.included ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${f.included ? 'text-gray-800' : 'text-gray-400'}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ROI callout */}
      <section className="bg-blue-600 py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">The math is simple</h2>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
          One missed emergency call can cost you $500–$2,000 in lost revenue. Blue-Collar Agent pays for itself with a single saved booking.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { stat: '37%', label: 'of calls go unanswered at trade businesses' },
            { stat: '$800', label: 'average value of a new plumbing/HVAC job' },
            { stat: '< 1 job', label: 'needed to cover your monthly subscription' },
          ].map((item) => (
            <div key={item.label} className="bg-blue-700 rounded-xl p-6">
              <p className="text-4xl font-extrabold">{item.stat}</p>
              <p className="text-blue-200 text-sm mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently asked questions</h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to stop missing calls?</h2>
        <p className="text-gray-600 mb-8">Set up your AI agent in 15 minutes. Free for 14 days.</p>
        <Link
          href="/sign-up"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          Start Free Trial
        </Link>
      </section>
    </div>
  )
}

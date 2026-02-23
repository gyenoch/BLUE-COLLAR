import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Static blog post content keyed by slug
const posts: Record<string, {
  title: string
  category: string
  categoryColor: string
  date: string
  readTime: string
  excerpt: string
  content: string[]
}> = {
  'how-much-revenue-are-you-losing-to-missed-calls': {
    title: 'How Much Revenue Are You Losing to Missed Calls?',
    category: 'Business Growth',
    categoryColor: 'bg-blue-100 text-blue-700',
    date: 'Feb 18, 2026',
    readTime: '5 min read',
    excerpt: 'The average trade business misses 37% of its inbound calls. At $800 per job, that\'s tens of thousands of dollars a year walking out the door.',
    content: [
      'If you run a plumbing, HVAC, or electrical business, here\'s a number that should keep you up at night: 37%. That\'s the percentage of inbound calls that the average trade business misses.',
      'Not because the owner doesn\'t care. Because they\'re physically on a job, under a sink, or in an attic — exactly where they\'re supposed to be.',
      '## The math is brutal',
      'Let\'s say your average job is worth $800 (conservative for emergency calls). You get 30 inbound calls per week. You miss 37% — that\'s 11 calls.',
      'Assume 60% of answered calls turn into booked jobs. That\'s 6–7 jobs you\'re losing every single week. At $800 each, you\'re leaving $5,000+ on the table every week.',
      'Over a year? That\'s over $250,000 in lost revenue. From missed calls alone.',
      '## Why calls go unanswered',
      'The reasons are always the same:',
      '**You\'re on a job.** You can\'t answer a call when you\'re in someone\'s crawlspace or on a ladder. That\'s not laziness — that\'s professionalism on the current job.',
      '**It\'s after hours.** Emergencies don\'t happen on business hours. A burst pipe at 11 PM is worth $1,200. The customer who can\'t reach you will call the next plumber on Google.',
      '**You\'re driving.** Between jobs, you\'re behind the wheel. Distracted driving is dangerous and illegal. You can\'t answer.',
      '## What happens when you miss a call',
      'Here\'s the reality: a customer with a problem will call 2–3 businesses. The first one to answer gets the job. It\'s that simple.',
      'They don\'t leave voicemail and wait for a callback. They move on.',
      '## The solution',
      'You need someone — or something — answering your calls every time, around the clock. Not a receptionist (too expensive, doesn\'t work nights). Not a generic answering service (reads scripts, can\'t book jobs). An AI agent that understands your business, triages emergencies, and books appointments in real time.',
      'That\'s exactly what Blue-Collar Agent does. It answers every call, qualifies the lead, books the job, and sends you a summary. You wake up to a full schedule.',
      'The ROI calculation is simple: if it saves you one $800 job per month, it more than covers the $299 subscription. Most customers report saving 5–10 jobs in their first month.',
    ],
  },
  'ai-receptionist-vs-answering-service-which-is-better': {
    title: 'AI Receptionist vs. Answering Service: Which Is Better for Trade Businesses?',
    category: 'AI & Technology',
    categoryColor: 'bg-purple-100 text-purple-700',
    date: 'Feb 14, 2026',
    readTime: '7 min read',
    excerpt: 'Traditional answering services charge per minute and read from scripts. AI receptionists understand context and actually book jobs.',
    content: [
      'If you\'re tired of missing calls, you\'ve probably looked at two options: a traditional answering service or an AI receptionist. Both answer your phone when you can\'t. But the similarities end there.',
      '## Traditional Answering Services',
      'Traditional answering services use human agents — usually working in call centers — who answer calls on your behalf. They typically:',
      '- Charge $0.75–$1.50 per minute',
      '- Read from a script you provide',
      '- Take messages and email them to you',
      '- Can\'t check your calendar or book appointments',
      '- Don\'t understand trade-specific emergencies',
      'For a trade business taking 30+ calls per week, this can easily run $400–$800/month — and you still have to call customers back to actually book the job.',
      '## AI Receptionists',
      'AI receptionists like Blue-Collar Agent use large language models to have natural conversations with callers. They:',
      '- Answer in under 2 rings, 24/7/365',
      '- Understand context — they know a "burst pipe" is different from a "slow drain"',
      '- Check your real calendar and book appointments on the spot',
      '- Send SMS confirmations to customers automatically',
      '- Cost a flat monthly fee with no per-minute charges',
      '## The real difference: booking rate',
      'This is where it matters. An answering service takes a message. The customer hangs up, wondering if they\'ll hear back. They often don\'t wait — they call your competitor.',
      'An AI receptionist books the job on the call. The customer gets an SMS confirmation. The appointment is in your calendar. The revenue is secured.',
      'We\'ve seen booking rates go from 40% (voicemail/answering service) to 85%+ (AI receptionist) — because customers who get immediate confirmation don\'t need to look elsewhere.',
      '## Which should you choose?',
      'For most trade businesses, an AI receptionist is the better choice: better customer experience, better booking rates, and a predictable flat monthly cost. The only case where a traditional answering service might make sense is if you need a human to make judgment calls that go well beyond scheduling — but for the vast majority of trade calls, AI handles it better.',
    ],
  },
}

// Fallback content for slugs not in our static map
const fallbackPost = {
  title: 'Coming Soon',
  category: 'Tips & Strategy',
  categoryColor: 'bg-green-100 text-green-700',
  date: 'Feb 2026',
  readTime: '5 min read',
  excerpt: 'This article is coming soon.',
  content: [
    'We\'re working on this article. Check back soon for practical tips for your trade business.',
    'In the meantime, explore our other guides or start your free trial of Blue-Collar Agent.',
  ],
}

const relatedPosts = [
  {
    slug: 'how-much-revenue-are-you-losing-to-missed-calls',
    title: 'How Much Revenue Are You Losing to Missed Calls?',
    date: 'Feb 18, 2026',
    readTime: '5 min read',
    category: 'Business Growth',
    categoryColor: 'bg-blue-100 text-blue-700',
  },
  {
    slug: 'ai-receptionist-vs-answering-service-which-is-better',
    title: 'AI Receptionist vs. Answering Service: Which Is Better?',
    date: 'Feb 14, 2026',
    readTime: '7 min read',
    category: 'AI & Technology',
    categoryColor: 'bg-purple-100 text-purple-700',
  },
  {
    slug: 'reduce-no-shows-sms-reminders',
    title: 'How to Cut No-Shows by 60% with Automated SMS Reminders',
    date: 'Jan 24, 2026',
    readTime: '5 min read',
    category: 'Operations',
    categoryColor: 'bg-orange-100 text-orange-700',
  },
]

function renderContent(content: string[]) {
  return content.map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {block.replace('## ', '')}
        </h2>
      )
    }
    if (block.startsWith('- ')) {
      return (
        <li key={i} className="text-gray-700 leading-relaxed ml-4 list-disc">
          {block.replace('- ', '')}
        </li>
      )
    }
    if (block.startsWith('**')) {
      const parts = block.split(/\*\*(.+?)\*\*/)
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-4">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      )
    }
    return (
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {block}
      </p>
    )
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug] ?? fallbackPost

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${post.categoryColor}`}>
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">
          {renderContent(post.content)}
        </div>

        {/* CTA in article */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Stop losing calls. Start with a free trial.
          </h3>
          <p className="text-gray-600 mb-6 text-sm">
            Blue-Collar Agent answers every call, triages emergencies, and books jobs — 24/7. Setup takes 15 minutes.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Free Trial
          </Link>
          <p className="text-xs text-gray-400 mt-3">14 days free · No credit card required</p>
        </div>

        {/* Related posts */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">More for trade business owners</h2>
          <div className="space-y-4">
            {relatedPosts
              .filter((p) => p.slug !== params.slug)
              .slice(0, 2)
              .map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <div className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${p.categoryColor}`}>
                        {p.category}
                      </span>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {p.date} · {p.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

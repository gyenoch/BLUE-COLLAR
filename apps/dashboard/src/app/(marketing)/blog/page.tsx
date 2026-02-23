import Link from 'next/link'

const posts = [
  {
    slug: 'how-much-revenue-are-you-losing-to-missed-calls',
    category: 'Business Growth',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'How Much Revenue Are You Losing to Missed Calls?',
    excerpt:
      'The average trade business misses 37% of its inbound calls. At $800 per job, that\'s tens of thousands of dollars a year walking out the door. Here\'s how to calculate your number.',
    date: 'Feb 18, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    slug: 'ai-receptionist-vs-answering-service-which-is-better',
    category: 'AI & Technology',
    categoryColor: 'bg-purple-100 text-purple-700',
    title: 'AI Receptionist vs. Answering Service: Which Is Better for Trade Businesses?',
    excerpt:
      'Traditional answering services charge per minute and read from scripts. AI receptionists answer instantly, understand context, and actually book jobs. Here\'s the full comparison.',
    date: 'Feb 14, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    slug: 'how-to-handle-hvac-call-surge-summer',
    category: 'HVAC',
    categoryColor: 'bg-sky-100 text-sky-700',
    title: 'How to Handle the Summer HVAC Call Surge Without Hiring',
    excerpt:
      'When every AC unit in the city breaks the same week, your phone doesn\'t stop. Here\'s how smart HVAC operators manage peak season without burning out their staff.',
    date: 'Feb 10, 2026',
    readTime: '6 min read',
    featured: false,
  },
  {
    slug: 'bilingual-ai-receptionist-spanish-trades',
    category: 'Tips & Strategy',
    categoryColor: 'bg-green-100 text-green-700',
    title: 'Why Your Trade Business Needs a Bilingual AI Receptionist',
    excerpt:
      'In Texas, Florida, California, and Arizona — 20–40% of homeowners speak Spanish as their primary language. Here\'s what bilingual call handling means for your bottom line.',
    date: 'Feb 6, 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    slug: 'plumbing-emergency-triage-scripts',
    category: 'Plumbing',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'Emergency Triage Scripts Every Plumber Should Use',
    excerpt:
      'The questions you ask in the first 30 seconds of a plumbing emergency call determine the outcome. Here are the scripts the best plumbers use — and how to automate them.',
    date: 'Jan 30, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    slug: 'reduce-no-shows-sms-reminders',
    category: 'Operations',
    categoryColor: 'bg-orange-100 text-orange-700',
    title: 'How to Cut No-Shows by 60% with Automated SMS Reminders',
    excerpt:
      'No-shows cost trade businesses 15–20% of scheduled revenue. A simple 24-hour SMS reminder changes everything. Here\'s the data and how to set it up.',
    date: 'Jan 24, 2026',
    readTime: '5 min read',
    featured: false,
  },
  {
    slug: 'google-calendar-sync-trade-scheduling',
    category: 'Tools & Integrations',
    categoryColor: 'bg-teal-100 text-teal-700',
    title: 'Why Google Calendar Sync Is a Game-Changer for Trade Scheduling',
    excerpt:
      'When your AI agent can check your real-time availability and book jobs directly into your calendar, you eliminate double-bookings and callback hell forever.',
    date: 'Jan 18, 2026',
    readTime: '4 min read',
    featured: false,
  },
  {
    slug: 'electrical-emergency-what-to-ask',
    category: 'Electrical',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    title: 'What to Ask When a Customer Calls About an Electrical Emergency',
    excerpt:
      'Not every "emergency" call is life-threatening — but some are. Here\'s the triage framework electricians use to prioritize calls and protect customers (and themselves).',
    date: 'Jan 12, 2026',
    readTime: '6 min read',
    featured: false,
  },
]

const categories = ['All', 'Business Growth', 'AI & Technology', 'HVAC', 'Plumbing', 'Electrical', 'Operations', 'Tips & Strategy']

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gray-50 border-b py-16 px-6 text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Blog</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Tips and guides for trade business owners
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Grow your plumbing, HVAC, or electrical business with practical advice on operations, technology, and customer service.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                cat === 'All'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Featured</p>
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-8 hover:shadow-lg transition-shadow">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${featuredPost.categoryColor}`}>
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{featuredPost.date}</span>
                  <span>·</span>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit ${post.categoryColor}`}>
                  {post.category}
                </span>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 flex-1">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Get tips in your inbox</h3>
          <p className="text-blue-100 mb-6">One email a week. Practical advice for trade business owners. No fluff.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@yourcompany.com"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-blue-300 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  )
}

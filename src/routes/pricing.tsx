import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For open-source and personal projects.",
    features: [
      { text: "Public repos only", included: true },
      { text: "Up to 50 reviews/month", included: true },
      { text: "Core bug detection & style", included: true },
      { text: "PR summary comments", included: true },
      { text: "Architectural suggestions", included: false },
      { text: "Priority review queue", included: false },
      { text: "Custom style rules", included: false },
      { text: "Team dashboard & insights", included: false },
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For solo developers shipping private projects.",
    features: [
      { text: "One private repo", included: true },
      { text: "Unlimited reviews", included: true },
      { text: "Core bug detection & style", included: true },
      { text: "PR summary comments", included: true },
      { text: "Architectural suggestions", included: true },
      { text: "Priority review queue", included: true },
      { text: "Custom style rules", included: false },
      { text: "Team dashboard & insights", included: false },
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For small teams growing together.",
    features: [
      { text: "Up to 5 private repos", included: true },
      { text: "Unlimited reviews", included: true },
      { text: "Core bug detection & style", included: true },
      { text: "PR summary comments", included: true },
      { text: "Architectural suggestions", included: true },
      { text: "Priority review queue", included: true },
      { text: "Custom style rules", included: true },
      { text: "Team dashboard & insights", included: true },
    ],
    cta: "Start free trial",
    featured: false,
  },
];

const allFeatures = [
  "Repositories",
  "Reviews per month",
  "Bug detection & style",
  "PR summary comments",
  "Architectural suggestions",
  "Priority review queue",
  "Custom style rules",
  "Team dashboard & insights",
];

const featureDetails = [
  ["Public repos only", "One private repo", "Up to 5 private repos"],
  ["50 / month", "Unlimited", "Unlimited"],
  ["✓", "✓", "✓"],
  ["✓", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "✓", "✓"],
  ["—", "—", "✓"],
  ["—", "—", "✓"],
];

function PricingPage() {
  return (
    <div className="min-h-dvh bg-white dark:bg-gray-950">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-lg dark:border-gray-800/60 dark:bg-gray-950/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 112 0v4zm-1-7a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Prism</span>
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Docs
            </Link>
            <a
              href="#"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Install on GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* Page Header */}
      <section className="px-6 pt-20 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Start for free. Upgrade when you need more reviews, private repos, or team features.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pt-16 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.featured
                    ? "border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-600/10 dark:border-indigo-500 dark:bg-indigo-950"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{tier.name}</h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{tier.period}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {f.included ? (
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`rounded-full px-6 py-3 text-center text-sm font-semibold transition-all ${
                    tier.featured
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Full feature comparison
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-600 dark:text-gray-400">
            See exactly what you get with each plan.
          </p>
          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">Free</th>
                  <th className="px-6 py-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 dark:text-white">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className="bg-white dark:bg-gray-950">
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{feature}</td>
                    {featureDetails[i].map((detail, j) => (
                      <td
                        key={j}
                        className={`px-6 py-4 text-center ${
                          detail === "✓"
                            ? "text-indigo-600 dark:text-indigo-400"
                            : detail === "—"
                              ? "text-gray-300 dark:text-gray-600"
                              : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {detail}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-gray-200 bg-gray-50 px-6 py-20 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Frequently asked questions
            </h2>
            <div className="mt-12 space-y-8">
              {[
                {
                  q: "Can I switch plans at any time?",
                  a: "Yes. You can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to the new features. Downgrades take effect at the end of your billing cycle.",
                },
                {
                  q: "What counts as a review?",
                  a: "A review is one analysis of one pull request. Re-running a review (e.g. after pushing new commits to the same PR) counts as a new review. Comments and summaries posted to the PR are always included.",
                },
                {
                  q: "Is there a free trial for paid plans?",
                  a: "Yes! All paid plans come with a 14-day free trial — no credit card required. You'll get full access to every feature in your chosen tier.",
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Absolutely. You can cancel anytime from your account settings. Your subscription remains active until the end of the current billing period.",
                },
                {
                  q: "Do you offer discounts for open-source projects?",
                  a: "Yes. Open-source projects on public repos can use the Free tier indefinitely. If your project needs more reviews, reach out — we offer discounted Pro plans for qualifying open-source maintainers.",
                },
                {
                  q: "Who can see the code I review?",
                  a: "Review data is never shared or used for training. Prism processes your code only to generate the review. The Free tier processes public repo code; Pro and Team plans process private repo code — all with the same privacy standards.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-16 text-center shadow-2xl sm:px-16 sm:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.15),transparent_50%)]" />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start shipping with confidence
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
              Install Prism on your GitHub repo and get your first review in under a minute. No credit card required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#"
                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50"
              >
                Install on GitHub
              </a>
              <Link
                to="/docs"
                className="rounded-full border border-indigo-400 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-500"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-12 dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0V9a1 1 0 112 0v4zm-1-7a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Prism</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Home</Link>
            <Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Pricing</Link>
            <Link to="/docs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Docs</Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Prism. Built with{" "}
            <a href="https://cto.new" className="underline hover:text-gray-700 dark:hover:text-gray-300">cto.new</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
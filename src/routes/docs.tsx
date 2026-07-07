import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const sections = [
  {
    id: "how-it-works",
    title: "How Prism works",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Prism is an AI-powered code reviewer that integrates directly with GitHub. When you open a pull request,
          Prism automatically analyzes the diff and posts line-level comments and a summary review — just like a
          human teammate would, but faster.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Install on GitHub",
              desc: "Add the Prism GitHub App to any repository you own. You can install it on individual repos or all repos in an organization.",
            },
            {
              step: "2",
              title: "Open a pull request",
              desc: "Push code like you normally do. When a pull request is opened or updated, Prism receives a webhook and starts analyzing the diff.",
            },
            {
              step: "3",
              title: "Get your review",
              desc: "Within seconds, Prism posts line-level comments and a summary review on your PR. Fix what matters, merge with confidence.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-8 font-semibold text-gray-900 dark:text-white">What Prism checks</h3>
        <ul className="list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-400">
          <li><strong className="text-gray-900 dark:text-white">Bugs & logic errors</strong> — null pointer risks, race conditions, off-by-one errors, incorrect assumptions</li>
          <li><strong className="text-gray-900 dark:text-white">Code style</strong> — naming conventions, formatting consistency, deprecated patterns</li>
          <li><strong className="text-gray-900 dark:text-white">Architecture</strong> — overly complex functions, poor abstractions, tight coupling, missing error handling</li>
          <li><strong className="text-gray-900 dark:text-white">Security</strong> — injection risks, hardcoded secrets, unsafe deserialization, missing input validation</li>
          <li><strong className="text-gray-900 dark:text-white">Explanations</strong> — every suggestion includes <em>why</em> the change matters and what impact it has</li>
        </ul>
      </div>
    ),
  },
  {
    id: "installation",
    title: "Installation guide",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Installing Prism takes less than a minute. Here's how:
        </p>
        <div className="space-y-6">
          {[
            {
              title: "1. Install the GitHub App",
              desc: "Click 'Install on GitHub' from any page on the Prism site. You'll be taken to GitHub to authorize the Prism app.",
              note: "You need admin access to the repository or organization where you want to install Prism.",
            },
            {
              title: "2. Select repositories",
              desc: "Choose whether to install Prism on all repositories or select specific ones. You can change this later from your GitHub settings.",
              note: "Free tier only works on public repositories. Pro and Team plans support private repositories.",
            },
            {
              title: "3. Configure your preferences",
              desc: "Once installed, visit your Prism dashboard to configure review settings per repository — enable or disable specific checks, set style rules, and more.",
            },
            {
              title: "4. Open a PR",
              desc: "That's it. Open a pull request on any connected repository. Prism will automatically analyze the diff and post a review within seconds.",
            },
          ].map((step) => (
            <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.desc}</p>
              {"note" in step && step.note && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{step.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "configuration",
    title: "Configuration guide",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Prism works out of the box with sensible defaults, but you can customize its behaviour to match your
          team's preferences. Team plan subscribers get full custom style rule support.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Review depth</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Choose between a quick scan (catches obvious bugs and style issues — completes in seconds) or a
              deep review (full architectural analysis, security audit, and detailed explanations — takes a bit longer).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Custom style rules</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Define your team's coding conventions. Prism supports custom rule sets for:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
              <li>Naming conventions (camelCase, snake_case, PascalCase — and exceptions)</li>
              <li>Import ordering and grouping</li>
              <li>Maximum function/component length</li>
              <li>Preferred patterns (e.g. prefer early returns over nested ifs)</li>
              <li>Project-specific conventions (any pattern you want enforced)</li>
            </ul>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Custom rules are available on the Team plan. Pro plans use Prism's default rule set.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Per-repository settings</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Each repository can have its own review configuration. Configure from the Prism dashboard:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
              <li>Enable or disable specific check categories (bugs, style, architecture, security)</li>
              <li>Set review depth per repo</li>
              <li>Exclude specific files or directories from review</li>
              <li>Add repository-specific conventions</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Ignoring files</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Add a <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200">.prismignore</code> file to your repository root to exclude specific files or
              patterns from review. It follows the same syntax as <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200">.gitignore</code>.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "faq",
    title: "Frequently asked questions",
    content: (
      <div className="space-y-6">
        {[
          {
            q: "Which platforms and languages does Prism support?",
            a: "Prism supports all languages that GitHub recognizes. It's especially strong with JavaScript, TypeScript, Python, Go, Rust, Ruby, Java, and C#. The analysis works on any file included in the PR diff.",
          },
          {
            q: "Will Prism slow down my CI pipeline?",
            a: "No. Prism runs asynchronously and posts results directly to the PR. Your CI pipeline is unaffected. Most reviews complete in under 30 seconds.",
          },
          {
            q: "Can I request a re-review?",
            a: "Yes. Pushing new commits to the branch automatically triggers a new review. You can also manually request a re-review from the Prism dashboard.",
          },
          {
            q: "Is my code safe? Do you train on my code?",
            a: "Your code is never used for training. Prism processes each diff only to generate the review and does not store or share your code. We take privacy seriously — see our privacy policy for details.",
          },
          {
            q: "What happens if Prism hits an error?",
            a: "If Prism can't analyze a PR (e.g. unsupported file format or a timeout), it posts a comment on the PR explaining what went wrong. No review is better than a wrong review.",
          },
          {
            q: "Can I use Prism with monorepos?",
            a: "Absolutely. Prism works with repositories of any size and structure, including monorepos. Per-repository settings apply to the whole repo regardless of its internal structure.",
          },
          {
            q: "How do I uninstall Prism?",
            a: "Remove the Prism GitHub App from your repository or organization settings on GitHub. That's it — Prism will stop receiving events and no further reviews will be posted.",
          },
        ].map((faq) => (
          <div key={faq.q} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white">{faq.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{faq.a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

function DocsPage() {
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
            <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
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

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:flex lg:gap-16">
        {/* Sidebar */}
        <aside className="mb-10 lg:mb-0 lg:w-64 lg:flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500">
              Documentation
            </p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Documentation
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Everything you need to know about installing, configuring, and using Prism.
          </p>

          <div className="mt-16 space-y-20">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-20 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Still have questions?</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We're here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <a
              href="#"
              className="mt-4 inline-flex rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Contact support
            </a>
          </div>
        </main>
      </div>

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
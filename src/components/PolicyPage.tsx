import Link from "next/link";

type PolicySection = {
  title: string;
  paragraphs: string[];
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
};

export default function PolicyPage({ eyebrow, title, intro, sections }: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(135deg,#111827_0%,#7f1d1d_52%,#f84464_100%)] px-6 py-8 text-white sm:px-10 sm:py-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
            style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-3 text-3xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            {intro}
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 rounded-[22px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm leading-7 text-slate-700">
            <p style={{ fontFamily: "var(--font-source-sans)" }}>
              VORTEX &apos;26 is presented as a college event registration and ticketing website for indoor games.
              These pages are published so participants and payment reviewers can clearly understand the organizer,
              booking flow, and support process.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2
                  className="text-2xl font-semibold text-slate-900"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} style={{ fontFamily: "var(--font-source-sans)" }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm font-semibold">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-700"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            >
              Back Home
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
            >
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

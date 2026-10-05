import { useState, useEffect, useRef } from "react";

type Page = "home" | "apply" | "dashboard" | "terminal";
type Theme = "dark" | "light";

// ─── Theme hook ───────────────────────────────────────────────────────────────
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("wc-theme");
    return stored === "light" ? "light" : "dark";
  });
  useEffect(() => {
    if (theme === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
    localStorage.setItem("wc-theme", theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

// ─── Design tokens as JS (mirrors CSS vars, reactive to theme) ────────────────
const T = {
  bg: "var(--background)",
  fg: "var(--foreground)",
  card: "var(--card)",
  cardFg: "var(--card-foreground)",
  primary: "var(--primary)",
  primaryFg: "var(--primary-foreground)",
  secondary: "var(--secondary)",
  muted: "var(--muted)",
  mutedFg: "var(--muted-foreground)",
  border: "var(--border)",
  accent: "var(--accent)",
};

// ─── Shared primitives ────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: T.mutedFg }}>
      {children}
    </p>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-4" style={{ color: T.mutedFg }}>
      {children}
    </p>
  );
}

function PrimaryBtn({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-mono text-xs tracking-widest uppercase px-6 py-3 font-semibold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: T.primary, color: T.primaryFg }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-xs tracking-widest uppercase px-6 py-3 border transition-colors"
      style={{ borderColor: T.border, color: T.mutedFg }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = T.primary;
        el.style.color = T.primary;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = T.border;
        el.style.color = T.mutedFg;
      }}
    >
      {children}
    </button>
  );
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase border px-2.5 py-1.5 transition-colors"
      style={{ borderColor: T.border, color: T.mutedFg }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.color = T.primary;
        el.style.borderColor = T.primary;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.color = T.mutedFg;
        el.style.borderColor = T.border;
      }}
    >
      {theme === "dark" ? (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Light
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          Dark
        </>
      )}
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, theme, toggleTheme }: {
  page: Page; setPage: (p: Page) => void; theme: Theme; toggleTheme: () => void;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
      style={{ borderColor: T.border, background: "color-mix(in srgb, var(--background) 88%, transparent)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <button
          onClick={() => setPage("home")}
          className="font-mono text-sm font-semibold tracking-widest transition-colors"
          style={{ color: T.fg }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = T.primary; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = T.fg; }}
        >
          W&amp;C
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider">
          <span className="inline-block w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: T.primary }} />
          <span style={{ color: T.primary }}>
            {tick % 2 === 0 ? "COHORT 01 INTAKE: OPEN" : "GPU ALLOCATION: ACTIVE"}
          </span>
        </div>

        <nav className="flex items-center gap-5">
          {(["apply", "dashboard", "terminal"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="font-mono text-xs tracking-widest uppercase transition-colors"
              style={{ color: page === p ? T.primary : T.mutedFg }}
              onMouseEnter={(e) => { if (page !== p) (e.currentTarget as HTMLButtonElement).style.color = T.fg; }}
              onMouseLeave={(e) => { if (page !== p) (e.currentTarget as HTMLButtonElement).style.color = T.mutedFg; }}
            >
              {p === "terminal" ? "LP Portal" : p}
            </button>
          ))}
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </nav>
      </div>
    </header>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function Landing({ setPage }: { setPage: (p: Page) => void }) {
  const [typedIdx, setTypedIdx] = useState(0);
  const headline = "WEIGHTS & CAPITAL";
  useEffect(() => {
    if (typedIdx < headline.length) {
      const t = setTimeout(() => setTypedIdx((i) => i + 1), 60);
      return () => clearTimeout(t);
    }
  }, [typedIdx]);

  const pillars = [
    {
      tag: "01 // COMPUTE-FIRST",
      title: "Dedicated Infrastructure",
      body: "Reserved NVIDIA H100 & B200 clusters. $150K in compute credits across hyperscalers and inference providers — no waitlists, no rate limits.",
      metric: "$150K COMPUTE",
    },
    {
      tag: "02 // ARCHITECTURE AUDITS",
      title: "Deep Technical Access",
      body: "Bi-weekly reviews with AI researchers and ML engineers. Fine-tuning audits, token-cost reduction, and inference stack optimization at model depth.",
      metric: "2×/WEEK",
    },
    {
      tag: "03 // ENTERPRISE GTM",
      title: "Pilot Distribution",
      body: "Warm intros to Fortune 500 CTOs and CISOs actively deploying production AI. Design partners, not just advisors.",
      metric: "F500 NETWORK",
    },
  ];

  const stack = [
    { label: "NVIDIA H100 / B200", sub: "Dedicated cluster reservations" },
    { label: "Anthropic Tier 4", sub: "Claude API — highest access tier" },
    { label: "Together AI", sub: "Open-source inference credits" },
    { label: "Pinecone Enterprise", sub: "Vector DB at scale" },
    { label: "Modal Labs", sub: "Serverless GPU compute" },
    { label: "Weights & Biases", sub: "MLOps & experiment tracking" },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: T.bg }}>
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
          <div>
            <Label>Deep-Tech Accelerator // Cohort 01</Label>
            <h1
              className="font-sans text-[clamp(2.5rem,7vw,6rem)] font-black leading-[0.9] tracking-[-0.03em] mt-6 mb-2"
              style={{ color: T.fg }}
            >
              {headline.slice(0, typedIdx)}
              <span className="cursor-blink" style={{ color: T.primary }}>_</span>
            </h1>
            <p className="mt-8 text-lg font-light max-w-lg leading-relaxed" style={{ color: T.mutedFg }}>
              The accelerator built for founders who ship models, not decks.{" "}
              <span style={{ color: T.fg }}>$200K cash</span> +{" "}
              <span style={{ color: T.fg }}>$150K compute</span> for 5–7% equity.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <PrimaryBtn onClick={() => setPage("apply")}>Apply Now →</PrimaryBtn>
              <span className="font-mono text-[10px] tracking-wider" style={{ color: T.mutedFg }}>
                DEADLINE: OCT 31, 2026
              </span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="border p-6 space-y-5" style={{ borderColor: T.border, background: T.card }}>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase border-b pb-3" style={{ color: T.mutedFg, borderColor: T.border }}>
              Program Metrics
            </p>
            {[
              { k: "CASH INVESTMENT", v: "$200,000" },
              { k: "EQUITY STAKE", v: "5 – 7%" },
              { k: "COMPUTE CREDITS", v: "$150,000" },
              { k: "COHORT SIZE", v: "8 companies" },
              { k: "PROGRAM LENGTH", v: "16 weeks" },
              { k: "ENTERPRISE INTROS", v: "10+ guaranteed" },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between items-baseline">
                <span className="font-mono text-[9px] tracking-wider uppercase" style={{ color: T.mutedFg }}>{k}</span>
                <span className="font-mono text-sm font-semibold" style={{ color: T.primary }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thesis */}
      <section className="border-t px-6 py-20 max-w-7xl mx-auto" style={{ borderColor: T.border }}>
        <SectionTag>Investment Thesis</SectionTag>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: T.border }}>
          {pillars.map((p) => (
            <div
              key={p.tag}
              className="p-8 group transition-colors cursor-default"
              style={{ background: T.bg }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.card; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.bg; }}
            >
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-6" style={{ color: T.primary }}>{p.tag}</p>
              <h3 className="font-sans text-xl font-bold mb-4 leading-tight" style={{ color: T.fg }}>{p.title}</h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: T.mutedFg }}>{p.body}</p>
              <div className="border-t pt-4" style={{ borderColor: T.border }}>
                <span className="font-mono text-xs font-semibold tracking-widest" style={{ color: T.primary }}>{p.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compute Stack */}
      <section className="border-t px-6 py-20 max-w-7xl mx-auto" style={{ borderColor: T.border }}>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-16">
          <div>
            <SectionTag>Compute Stack</SectionTag>
            <p className="text-sm leading-relaxed" style={{ color: T.mutedFg }}>
              Infrastructure partners accessible from day one of the cohort.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: T.border }}>
            {stack.map((s) => (
              <div
                key={s.label}
                className="p-5 transition-colors cursor-default group"
                style={{ background: T.bg }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.card; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.bg; }}
              >
                <p className="font-mono text-xs font-semibold mb-1 transition-colors" style={{ color: T.fg }}>{s.label}</p>
                <p className="font-mono text-[9px] tracking-wide" style={{ color: T.mutedFg }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Moat Philosophy */}
      <section className="border-t px-6 py-20 max-w-7xl mx-auto" style={{ borderColor: T.border }}>
        <div className="max-w-2xl">
          <SectionTag>Our Thesis</SectionTag>
          <blockquote
            className="font-sans text-2xl font-light leading-relaxed border-l-2 pl-8"
            style={{ color: T.fg, borderColor: T.primary }}
          >
            "The next defensible AI companies won't be defined by the model they use — they'll be defined by the{" "}
            <em className="not-italic font-medium" style={{ color: T.primary }}>data feedback loops</em> they build."
          </blockquote>
          <p className="mt-6 pl-8 text-sm leading-relaxed" style={{ color: T.mutedFg }}>
            We invest in teams building proprietary data moats and algorithmic edges that survive foundation model updates.
            If GPT-5 ships tomorrow and your product still wins, you're our kind of company.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-6 py-20 max-w-7xl mx-auto" style={{ borderColor: T.border }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-sans text-4xl font-black leading-tight mb-4" style={{ color: T.fg }}>
              Ready to ship?
            </h2>
            <p className="text-base leading-relaxed" style={{ color: T.mutedFg }}>
              Applications take 12 minutes. Link your repo, answer two technical questions,
              and our agent does the rest.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <PrimaryBtn onClick={() => setPage("apply")}>Start Application →</PrimaryBtn>
            <GhostBtn onClick={() => setPage("terminal")}>LP / Investor Access</GhostBtn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ borderColor: T.border }}>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: T.mutedFg }}>
          © 2026 Weights Capital Management LLC (Lornu AI Swarm)
        </span>
        <div className="flex gap-6">
          <button
            onClick={() => setPage("apply")}
            className="font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{ color: T.mutedFg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = T.primary; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = T.mutedFg; }}
          >
            /apply
          </button>
          <a
            href="/privacy"
            className="font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{ color: T.mutedFg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.primary; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.mutedFg; }}
          >
            /privacy
          </a>
          <a
            href="/terms"
            className="font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{ color: T.mutedFg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.primary; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.mutedFg; }}
          >
            /terms
          </a>
          <a
            href="https://x.com/weightscapital"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[9px] tracking-wider uppercase transition-colors"
            style={{ color: T.mutedFg }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.primary; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T.mutedFg; }}
          >
            X: @weightscapital
          </a>
        </div>
      </footer>
    </div>
  );
}

// ─── Apply ────────────────────────────────────────────────────────────────────
function Apply() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [repoUrl, setRepoUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [parsed, setParsed] = useState<{ team: string; arch: string; deps: string; velocity: string } | null>(null);
  const [moat, setMoat] = useState("");
  const [compute, setCompute] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [appRef, setAppRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const runScan = () => {
    if (!repoUrl.trim()) return;
    setScanning(true);
    setScanLog([]);
    const logs = [
      `> Cloning repository: ${repoUrl}`,
      "> Parsing pyproject.toml / requirements.txt...",
      "> Detected: Python 3.11, PyTorch 2.3, Transformers 4.41",
      "> Model architecture: Custom encoder-decoder (7B params)",
      "> Scanning git log for commit velocity...",
      "> 847 commits / 90 days — 9.4 commits/day",
      "> Team contributors: 4 unique authors",
      "> Checking Hugging Face model cards...",
      "> Found: 2 public model checkpoints",
      "> Estimating inference footprint...",
      "> Auto-fill complete. Review below.",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setScanLog((prev) => [...prev, logs[i]]);
        i++;
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      } else {
        clearInterval(interval);
        setScanning(false);
        setParsed({
          team: "4 engineers",
          arch: "Custom encoder-decoder, 7B params",
          deps: "PyTorch 2.3 · Transformers 4.41 · vLLM 0.4",
          velocity: "9.4 commits/day (847 over 90d)",
        });
        setStep(2);
      }
    }, 280);
  };

  const inputStyle = {
    background: T.bg,
    borderColor: T.border,
    color: T.fg,
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitErr("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ repoUrl, moat, compute, parsed }),
      });
      const data = (await res.json()) as { ok?: boolean; ref?: string; error?: string };
      if (!res.ok || !data.ok || !data.ref) throw new Error(data.error || "submission_failed");
      setAppRef(data.ref);
      setSubmitted(true);
    } catch (e) {
      setSubmitErr((e as Error).message || "network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center" style={{ background: T.bg }}>
        <div className="max-w-lg w-full border p-10 text-center" style={{ borderColor: T.border, background: T.card }}>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: T.primary }}>Application Received</p>
          <h2 className="font-sans text-3xl font-black mb-4" style={{ color: T.fg }}>We've got it.</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: T.mutedFg }}>
            Our technical team will review your repository and responses within 72 hours.
            Expect a calendar invite for a 30-minute architecture deep-dive if you pass stage one.
          </p>
          <div className="border-t pt-6" style={{ borderColor: T.border }}>
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: T.mutedFg }}>
              REF: {appRef}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 max-w-4xl mx-auto" style={{ background: T.bg }}>
      <div className="mb-10">
        <Label>Cohort 01 Application // Agentic Intake</Label>
        <h1 className="font-sans text-4xl font-black mt-3" style={{ color: T.fg }}>Apply</h1>
        <div className="flex gap-8 mt-6">
          {[
            { n: 1, label: "Repo Analysis" },
            { n: 2, label: "Auto-fill Review" },
            { n: 3, label: "Strategy Prompts" },
          ].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <span
                className="font-mono text-xs w-6 h-6 flex items-center justify-center border"
                style={{
                  borderColor: step >= n ? T.primary : T.border,
                  color: step >= n ? T.primary : T.mutedFg,
                }}
              >
                {n}
              </span>
              <span
                className="font-mono text-[9px] tracking-wider uppercase"
                style={{ color: step >= n ? T.fg : T.mutedFg }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="border p-8 animate-fade-in-up" style={{ borderColor: T.border, background: T.card }}>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-6" style={{ color: T.primary }}>
            Step 01 // Code &amp; Paper Submission
          </p>
          <label className="font-mono text-xs tracking-wider uppercase block mb-3" style={{ color: T.mutedFg }}>
            Repository / Hugging Face / arXiv URL
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/your-org/your-model"
            className="w-full border px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
            style={inputStyle}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = T.primary; }}
            onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = T.border; }}
            onKeyDown={(e) => e.key === "Enter" && runScan()}
          />
          <p className="font-mono text-[9px] mt-3" style={{ color: T.mutedFg }}>
            Also accepts: huggingface.co/org · arxiv.org/abs/...
          </p>

          {scanLog.length > 0 && (
            <div
              ref={logRef}
              className="mt-6 border p-4 font-mono text-[11px] h-48 overflow-y-auto space-y-1"
              style={{ background: T.bg, borderColor: T.border, color: T.primary }}
            >
              {scanLog.map((line, i) => <div key={i}>{line}</div>)}
              {scanning && <div className="cursor-blink">▋</div>}
            </div>
          )}

          <div className="mt-6">
            <PrimaryBtn onClick={runScan} disabled={scanning || !repoUrl.trim()}>
              {scanning ? "Scanning..." : "Analyze Repository →"}
            </PrimaryBtn>
          </div>
        </div>
      )}

      {step === 2 && parsed && (
        <div className="border p-8 animate-fade-in-up" style={{ borderColor: T.border, background: T.card }}>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: T.primary }}>
            Step 02 // Auto-populated Fields
          </p>
          <p className="font-mono text-[9px] mb-8" style={{ color: T.mutedFg }}>Extracted from: {repoUrl}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              { label: "Team Size", value: parsed.team },
              { label: "Model Architecture", value: parsed.arch },
              { label: "Core Dependencies", value: parsed.deps },
              { label: "Commit Velocity", value: parsed.velocity },
            ].map(({ label, value }) => (
              <div key={label} className="border p-4" style={{ background: T.bg, borderColor: T.border }}>
                <p className="font-mono text-[9px] tracking-wider uppercase mb-2" style={{ color: T.mutedFg }}>{label}</p>
                <p className="font-mono text-sm" style={{ color: T.fg }}>{value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <PrimaryBtn onClick={() => setStep(3)}>Confirm &amp; Continue →</PrimaryBtn>
            <GhostBtn onClick={() => { setStep(1); setScanLog([]); setParsed(null); }}>Re-scan</GhostBtn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="border p-8 animate-fade-in-up" style={{ borderColor: T.border, background: T.card }}>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-6" style={{ color: T.primary }}>
            Step 03 // Core Strategy Prompts
          </p>
          <div className="space-y-8">
            {[
              {
                label: "Technical Moat",
                hint: "What proprietary data or algorithmic edge prevents a foundation model update from eating your business?",
                value: moat,
                setter: setMoat,
                placeholder: "Our proprietary data flywheel collects...",
                rows: 5,
              },
              {
                label: "Compute Footprint",
                hint: "Estimated monthly inference/training spend for the next 12 months?",
                value: compute,
                setter: setCompute,
                placeholder: "Month 1-3: $8K/mo (dev), Month 4-12: $45K/mo at 10K DAU...",
                rows: 4,
              },
            ].map(({ label, hint, value, setter, placeholder, rows }) => (
              <div key={label}>
                <label className="font-mono text-xs tracking-wider block mb-1" style={{ color: T.fg }}>{label}</label>
                <p className="font-mono text-[9px] mb-3" style={{ color: T.mutedFg }}>{hint}</p>
                <textarea
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  rows={rows}
                  placeholder={placeholder}
                  className="w-full border px-4 py-3 font-mono text-sm focus:outline-none transition-colors resize-none"
                  style={{ ...inputStyle, placeholderColor: T.mutedFg } as React.CSSProperties}
                  onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = T.primary; }}
                  onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = T.border; }}
                />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <PrimaryBtn onClick={submit} disabled={submitting || !moat.trim() || !compute.trim()}>
              {submitting ? "Submitting..." : "Submit Application →"}
            </PrimaryBtn>
            {submitErr && (
              <p className="font-mono text-[10px] mt-3" style={{ color: "#F87171" }}>
                Submission failed: {submitErr}. Please retry.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "schedule">("overview");

  return (
    <div className="min-h-screen pt-20" style={{ background: T.bg }}>
      <div className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: T.border, background: T.card }}>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: T.mutedFg }}>
            WEIGHTS &amp; CAPITAL // COHORT 01
          </span>
          <span className="font-mono text-[9px]" style={{ color: T.border }}>|</span>
          <span className="font-mono text-[9px] tracking-wider" style={{ color: T.mutedFg }}>founder@nexusai.io</span>
        </div>
        <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: T.primary }}>● Active</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 border-b mb-8" style={{ borderColor: T.border }}>
          {(["overview", "resources", "schedule"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="font-mono text-xs tracking-widest uppercase pb-3 border-b-2 transition-colors"
              style={{
                borderBottomColor: activeTab === t ? T.primary : "transparent",
                color: activeTab === t ? T.primary : T.mutedFg,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: T.border }}>
              {[
                { label: "GPU Credit Balance", value: "$124,500", sub: "of $150,000", bar: 83, action: "Claim Credits" },
                { label: "Enterprise Intro Requests", value: "4 Pending", sub: "2 accepted this week", bar: null, action: "View Requests" },
                { label: "Next Architecture Review", value: "Thu 14:00 UTC", sub: "Dr. A. Vance · ML Infra", bar: null, action: "Add to Calendar" },
              ].map((kpi) => (
                <div key={kpi.label} className="p-6" style={{ background: T.bg }}>
                  <p className="font-mono text-[9px] tracking-wider uppercase mb-3" style={{ color: T.mutedFg }}>{kpi.label}</p>
                  <p className="font-sans text-2xl font-bold mb-1" style={{ color: T.fg }}>{kpi.value}</p>
                  <p className="font-mono text-[9px] mb-4" style={{ color: T.mutedFg }}>{kpi.sub}</p>
                  {kpi.bar !== null && (
                    <div className="h-1 mb-4" style={{ background: T.secondary }}>
                      <div className="h-full transition-all" style={{ width: `${kpi.bar}%`, background: T.primary }} />
                    </div>
                  )}
                  <button
                    className="font-mono text-[9px] tracking-wider uppercase hover:underline"
                    style={{ color: T.primary }}
                  >
                    {kpi.action} →
                  </button>
                </div>
              ))}
            </div>

            <div className="border" style={{ borderColor: T.border, background: T.card }}>
              <div className="border-b px-6 py-3" style={{ borderColor: T.border }}>
                <SectionTag>Activity Log</SectionTag>
              </div>
              <div className="divide-y" style={{ borderColor: T.border }}>
                {[
                  { ts: "2026-09-06 11:42", event: "Architecture review notes shared", type: "review" },
                  { ts: "2026-09-05 09:18", event: "Enterprise intro: VP Eng @ Palantir accepted", type: "intro" },
                  { ts: "2026-09-04 16:05", event: "$25,000 compute credit transferred — Together AI", type: "credit" },
                  { ts: "2026-09-03 14:30", event: "Token cost audit completed — 34% reduction achieved", type: "audit" },
                  { ts: "2026-09-01 10:00", event: "Cohort 01 kickoff — onboarding complete", type: "system" },
                ].map((row) => (
                  <div
                    key={row.ts}
                    className="px-6 py-4 flex items-center justify-between border-b last:border-0 transition-colors cursor-default"
                    style={{ borderColor: T.border }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.muted; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="font-mono text-[9px] w-14 text-center py-0.5 uppercase tracking-wider"
                        style={{
                          color: row.type === "credit" ? T.primary : row.type === "intro" ? "#60A5FA" : T.mutedFg,
                          background: row.type === "credit"
                            ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                            : row.type === "intro"
                            ? "rgba(96,165,250,0.1)"
                            : T.secondary,
                        }}
                      >
                        {row.type}
                      </span>
                      <span className="font-mono text-xs" style={{ color: T.fg }}>{row.event}</span>
                    </div>
                    <span className="font-mono text-[9px] whitespace-nowrap" style={{ color: T.mutedFg }}>{row.ts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="animate-fade-in-up">
            <SectionTag>Infrastructure &amp; Perks</SectionTag>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: T.border }}>
              {[
                { name: "NVIDIA H100 Cluster", provider: "Coreweave", balance: "$68,000", total: "$80,000", pct: 85 },
                { name: "Anthropic API", provider: "Tier 4 — Direct", balance: "$22,500", total: "$25,000", pct: 90 },
                { name: "Together AI", provider: "Inference Credits", balance: "$14,000", total: "$20,000", pct: 70 },
                { name: "Pinecone Enterprise", provider: "Vector DB", balance: "Unlimited", total: "12-month license", pct: null },
                { name: "Modal Labs", provider: "Serverless GPU", balance: "$8,000", total: "$10,000", pct: 80 },
                { name: "Weights & Biases", provider: "MLOps", balance: "Teams Plan", total: "16 weeks", pct: null },
              ].map((r) => (
                <div key={r.name} className="p-6" style={{ background: T.bg }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-xs font-semibold mb-1" style={{ color: T.fg }}>{r.name}</p>
                      <p className="font-mono text-[9px]" style={{ color: T.mutedFg }}>{r.provider}</p>
                    </div>
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 uppercase"
                      style={{ color: T.primary, background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
                    >
                      Active
                    </span>
                  </div>
                  <p className="font-mono text-lg font-bold mb-1" style={{ color: T.primary }}>{r.balance}</p>
                  <p className="font-mono text-[9px] mb-3" style={{ color: T.mutedFg }}>{r.total}</p>
                  {r.pct !== null && (
                    <div className="h-0.5" style={{ background: T.secondary }}>
                      <div className="h-full" style={{ width: `${r.pct}%`, background: T.primary }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="animate-fade-in-up">
            <SectionTag>Office Hours Scheduler</SectionTag>
            <OfficeHours />
          </div>
        )}
      </div>
    </div>
  );
}

function OfficeHours() {
  const [selected, setSelected] = useState<string>("ml-ops");
  const [chosenSlot, setChosenSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const mentors = [
    { id: "gtm", label: "GTM / Enterprise Sales", expert: "Sarah Chen", title: "Former VP Sales, Snowflake" },
    { id: "ml-ops", label: "ML Ops / Infra", expert: "Dr. A. Vance", title: "Research Lead, DeepMind Alumni" },
    { id: "legal", label: "Legal / IP", expert: "James Park", title: "Partner, Cooley LLP" },
  ];
  const slots = [
    "Mon Sep 09 · 10:00 UTC", "Mon Sep 09 · 14:00 UTC",
    "Tue Sep 10 · 09:00 UTC", "Thu Sep 12 · 14:00 UTC",
    "Thu Sep 12 · 16:00 UTC", "Fri Sep 13 · 11:00 UTC",
  ];

  if (booked) {
    return (
      <div
        className="border p-8 text-center max-w-lg"
        style={{ borderColor: T.primary, background: "color-mix(in srgb, var(--primary) 6%, var(--card))" }}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: T.primary }}>Confirmed</p>
        <p className="font-sans text-xl font-bold mb-2" style={{ color: T.fg }}>Session Booked</p>
        <p className="font-mono text-xs" style={{ color: T.mutedFg }}>
          {chosenSlot} · {mentors.find((m) => m.id === selected)?.expert}
        </p>
        <p className="font-mono text-[9px] mt-4" style={{ color: T.mutedFg }}>Calendar invite sent to founder@nexusai.io</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-px" style={{ background: T.border }}>
      <div className="p-6 space-y-3" style={{ background: T.bg }}>
        <p className="font-mono text-[9px] tracking-wider uppercase mb-4" style={{ color: T.mutedFg }}>Select Mentor Track</p>
        {mentors.map((m) => (
          <button
            key={m.id}
            onClick={() => { setSelected(m.id); setChosenSlot(null); }}
            className="w-full text-left border p-4 transition-colors"
            style={{
              borderColor: selected === m.id ? T.primary : T.border,
              background: selected === m.id ? "color-mix(in srgb, var(--primary) 6%, transparent)" : "transparent",
            }}
          >
            <p className="font-mono text-xs font-semibold mb-1" style={{ color: selected === m.id ? T.primary : T.fg }}>
              {m.label}
            </p>
            <p className="font-mono text-[9px]" style={{ color: T.mutedFg }}>{m.expert} · {m.title}</p>
          </button>
        ))}
      </div>
      <div className="p-6" style={{ background: T.bg }}>
        <p className="font-mono text-[9px] tracking-wider uppercase mb-4" style={{ color: T.mutedFg }}>Available Slots</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {slots.map((s) => (
            <button
              key={s}
              onClick={() => setChosenSlot(s)}
              className="border p-3 text-left transition-colors"
              style={{
                borderColor: chosenSlot === s ? T.primary : T.border,
                background: chosenSlot === s ? "color-mix(in srgb, var(--primary) 6%, transparent)" : "transparent",
              }}
            >
              <p className="font-mono text-xs" style={{ color: chosenSlot === s ? T.primary : T.fg }}>{s}</p>
            </button>
          ))}
        </div>
        <PrimaryBtn onClick={() => chosenSlot && setBooked(true)} disabled={!chosenSlot}>
          Book Session →
        </PrimaryBtn>
      </div>
    </div>
  );
}

// ─── Terminal / LP Portal ─────────────────────────────────────────────────────
type AppRecord = {
  ref: string;
  repoUrl: string;
  email?: string;
  moat?: string;
  compute?: string;
  status?: string;
  createdAt?: string;
  parsed?: { team?: string; arch?: string; deps?: string; velocity?: string } | null;
};

function Terminal() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<AppRecord[]>([]);

  const login = async () => {
    setLoading(true);
    setErr(false);
    try {
      const res = await fetch("/api/applications", { headers: { "x-lp-token": pass } });
      if (!res.ok) {
        setErr(true);
        return;
      }
      const data = (await res.json()) as { applications?: AppRecord[] };
      setApps(data.applications ?? []);
      setAuthed(true);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center" style={{ background: T.bg }}>
        <div className="max-w-sm w-full border p-8" style={{ borderColor: T.border, background: T.card }}>
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-6" style={{ color: T.primary }}>
            LP &amp; Investor Portal
          </p>
          <p className="font-mono text-xs mb-6" style={{ color: T.mutedFg }}>
            Restricted access. Enter your partner credentials.
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(false); }}
            placeholder="LP access token"
            className="w-full border px-4 py-3 font-mono text-sm focus:outline-none transition-colors mb-4"
            style={{ background: T.bg, borderColor: T.border, color: T.fg }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = T.primary; }}
            onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = T.border; }}
            onKeyDown={(e) => { if (e.key === "Enter") login(); }}
          />
          {err && <p className="font-mono text-[9px] mb-4" style={{ color: "#F87171" }}>Invalid access token.</p>}
          <button
            onClick={login}
            disabled={loading || !pass.trim()}
            className="w-full font-mono text-xs tracking-widest uppercase py-3 font-semibold transition-colors disabled:opacity-50"
            style={{ background: T.primary, color: T.primaryFg }}
          >
            {loading ? "Verifying…" : "Access Terminal →"}
          </button>
          <p className="font-mono text-[9px] mt-4 text-center" style={{ color: T.mutedFg }}>Server-verified access · issued to partners</p>
        </div>
      </div>
    );
  }

  const portfolio = [
    { co: "NexusAI", stage: "Seed", arr: "$180K", growth: "+34%", focus: "Enterprise RAG", status: "On Track" },
    { co: "Orbital ML", stage: "Pre-seed", arr: "$42K", growth: "+71%", focus: "Edge inference", status: "On Track" },
    { co: "Synapse Labs", stage: "Seed", arr: "$320K", growth: "+18%", focus: "Medical imaging AI", status: "On Track" },
    { co: "DataForge", stage: "Pre-seed", arr: "$95K", growth: "+52%", focus: "Synthetic data", status: "Watch" },
    { co: "ContextOS", stage: "Seed", arr: "$210K", growth: "+29%", focus: "Long-context infra", status: "On Track" },
  ];

  return (
    <div className="min-h-screen pt-20" style={{ background: T.bg }}>
      <div className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: T.border, background: T.card }}>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: T.mutedFg }}>
          W&amp;C Terminal // Investor View
        </span>
        <span className="font-mono text-[9px]" style={{ color: T.primary }}>Q3 2026</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <SectionTag>Fund Overview</SectionTag>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: T.border }}>
            {[
              { k: "Fund Size", v: "$4.2M" },
              { k: "Deployed", v: "$1.6M" },
              { k: "Portfolio Cos.", v: "5" },
              { k: "Avg. MOIC", v: "2.4×" },
            ].map(({ k, v }) => (
              <div key={k} className="p-6" style={{ background: T.bg }}>
                <p className="font-mono text-[9px] tracking-wider uppercase mb-3" style={{ color: T.mutedFg }}>{k}</p>
                <p className="font-sans text-3xl font-black" style={{ color: T.fg }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTag>Portfolio — Cohort 01</SectionTag>
          <div className="border" style={{ borderColor: T.border }}>
            <div className="grid grid-cols-6 border-b px-4 py-2" style={{ borderColor: T.border, background: T.card }}>
              {["Company", "Stage", "ARR", "MoM Growth", "Focus", "Status"].map((h) => (
                <p key={h} className="font-mono text-[9px] tracking-wider uppercase" style={{ color: T.mutedFg }}>{h}</p>
              ))}
            </div>
            {portfolio.map((row) => (
              <div
                key={row.co}
                className="grid grid-cols-6 px-4 py-4 border-b last:border-0 transition-colors cursor-default"
                style={{ borderColor: T.border }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = T.muted; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <p className="font-mono text-xs font-semibold" style={{ color: T.fg }}>{row.co}</p>
                <p className="font-mono text-[10px]" style={{ color: T.mutedFg }}>{row.stage}</p>
                <p className="font-mono text-xs" style={{ color: T.fg }}>{row.arr}</p>
                <p className="font-mono text-xs" style={{ color: T.primary }}>{row.growth}</p>
                <p className="font-mono text-[10px]" style={{ color: T.mutedFg }}>{row.focus}</p>
                <span
                  className="font-mono text-[9px] self-center uppercase tracking-wider"
                  style={{ color: row.status === "On Track" ? T.primary : "#FBBF24" }}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTag>Live Applications — Cohort 01 Intake ({apps.length})</SectionTag>
          <div className="border" style={{ borderColor: T.border }}>
            <div className="grid grid-cols-4 border-b px-4 py-2" style={{ borderColor: T.border, background: T.card }}>
              {["Ref", "Repository", "Status", "Received"].map((h) => (
                <p key={h} className="font-mono text-[9px] tracking-wider uppercase" style={{ color: T.mutedFg }}>{h}</p>
              ))}
            </div>
            {apps.length === 0 && (
              <div className="px-4 py-6 font-mono text-[10px]" style={{ color: T.mutedFg }}>
                No applications yet — submissions appear here in real time.
              </div>
            )}
            {apps.map((a) => (
              <div key={a.ref} className="grid grid-cols-4 px-4 py-4 border-b last:border-0" style={{ borderColor: T.border }}>
                <p className="font-mono text-xs font-semibold" style={{ color: T.fg }}>{a.ref}</p>
                <p className="font-mono text-[10px] truncate" style={{ color: T.mutedFg }}>{a.repoUrl}</p>
                <span className="font-mono text-[9px] self-center uppercase tracking-wider" style={{ color: T.primary }}>{a.status ?? "received"}</span>
                <p className="font-mono text-[10px]" style={{ color: T.mutedFg }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTag>Data Room</SectionTag>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Q3 2026 Quarterly Report", date: "Sep 01, 2026", tag: "PDF" },
              { label: "Cohort 01 Portfolio Update", date: "Aug 15, 2026", tag: "PDF" },
              { label: "Fund Financial Model", date: "Jul 30, 2026", tag: "XLSX" },
              { label: "LP Agreement Template", date: "Jun 01, 2026", tag: "PDF" },
              { label: "Investment Thesis Deck", date: "May 20, 2026", tag: "PPTX" },
              { label: "Technical Audit Framework", date: "May 01, 2026", tag: "PDF" },
            ].map((doc) => (
              <div
                key={doc.label}
                className="border p-4 transition-colors cursor-pointer"
                style={{ borderColor: T.border }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = T.mutedFg;
                  el.style.background = T.muted;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = T.border;
                  el.style.background = "transparent";
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-[9px] border px-1.5 py-0.5 uppercase" style={{ borderColor: T.border, color: T.mutedFg }}>
                    {doc.tag}
                  </span>
                </div>
                <p className="font-mono text-xs font-semibold mb-1" style={{ color: T.fg }}>{doc.label}</p>
                <p className="font-mono text-[9px]" style={{ color: T.mutedFg }}>{doc.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [theme, toggleTheme] = useTheme();

  const handleSetPage = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-full" style={{ background: T.bg, color: T.fg }}>
      <Nav page={page} setPage={handleSetPage} theme={theme} toggleTheme={toggleTheme} />
      {page === "home" && <Landing setPage={handleSetPage} />}
      {page === "apply" && <Apply />}
      {page === "dashboard" && <Dashboard />}
      {page === "terminal" && <Terminal />}
    </div>
  );
}

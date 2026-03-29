"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navigation, Footer, CTASection } from "@/components/MarketingLayout";
import { useLanguage } from '@/components/LanguageProvider';
import {
  Zap,
  ArrowRight,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Shield,
  CheckCircle2,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Bot,
  FileText,
  Receipt,
  Languages,
  BadgeCheck,
  Wrench,
  Flame,
  Plug,
  TreePine,
  Home,
  HelpCircle,
  Globe,
  MessageSquare,
  Plus,
  Minus,
  Send,
  Check,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById(`counter-${end}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <span id={`counter-${end}-${suffix}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Scroll Reveal Hook ─────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .scroll-scale-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    elements.forEach((el) => observer.observe(el));

    // Safety fallback: after 2 seconds, force all elements to be visible
    const fallbackTimer = setTimeout(() => {
      elements.forEach((el) => el.classList.add('is-visible'));
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);
}

// ─── Scroll Progress Hook ──────────────────────────────────────
function useScrollProgress(elementId: string) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const raw = (windowHeight - rect.top) / (windowHeight + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId]);
  return progress;
}

// ─── Parallax Hook ─────────────────────────────────────────────
function useParallax(speed: number = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        setOffset(window.scrollY * speed);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);
  return offset;
}

// ─── Hero Section ─────────────────────────────────────────────
function Hero() {
  const { t } = useLanguage();
  const parallaxOffset = useParallax(0.15);
  const [tradeIndex, setTradeIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const trades = [
    { name: t('hero.plumbers'), icon: <Wrench className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
    { name: t('hero.hvac'), icon: <Flame className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
    { name: t('hero.electricians'), icon: <Plug className="w-5 h-5" />, color: 'from-amber-500 to-yellow-600' },
    { name: t('hero.landscapers'), icon: <TreePine className="w-5 h-5" />, color: 'from-emerald-500 to-green-600' },
    { name: t('hero.roofers'), icon: <Home className="w-5 h-5" />, color: 'from-slate-500 to-slate-700' },
    { name: t('hero.cleaners'), icon: <Sparkles className="w-5 h-5" />, color: 'from-purple-500 to-violet-600' },
  ];

  const personaCards = [
    { initials: 'MR', name: 'Mike Reynolds', trade: 'Plumbing', city: 'Toronto, ON', stat: '+47% booked jobs', icon: <Wrench className="w-4 h-4" />, gradient: 'from-blue-500 to-blue-600' },
    { initials: 'JL', name: 'Julie Lavoie', trade: 'HVAC', city: 'Montreal, QC', stat: '+$12K monthly revenue', icon: <Flame className="w-4 h-4" />, gradient: 'from-orange-500 to-red-500' },
    { initials: 'SK', name: 'Steve Kim', trade: 'Electrical', city: 'Vancouver, BC', stat: '2x faster estimates', icon: <Plug className="w-4 h-4" />, gradient: 'from-amber-500 to-yellow-600' },
    { initials: 'PP', name: 'Priya Patel', trade: 'Landscaping', city: 'Calgary, AB', stat: '340% ROI in 90 days', icon: <TreePine className="w-4 h-4" />, gradient: 'from-emerald-500 to-green-600' },
    { initials: 'TD', name: 'Tom Devries', trade: 'Roofing', city: 'Ottawa, ON', stat: '0 missed leads', icon: <Home className="w-4 h-4" />, gradient: 'from-slate-500 to-slate-700' },
    { initials: 'AR', name: 'Anna Ramos', trade: 'Cleaning', city: 'Winnipeg, MB', stat: '+89 five-star reviews', icon: <Sparkles className="w-4 h-4" />, gradient: 'from-purple-500 to-violet-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTradeIndex((prev) => (prev + 1) % trades.length);
        setIsTransitioning(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const smooth = 'cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Soft gradient orbs */}
      <div className="hidden sm:block absolute top-20 right-10 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }} />
      <div className="hidden sm:block absolute bottom-20 left-10 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-3xl" style={{ transform: `translateY(${-parallaxOffset * 0.15}px)` }} />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl" />

      {/* Floating persona cards — desktop only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        {personaCards.map((card, i) => {
          const positions = [
            { top: '12%', left: '4%', rotate: '-6deg' },
            { top: '8%', right: '5%', rotate: '4deg' },
            { top: '42%', left: '2%', rotate: '-3deg' },
            { top: '38%', right: '3%', rotate: '5deg' },
            { bottom: '18%', left: '6%', rotate: '-4deg' },
            { bottom: '15%', right: '4%', rotate: '3deg' },
          ];
          const pos = positions[i];
          const speed = [0.12, 0.08, 0.15, 0.1, 0.13, 0.09][i];
          return (
            <div
              key={card.initials}
              className="absolute bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-black/5 border border-gray-100/80 w-56"
              style={{
                ...pos,
                transform: `rotate(${pos.rotate}) translateY(${parallaxOffset * speed}px)`,
                transition: `transform 0.1s linear`,
                animation: `subtleFloat ${6 + i}s ease-in-out infinite`,
                animationDelay: `${i * -1.2}s`,
              }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                  {card.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{card.name}</p>
                  <p className="text-[11px] text-gray-500">{card.trade} · {card.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">{card.stat}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="hero-reveal hero-reveal-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">{t('hero.freeForFourteen')}</span>
          </div>

          {/* Headline with rotating trade name */}
          <h1 className="hero-reveal hero-reveal-delay-2 text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-2">
            {t('hero.growthEngine')}
            <br />
            for{' '}
            <span className="relative inline-block">
              <span
                className={`inline-flex items-center gap-3 bg-gradient-to-r ${trades[tradeIndex].color} bg-clip-text text-transparent`}
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
                  transition: `all 0.4s ${smooth}`,
                }}
              >
                {trades[tradeIndex].name}
              </span>
              {/* Underline accent */}
              <span className={`absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r ${trades[tradeIndex].color} opacity-30`}
                style={{ transition: `all 0.4s ${smooth}` }}
              />
            </span>
          </h1>

          {/* Trade icon row — shows all trades, highlights current */}
          <div className="hero-reveal hero-reveal-delay-2 flex items-center justify-center gap-2 mt-6 mb-8">
            {trades.map((trade, i) => (
              <div
                key={trade.name}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  i === tradeIndex
                    ? `bg-gradient-to-br ${trade.color} text-white shadow-lg scale-110`
                    : 'bg-gray-100 text-gray-400 scale-100'
                }`}
                style={{ transition: `all 0.5s ${smooth}` }}
              >
                {trade.icon}
              </div>
            ))}
          </div>

          {/* Subheadline */}
          <p className="hero-reveal hero-reveal-delay-3 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('hero.neverMissLead')}
          </p>

          {/* CTAs */}
          <div className="hero-reveal hero-reveal-delay-4 mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              {t('hero.startFreeNoCard')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              {t('landing.seeItInAction')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Proof - New Line */}
          <div className="hero-reveal hero-reveal-delay-4 mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{t('hero.socialProof')}</span>
          </div>

          {/* Canada-first trust bar */}
          <div className="hero-reveal hero-reveal-delay-4 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" /> {t('landing.builtInCanada')}
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>{t('landing.bilingualEnFr')}</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>{t('landing.hstGstQstAutoCalculated')}</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>{t('landing.homeStarsIntegrated')}</span>
          </div>

          {/* Social Proof */}
          <div className="hero-reveal hero-reveal-delay-5 mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {personaCards.slice(0, 5).map((card) => (
                  <div key={card.initials} className={`w-8 h-8 rounded-full bg-gradient-to-br ${card.gradient} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                    {card.initials}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">{t('landing.trustedAcrossCanada')}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1.5">{t('landing.rating')}</span>
            </div>
          </div>

          {/* Mobile persona cards — horizontal scroll */}
          <div className="lg:hidden mt-10 -mx-6 px-6 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {personaCards.slice(0, 4).map((card) => (
              <div key={card.initials} className="flex-shrink-0 bg-white rounded-xl p-3 shadow-md border border-gray-100 w-48">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {card.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{card.name}</p>
                    <p className="text-[10px] text-gray-500">{card.trade} · {card.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-md">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-700">{card.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Agitation ───────────────────────────────────────
function ProblemSection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="scroll-fade-up text-2xl sm:text-3xl font-bold text-white mb-8">{t('problem.soundFamiliar')}</h2>
        <div className="stagger-children scroll-fade-up grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
          {[
            t('problem.missedCall'),
            t('problem.estimateFollowUp'),
            t('problem.bestCustomer'),
            t('problem.invoicedLate'),
            t('problem.adsNotWorking'),
            t('problem.jobberDidntHelp'),
          ].map((pain, index) => (
            <div key={pain} className={`${index % 2 === 0 ? 'scroll-fade-left' : 'scroll-fade-right'} flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10`}>
              <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{pain}</p>
            </div>
          ))}
        </div>

        {/* Canada differentiator */}
        <div className="scroll-fade-up mt-12 max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            {t('problem.builtInUs')}
          </p>
        </div>

        <p className="mt-10 text-lg text-blue-300 font-medium">
          {t('problem.fixesAvailable')}
        </p>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────
function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{t('howItWorks.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('howItWorks.setupTime')}{" "}
            <span className="text-blue-600">
              {t('howItWorks.setupTimeHighlight')}
            </span>
          </h2>
        </div>

        <div className="stagger-children scroll-fade-up grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: t('howItWorks.addCustomers'), description: t('howItWorks.addCustomersDesc'), icon: <Users className="w-6 h-6" /> },
            { step: "02", title: t('howItWorks.turnOnAutopilot'), description: t('howItWorks.autopilotDesc'), icon: <Bot className="w-6 h-6" /> },
            { step: "03", title: t('howItWorks.seeEveryJob'), description: t('howItWorks.seeEveryJobDesc'), icon: <Layers className="w-6 h-6" /> },
            { step: "04", title: t('howItWorks.grow'), description: t('howItWorks.growDesc'), icon: <TrendingUp className="w-6 h-6" /> },
          ].map((s, i) => (
            <div key={s.step} className="scroll-fade-up relative">
              {i < 3 && <div className="scroll-fade-up hidden lg:block absolute top-12 left-full w-full h-px draw-path bg-gradient-to-r from-blue-200 to-transparent" />}
              <div className="text-5xl font-black text-blue-400/50 mb-4">{s.step}</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Showcase Component (Sticky Scroll Feature Showcase) ─────────────────────────────────────────
function ProductShowcase() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) within this section
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));

      // Map to 4 phases (0-3)
      const newPhase = Math.min(3, Math.floor(scrollProgress * 4));
      setPhase(newPhase);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phases = [
    {
      title: t('showcase.seeEveryJobGlance'),
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-4 bg-slate-50">
            <div className="text-xs font-semibold text-gray-600 mb-3">{t('showcase.pipelineLabel')}</div>
            <div className="flex gap-3">
              {[t('showcase.newLeads'), t('showcase.quoted'), t('showcase.booked'), t('showcase.inProgress')].map((stage, i) => (
                <div key={stage} className="flex-1 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-[10px] text-gray-500 font-semibold mb-2">{stage}</div>
                  <div className="space-y-2">
                    {[1, 2].map((j) => (
                      <div key={j} className={`rounded-md p-2 text-[10px] font-medium flex items-center gap-1.5 ${
                        i === 0 ? 'bg-blue-100 text-blue-700' :
                        i === 1 ? 'bg-purple-100 text-purple-700' :
                        i === 2 ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        Job {i}{j}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('showcase.tieredPricingCloses'),
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      content: (
        <div className="w-full max-w-lg space-y-4">
          {[
            { tier: t('showcase.good'), price: '$800', color: 'bg-slate-50 border-gray-200' },
            { tier: t('showcase.better'), price: '$1,200', color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 ring-2 ring-blue-500', isHighlight: true },
            { tier: t('showcase.best'), price: '$1,800', color: 'bg-slate-50 border-gray-200' }
          ].map((tier) => (
            <div key={tier.tier} className={`rounded-xl p-4 border-2 transition-all ${tier.color} ${tier.isHighlight ? 'scale-105 shadow-2xl shadow-blue-500/20' : 'shadow-lg'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{tier.tier}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{tier.price}</div>
                </div>
                {tier.isHighlight && <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">{t('showcase.recommended')}</div>}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('showcase.automationsRunning'),
      gradient: "from-emerald-600 via-emerald-500 to-cyan-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3" />
          <div className="p-6 space-y-4">
            {[t('showcase.speedToLead'), t('showcase.estimateFollowUp'), t('showcase.reviewRequests'), t('showcase.paymentReminders')].map((automation) => (
              <div key={automation} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-900">{automation}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                  <span className="text-xs font-semibold text-emerald-600">{t('showcase.running')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t('showcase.aiGrowthAdvisor'),
      gradient: "from-indigo-600 via-indigo-500 to-purple-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-6 space-y-4 bg-slate-50">
            <div className="flex gap-2">
              <div className="max-w-xs bg-gray-200 rounded-lg p-3 text-sm">
                What should I focus on this week?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="max-w-xs bg-indigo-500 text-white rounded-lg p-3 text-sm">
                Your top 3 opportunities: 2 estimates pending follow-up, 1 invoice overdue, and 4 new leads to call today.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="max-w-xs bg-gray-200 rounded-lg p-3 text-sm">
                Which customers pay the fastest?
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="product-showcase" ref={showcaseRef} className="relative bg-slate-50">
      {/* Desktop: sticky scroll version (400vh) */}
      <div className="hidden lg:block" style={{ height: '400vh', position: 'relative' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden transition-colors duration-500" style={{ backgroundColor: `hsl(${200 + phase * 10}, 70%, 40%)` }}>
          <div className={`absolute inset-0 opacity-60 transition-opacity duration-500 bg-gradient-to-br ${phases[phase].gradient}`} />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full h-full flex items-center">
            <div className="grid grid-cols-2 gap-12 items-center w-full">
              {/* Text content */}
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-500" style={{ opacity: 1 - Math.abs(0 - phase) * 0.2 }}>
                  {phases[phase].title}
                </h2>
                <p className="text-lg text-white/80 max-w-xl transition-all duration-500">
                  {phase === 0 && t('showcase.seeEveryJobGlanceDesc')}
                  {phase === 1 && t('showcase.tieredPricingDesc')}
                  {phase === 2 && t('showcase.automationsRunningDesc')}
                  {phase === 3 && t('showcase.aiGrowthAdvisorDesc')}
                </p>
              </div>

              {/* Product mockup */}
              <div className="flex items-center justify-center h-full transition-all duration-500">
                <div className="opacity-0 transition-opacity duration-500" style={{ opacity: phase >= 0 ? 1 : 0 }}>
                  {phases[phase].content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden scroll drivers */}
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
      </div>

      {/* Mobile: stacked vertical version */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {phases.map((phaseData, index) => (
            <div key={index} className="mb-16 scroll-fade-up">
              <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 overflow-hidden shadow-lg">
                <div className={`h-48 flex items-center justify-center bg-gradient-to-br ${phaseData.gradient}`}>
                  <div className="text-white text-center">
                    <div className="text-lg font-semibold opacity-90">Feature {index + 1}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{phaseData.title}</h3>
                  <p className="text-gray-600 mb-6">
                    {index === 0 && t('showcase.seeEveryJobGlanceDesc')}
                    {index === 1 && t('showcase.tieredPricingDesc')}
                    {index === 2 && t('showcase.automationsRunningDesc')}
                    {index === 3 && t('showcase.aiGrowthAdvisorDesc')}
                  </p>
                  <div className="scale-75 origin-top-left">
                    {phaseData.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Explorer Section ─────────────────────────────
function InteractiveExplorer() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const tabs = [
    { id: 'dashboard', icon: <BarChart3 className="w-5 h-5" />, label: t('explorer.dashboard'), description: t('explorer.dashboardDesc'), url: 'app.growthos.com/dashboard' },
    { id: 'pipeline', icon: <Layers className="w-5 h-5" />, label: t('explorer.pipeline'), description: t('explorer.pipelineDesc'), url: 'app.growthos.com/pipeline' },
    { id: 'estimates', icon: <FileText className="w-5 h-5" />, label: t('explorer.estimates'), description: t('explorer.estimatesDesc'), url: 'app.growthos.com/estimates' },
    { id: 'advisor', icon: <Bot className="w-5 h-5" />, label: t('explorer.growthAdvisor'), description: t('explorer.growthAdvisorDesc'), url: 'app.growthos.com/advisor' },
    { id: 'autopilot', icon: <Zap className="w-5 h-5" />, label: t('explorer.autopilot'), description: t('explorer.autopilotDesc'), url: 'app.growthos.com/automations' },
    { id: 'invoicing', icon: <Receipt className="w-5 h-5" />, label: t('explorer.invoicing'), description: t('explorer.invoicingDesc'), url: 'app.growthos.com/invoices' },
  ];

  // ─── Static mockup content for each tab (no animation, clean and final-state) ───
  const DashboardMockup = () => (
    <div className="bg-slate-900 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'New Leads', value: '23', trend: '+12%' },
          { label: 'Active Jobs', value: '14', trend: '+24%' },
          { label: 'Revenue', value: '$87.4K', trend: '+18%' },
          { label: 'Conversion', value: '68%', trend: '+5%' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700/50 shadow-sm">
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">{kpi.label}</p>
            <p className="text-lg sm:text-2xl font-bold text-white mt-1">{kpi.value}</p>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold">{kpi.trend} vs last month</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-700/50 shadow-sm">
          <p className="text-xs font-semibold text-slate-200 mb-4">Revenue Trend</p>
          <div className="flex items-end gap-1.5 h-24 sm:h-32">
            {[40, 55, 45, 65, 75, 85, 70, 90, 95, 80, 88, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-700/50 shadow-sm">
          <p className="text-xs font-semibold text-slate-200 mb-4">Pipeline</p>
          {[{ stage: 'New Leads', w: 80 }, { stage: 'Quoted', w: 55 }, { stage: 'Booked', w: 40 }, { stage: 'In Progress', w: 30 }].map((s) => (
            <div key={s.stage} className="flex items-center gap-2 mb-3">
              <span className="text-[10px] sm:text-xs text-slate-400 w-16 sm:w-20 shrink-0">{s.stage}</span>
              <div className="flex-1 h-2.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" style={{ width: `${s.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PipelineMockup = () => {
    const stages = [
      { name: 'New Lead', color: 'border-blue-500', dot: 'bg-blue-500', cards: [{ n: 'Water Heater Inspection', v: '$1,200' }, { n: 'Pipe Insulation Install', v: '$1,800' }, { n: 'Drain Cleaning Service', v: '$550' }] },
      { name: 'Contacted', color: 'border-purple-500', dot: 'bg-purple-500', cards: [{ n: 'Bathroom Remodel', v: '$5,600' }, { n: 'Outdoor Faucet Repair', v: '$450' }] },
      { name: 'Est. Scheduled', color: 'border-emerald-500', dot: 'bg-emerald-500', cards: [{ n: 'Kitchen Faucet Install', v: '$850' }, { n: 'Sump Pump Install', v: '$4,500' }] },
      { name: 'Booked', color: 'border-amber-500', dot: 'bg-amber-500', cards: [{ n: 'Sewer Line Replace', v: '$8,900' }, { n: 'Whole House Repipe', v: '$12,500' }] },
    ];
    return (
      <div className="bg-slate-900 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-white">$55,800 across 15 deals</p>
          </div>
          <div className="flex gap-1">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg">Board</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded-lg border border-slate-700/50">List</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stages.map((stage) => (
            <div key={stage.name} className="bg-slate-800 rounded-xl p-3 border border-slate-700/50 min-h-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                <p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase">{stage.name}</p>
              </div>
              <div className="space-y-2">
                {stage.cards.map((card) => (
                  <div key={card.n} className={`bg-slate-800/50 rounded-lg p-2.5 border-l-4 ${stage.color}`}>
                    <p className="text-xs font-semibold text-slate-200 truncate">{card.n}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{card.v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const EstimatesMockup = () => (
    <div className="bg-slate-900 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[{ l: 'Total Estimates', v: '10' }, { l: 'Pending', v: '4' }, { l: 'Approved', v: '5' }, { l: 'Conversion', v: '50%' }].map((k) => (
          <div key={k.l} className="bg-slate-800 rounded-xl p-3 border border-slate-700/50 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">{k.l}</p>
            <p className="text-xl font-bold text-white mt-1">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50">
              <th className="text-left py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Estimate #</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Customer</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px] hidden sm:table-cell">Service</th>
              <th className="text-right py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Amount</th>
              <th className="text-center py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'EST-001', cust: 'John Martinez', svc: 'Main Line Repair', amt: '$3,500', status: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
              { id: 'EST-002', cust: 'Sarah Chen', svc: 'Kitchen Faucet', amt: '$850', status: 'Sent', color: 'bg-blue-500/20 text-blue-400' },
              { id: 'EST-003', cust: 'Michael O\'Brien', svc: 'Water Heater', amt: '$1,540', status: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
              { id: 'EST-004', cust: 'Jennifer Williams', svc: 'Bathroom Remodel', amt: '$5,600', status: 'Draft', color: 'bg-slate-600/50 text-slate-300' },
              { id: 'EST-005', cust: 'David Rodriguez', svc: 'Fixture Install', amt: '$4,480', status: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
            ].map((r) => (
              <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-2.5 px-3 font-medium text-slate-200">{r.id}</td>
                <td className="py-2.5 px-3 text-slate-300">{r.cust}</td>
                <td className="py-2.5 px-3 text-slate-400 hidden sm:table-cell">{r.svc}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-slate-100">{r.amt}</td>
                <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.color}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const AdvisorMockup = () => (
    <div className="bg-slate-900 p-4 sm:p-6">
      <div className="bg-slate-800 rounded-2xl p-5 sm:p-7 border border-slate-700/50 shadow-sm">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div>
            <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
              <p className="text-sm text-slate-200 leading-relaxed">Morning Mike. You closed 8 jobs this month for $34,200. Up 18% from last month.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div>
            <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
              <p className="text-sm text-slate-200 leading-relaxed">3 estimates over $5K are going stale. That&apos;s $23K sitting on the table.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm shadow-md shadow-blue-600/20">
              <p className="text-sm leading-relaxed">Which ones?</p>
            </div>
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">M</div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div>
            <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
              <p className="text-sm text-slate-200 leading-relaxed">Patel kitchen reno ($12K), Chen HVAC ($6.2K), Rodriguez bathroom ($4.8K). Want me to follow up?</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-sm shadow-md shadow-blue-600/20">
              <p className="text-sm leading-relaxed">Yes, follow up today</p>
            </div>
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">M</div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div>
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
              <p className="text-sm text-emerald-300 font-medium">Done. Follow-up emails sent to all 3 customers with personalized quotes attached.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-700/50">
          <div className="flex-1 px-4 py-2.5 bg-slate-700/50 rounded-full text-sm text-slate-400 border border-slate-700">Ask anything about your business...</div>
          <div className="p-2.5 bg-blue-600 text-white rounded-full shadow-md shadow-blue-600/20">
            <Send className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const AutopilotMockup = () => (
    <div className="bg-slate-900 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[{ l: 'Emails/month', v: '~240' }, { l: 'Texts/month', v: '~180' }, { l: 'Hours saved', v: '47' }, { l: 'Revenue impact', v: '+$19.4K' }].map((k) => (
          <div key={k.l} className="bg-slate-800 rounded-xl p-3 border border-slate-700/50 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">{k.l}</p>
            <p className="text-xl font-bold text-white mt-1">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-sm divide-y divide-slate-700/50">
        {[
          { name: 'Speed to Lead', desc: 'Responds in 60 seconds', sent: '247 sent' },
          { name: 'Estimate Follow-Up', desc: 'Days 1, 3, 7', sent: '1,204 sent' },
          { name: '5-Star Reviews', desc: 'Auto-requests after job', sent: '892 sent' },
          { name: 'Payment Reminders', desc: 'Days 3, 7, 14', sent: '541 sent' },
          { name: 'Reactivation', desc: '60-day dormant customers', sent: '365 sent' },
          { name: 'Seasonal Campaigns', desc: 'Fall furnace tune-ups', sent: '128 sent' },
        ].map((auto) => (
          <div key={auto.name} className="flex items-center justify-between p-3 sm:p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200">{auto.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{auto.desc}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-11 h-6 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-slate-900 shadow-sm" style={{ left: 'calc(100% - 22px)' }} />
              </div>
              <span className="text-xs font-medium text-emerald-400 w-20 text-right">{auto.sent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InvoicingMockup = () => (
    <div className="bg-slate-900 p-4 sm:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[{ l: 'Invoices', v: '3' }, { l: 'Outstanding', v: '$3,107' }, { l: 'Paid', v: '$3,955' }, { l: 'Collection', v: '56%' }].map((k) => (
          <div key={k.l} className="bg-slate-800 rounded-xl p-3 border border-slate-700/50 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">{k.l}</p>
            <p className="text-xl font-bold text-white mt-1">{k.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-slate-200">Payment Collection</p>
          <p className="text-sm font-bold text-emerald-400">56%</p>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '56%' }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>Collected: $3,955</span>
          <span>Outstanding: $3,107</span>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50">
              <th className="text-left py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Invoice</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Customer</th>
              <th className="text-right py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Total</th>
              <th className="text-center py-2.5 px-3 font-semibold text-slate-400 uppercase text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'INV-001', cust: 'John Martinez', amt: '$3,955', status: 'Paid', color: 'bg-emerald-500/20 text-emerald-400' },
              { id: 'INV-002', cust: 'Patricia King', amt: '$734.50', status: 'Sent', color: 'bg-blue-500/20 text-blue-400' },
              { id: 'INV-003', cust: 'Sarah Chen', amt: '$2,373', status: 'Sent', color: 'bg-blue-500/20 text-blue-400' },
            ].map((r) => (
              <tr key={r.id} className="border-b border-slate-800/50">
                <td className="py-2.5 px-3 font-medium text-slate-200">{r.id}</td>
                <td className="py-2.5 px-3 text-slate-300">{r.cust}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-slate-100">{r.amt}</td>
                <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.color}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMockup = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardMockup />;
      case 'pipeline': return <PipelineMockup />;
      case 'estimates': return <EstimatesMockup />;
      case 'advisor': return <AdvisorMockup />;
      case 'autopilot': return <AutopilotMockup />;
      case 'invoicing': return <InvoicingMockup />;
      default: return <DashboardMockup />;
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <section className="relative bg-slate-950 py-20 sm:py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            {t('explorer.takeCloserLook')}
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-lg mx-auto">
            {t('explorer.everythingYouNeed')}
          </p>
        </div>

        {/* Left tabs + Right mockup layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Left side: vertical tabs */}
          <div className="lg:w-72 xl:w-80 shrink-0">
            {/* Mobile: horizontal scroll */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Desktop: vertical tabs with descriptions */}
            <div className="hidden lg:flex flex-col gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left w-full px-4 py-4 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'} transition-colors`}>
                      {tab.icon}
                    </div>
                    <span className={`font-semibold text-sm ${activeTab === tab.id ? 'text-white' : 'text-slate-400'} transition-colors`}>
                      {tab.label}
                    </span>
                  </div>
                  <p className={`mt-1.5 text-xs leading-relaxed pl-8 ${activeTab === tab.id ? 'text-slate-300' : 'text-slate-600'} transition-colors`}>
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: minimal app header + dark mockup */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shadow-black/50 ring-1 ring-white/5">
              {/* Minimal app header - no browser chrome */}
              <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">Growth OS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-slate-500">Live</span>
                </div>
              </div>

              {/* Mockup content */}
              <div className="bg-slate-900 min-h-[400px] sm:min-h-[480px]">
                {renderMockup()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────
function Features() {
  const { t } = useLanguage();
  const handleTiltMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--rx', `${-y * 8}deg`);
    e.currentTarget.style.setProperty('--ry', `${x * 8}deg`);
  };

  const handleTiltMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  const features = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('features.answerEveryCall'),
      description: t('features.answerEveryCallDesc'),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t('features.seeAllJobs'),
      description: t('features.seeAllJobsDesc'),
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('features.estimatesThatClose'),
      description: t('features.estimatesThatCloseDesc'),
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: t('features.getReviews'),
      description: t('features.getReviewsDesc'),
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: t('features.invoiceSameDay'),
      description: t('features.invoiceSameDayDesc'),
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('features.knowWhatMakes'),
      description: t('features.knowWhatMakesDesc'),
      gradient: "from-slate-500 to-gray-600",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{t('features.whatYouGet')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('features.sixProblemsSolved')}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('features.oneDashboard')}
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('features.description')}
          </p>
        </div>

        <div className="stagger-children scroll-fade-up grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="scroll-fade-up tilt-card group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Autopilot Section ───────────────────────────────────────
function AutopilotSection() {
  const { t } = useLanguage();
  const playbooks = [
    { name: t('autopilot.speedToLead'), description: t('autopilot.speedToLeadDesc'), category: "Leads", color: "bg-blue-500" },
    { name: t('autopilot.estimateFollowUp'), description: t('autopilot.estimateFollowUpDesc'), category: "Sales", color: "bg-purple-500" },
    { name: t('autopilot.reviewMachine'), description: t('autopilot.reviewMachineDesc'), category: "Reputation", color: "bg-amber-500" },
    { name: t('autopilot.paymentReminders'), description: t('autopilot.paymentRemindersDesc'), category: "Revenue", color: "bg-emerald-500" },
    { name: t('autopilot.customerReactivation'), description: t('autopilot.customerReactivationDesc'), category: "Retention", color: "bg-rose-500" },
    { name: t('autopilot.seasonalCampaigns'), description: t('autopilot.seasonalCampaignsDesc'), category: "Growth", color: "bg-teal-500" },
  ];

  return (
    <section id="autopilot" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{t('automations.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('autopilot.title')}{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('autopilot.subtitle')}
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('autopilot.description')}
          </p>
        </div>

        <div className="stagger-children scroll-fade-up grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {playbooks.map((p) => (
            <div key={p.name} className="scroll-fade-up group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-b-2xl">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 progress-fill" style={{ width: '75%', animation: 'fillWidth 3s ease-in-out infinite' }} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${p.color}`}>{p.category}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{p.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          {t('autopilot.preWritten')}
        </p>

        <div className="mt-6 text-center">
          <Link href="/automations" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/20">
            {t('autopilot.exploreAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Growth Advisor Demo (Animated Chat) ────────────────────
function AdvisorDemo() {
  const { t } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const conversation = [
    { sender: 'advisor' as const, text: "Hey Mike 👋 Quick morning update — you closed 8 jobs this month for $34,200. That's 18% up from last month." },
    { sender: 'advisor' as const, text: "One thing to watch: 3 estimates over $5K haven't been touched in 2 weeks. That's $23K sitting on the table." },
    { sender: 'user' as const, text: "Which ones?" },
    { sender: 'advisor' as const, text: "Patel kitchen reno ($12K), Chen HVAC install ($6,200), Rodriguez bathroom ($4,800). Want me to send follow-ups?" },
    { sender: 'user' as const, text: "Yeah do it" },
    { sender: 'advisor' as const, text: "Done. Sent personalized follow-ups to all 3. You'll get notified when they reply. 👍" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById('advisor-demo');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleMessages >= conversation.length) return;

    const currentMsg = conversation[visibleMessages];
    const typingDelay = currentMsg.sender === 'advisor' ? 1200 : 600;
    const readDelay = Math.min(currentMsg.text.length * 20, 2000);

    const typingTimer = setTimeout(() => {
      setIsTyping(true);
    }, readDelay);

    const messageTimer = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages(prev => prev + 1);
    }, readDelay + typingDelay);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [hasStarted, visibleMessages, conversation.length]);

  return (
    <section id="advisor-demo" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="scroll-fade-left text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{t('advisor.title')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              {t('advisor.likeTexting')}{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('advisor.smartestPartner')}
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed">
              {t('advisor.description')}
            </p>
            <div className="mt-8 space-y-4">
              {[
                { text: t('advisor.spotsStale'), icon: DollarSign },
                { text: t('advisor.tracksRevenue'), icon: TrendingUp },
                { text: t('advisor.givesGamePlan'), icon: Target },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-10">
              <Link
                href="/advisor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/20"
              >
                {t('advisor.tryAdvisor')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Animated Chat */}
          <div className="scroll-fade-right relative">
            {/* Phone frame */}
            <div className="mx-auto max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-gray-200 overflow-hidden">
              {/* Status bar */}
              <div className="bg-white px-6 pt-4 pb-0">
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>9:41 AM</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2.5 border border-gray-400 rounded-sm relative">
                      <div className="absolute inset-0.5 bg-gray-400 rounded-sm" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t('advisor.title')}</p>
                  <p className="text-[11px] text-emerald-600">{t('advisor.online')}</p>
                </div>
              </div>

              {/* Messages area */}
              <div className="px-4 py-4 space-y-2.5 min-h-[380px] bg-white">
                {/* Date pill */}
                <div className="flex justify-center mb-3">
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Today</span>
                </div>

                {conversation.slice(0, visibleMessages).map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeSlideUp_0.3s_ease-out]`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2 max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-[#0071E3] text-white rounded-br-md'
                          : 'bg-[#E9E9EB] text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#E9E9EB] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <div className="flex gap-1 items-center h-4">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2">
                  <span className="flex-1 text-[13px] text-gray-400">{t('explorer.askAboutBusiness')}</span>
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2 pt-1">
                <div className="w-32 h-1 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner() {
  const { t } = useLanguage();
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="stagger-children scroll-fade-up grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: 40, suffix: "%", label: t('stats.moreJobsBooked'), sublabel: t('stats.moreJobsBookedSub') },
            { value: 60, suffix: "sec", label: t('stats.leadResponseTime'), sublabel: t('stats.leadResponseTimeSub') },
            { value: 12, suffix: "hrs", label: t('stats.savedPerWeek'), sublabel: t('stats.savedPerWeekSub') },
            { value: 8500, suffix: "", prefix: "$", label: t('stats.extraRevenue'), sublabel: t('stats.extraRevenueSub') },
          ].map((stat) => (
            <div key={stat.label} className="scroll-fade-up">
              <div className="text-3xl lg:text-4xl font-bold text-white">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
              </div>
              <p className="mt-2 text-sm text-slate-300 font-medium">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Star Fill Component ──────────────────────────────────────
function AnimatedStars() {
  const [fillIndex, setFillIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let index = 0;
          const interval = setInterval(() => {
            if (index < 5) {
              setFillIndex(index);
              index++;
            } else {
              clearInterval(interval);
            }
          }, 100);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center gap-1 mb-4" ref={ref}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-all duration-300 ${
            i <= fillIndex ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const { t } = useLanguage();
  const testimonials = [
    {
      quote: "We were losing calls every morning because the guys were already on jobs. Growth OS auto-texts every missed call now. Month one: 12 extra jobs. That's $14,000 we would have lost.",
      name: "Mike Reynolds",
      role: "Owner, Reynolds Plumbing — Toronto, ON",
      initials: "MR",
      color: "bg-blue-500",
    },
    {
      quote: "Jobber handled scheduling fine, but it never helped us grow. Growth OS follows up on every estimate, asks for reviews, and the tax calculations actually work for Quebec. Switched in one day.",
      name: "Jean-Pierre Lavoie",
      role: "Propri\u00E9taire, Lavoie Climatisation — Montr\u00E9al, QC",
      initials: "JL",
      color: "bg-red-500",
    },
    {
      quote: "We turned on the review machine. 23 new Google reviews in 30 days. Calls went up. People said they found us because of the reviews. The platform paid for itself in week one.",
      name: "Sarah Kim",
      role: "GM, Comfort Zone HVAC — Vancouver, BC",
      initials: "SK",
      color: "bg-emerald-500",
    },
    {
      quote: "I'm not a tech guy. I thought I'd need to hire someone to set this up. Took me 10 minutes. Now I see every job, every lead, every dollar — from my phone. Worth every penny.",
      name: "Tony Della Rosa",
      role: "Owner, Della Plumbing — Calgary, AB",
      initials: "TD",
      color: "bg-orange-500",
    },
    {
      quote: "Three trucks, three crews, and we were running on texts and memory. Growth OS let everyone see what's booked, who's going where, and what we're making. We doubled revenue this year.",
      name: "Priya Patel",
      role: "Manager, Elite HVAC Solutions — Mississauga, ON",
      initials: "PP",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-6">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{t('testimonials.results')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('testimonials.realBusinesses')}{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {t('testimonials.realNumbers')}
            </span>
          </h2>
        </div>

        <div className="stagger-children scroll-fade-up grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.name} className="scroll-fade-up p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <AnimatedStars />
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Second row — 2 testimonials centered */}
        <div className="stagger-children scroll-fade-up grid md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3).map((t) => (
            <div key={t.name} className="scroll-fade-up p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <AnimatedStars />
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Competitor Comparison ───────────────────────────────────
function CompetitorComparison() {
  const { t } = useLanguage();
  const competitors = [
    { name: "Growth OS", price: "$79\u2013$299", highlight: true, features: { leads: true, autopilot: true, estimates: true, tax: true, bilingual: true, noContract: true, reviews: true, pipeline: true } },
    { name: "ServiceTitan", price: "$200+ (annual)", highlight: false, features: { leads: true, autopilot: "partial" as const, estimates: true, tax: false, bilingual: false, noContract: false, reviews: false, pipeline: true } },
    { name: "Jobber", price: "$49\u2013$249", highlight: false, features: { leads: "partial" as const, autopilot: false, estimates: true, tax: "partial" as const, bilingual: false, noContract: true, reviews: false, pipeline: "partial" as const } },
    { name: "Housecall Pro", price: "$65\u2013$200", highlight: false, features: { leads: true, autopilot: "partial" as const, estimates: true, tax: false, bilingual: false, noContract: false, reviews: "partial" as const, pipeline: true } },
  ];

  const featureLabels = [
    { key: "leads", label: t('comparison.autoRespondMissedCalls') },
    { key: "autopilot", label: t('comparison.automatedFollowUps') },
    { key: "estimates", label: t('comparison.goodBetterBest') },
    { key: "tax", label: t('comparison.canadianTaxCalculations') },
    { key: "bilingual", label: t('comparison.frenchEnglishTemplates') },
    { key: "noContract", label: t('comparison.monthToMonth') },
    { key: "reviews", label: t('comparison.googleHomeStarsReviews') },
    { key: "pipeline", label: t('comparison.visualPipeline') },
  ];

  const renderCheck = (value: boolean | "partial") => {
    if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
    if (value === "partial") return <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>;
    return <X className="w-5 h-5 text-gray-300 mx-auto" />;
  };

  return (
    <section id="compare" className="py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{t('comparison.compare')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('comparison.moreFeatures')}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {t('comparison.lessMoneyNoContracts')}
            </span>
          </h2>
        </div>

        {/* Desktop table */}
        <div className="scroll-scale-up overflow-x-auto hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500"></th>
                {competitors.map((c) => (
                  <th key={c.name} className={`p-4 text-center ${c.highlight ? "bg-blue-50 rounded-t-2xl" : ""}`}>
                    <div className={`text-sm font-bold ${c.highlight ? "text-blue-600" : "text-gray-700"}`}>{c.name}</div>
                    <div className={`text-xs mt-1 ${c.highlight ? "text-blue-500" : "text-gray-400"}`}>{c.price}/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((feature, i) => (
                <tr key={feature.key} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                  <td className="p-4 text-sm text-gray-700 font-medium">{feature.label}</td>
                  {competitors.map((c) => (
                    <td key={`${c.name}-${feature.key}`} className={`p-4 text-center ${c.highlight ? "bg-blue-50/50" : ""}`}>
                      {renderCheck(c.features[feature.key as keyof typeof c.features])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="scroll-scale-up md:hidden space-y-4">
          {competitors.map((c) => (
            <div key={c.name} className={`rounded-2xl p-5 ${c.highlight ? "bg-blue-50 border-2 border-blue-200" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-base font-bold ${c.highlight ? "text-blue-600" : "text-gray-900"}`}>{c.name}</div>
                  <div className={`text-xs ${c.highlight ? "text-blue-500" : "text-gray-400"}`}>{c.price}/mo</div>
                </div>
                {c.highlight && <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">{t('comparison.bestValue')}</span>}
              </div>
              <div className="space-y-2">
                {featureLabels.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-600 flex-1">{feature.label}</span>
                    <div className="shrink-0">{renderCheck(c.features[feature.key as keyof typeof c.features])}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          {t('comparison.noContractNote')}
        </p>
      </div>
    </section>
  );
}

// ─── Built for Canada (Closer) ───────────────────────────────
function BuiltForCanada() {
  const { t } = useLanguage();
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{t('marketing.madeInCanada')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {t('builtForCanada.title')}
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            {t('builtForCanada.subtitle')}
          </p>
        </div>

        <div className="stagger-children scroll-fade-up grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <DollarSign className="w-5 h-5" />, title: t('builtForCanada.taxesDone'), desc: t('builtForCanada.taxesDesc') },
            { icon: <Languages className="w-5 h-5" />, title: t('builtForCanada.frenchEnglish'), desc: t('builtForCanada.frenchEnglishDesc') },
            { icon: <Receipt className="w-5 h-5" />, title: t('builtForCanada.craReadyInvoices'), desc: t('builtForCanada.craReadyInvoicesDesc') },
            { icon: <BadgeCheck className="w-5 h-5" />, title: t('builtForCanada.licenseTracking'), desc: t('builtForCanada.licenseTrackingDesc') },
            { icon: <Globe className="w-5 h-5" />, title: t('builtForCanada.homeStarsReviews'), desc: t('builtForCanada.homeStarsReviewsDesc') },
            { icon: <DollarSign className="w-5 h-5" />, title: t('builtForCanada.interacETransfer'), desc: t('builtForCanada.interacETransferDesc') },
          ].map((f) => (
            <div key={f.title} className="scroll-fade-up p-5 rounded-xl bg-white border border-gray-100 hover:border-red-200/50 hover:shadow-md transition-all">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const { t } = useLanguage();
  const plans = [
    {
      name: t('pricing.starter'),
      price: "79",
      description: t('pricing.starterDesc'),
      features: [t('pricing.oneUser'), t('pricing.seeEveryJobGlance'), t('pricing.allCustomersOnePlace'), t('pricing.provincialTax'), t('pricing.speedToLeadReviewsReminders'), t('pricing.emailSupport')],
      cta: t('pricing.tryFree'),
      highlighted: false,
    },
    {
      name: t('pricing.growth'),
      price: "149",
      description: t('pricing.growthDesc'),
      features: [t('pricing.upTo5Users'), t('pricing.trackAsMany'), t('pricing.all8Automations'), t('pricing.tieredEstimates'), t('pricing.frenchEnglishTemplates'), t('pricing.whichJobsMakeMoney'), t('pricing.prioritySupport'), t('pricing.googleHomeStarsSync')],
      cta: t('pricing.tryFree'),
      highlighted: true,
    },
    {
      name: t('pricing.scale'),
      price: "299",
      description: t('pricing.scaleDesc'),
      features: [t('pricing.unlimitedUsers'), t('pricing.multiLocationSupport'), t('pricing.licenseWsibWcbTracking'), t('pricing.connectToAnySoftware'), t('pricing.dedicatedAccountManager'), t('pricing.interacETransferIntegration'), t('pricing.trainYourTeam'), t('pricing.accountingSoftwareSyncs')],
      cta: t('pricing.tryFree'),
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{t('pricing.title')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {t('pricing.description')} {" "}
            <span className="gradient-text-shimmer bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {t('pricing.included')}
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {t('pricing.noCredit')}
          </p>
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('pricing.riskReversal')}
          </p>
        </div>

        <div className="stagger-children scroll-fade-up grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`scroll-fade-up relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${plan.highlighted ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/25 md:scale-105 shimmer-border" : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                  {/* Note: "Most Popular" is not in translations yet, keeping hardcoded for now */}
                  Most Popular
                </div>
              )}
              <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-blue-100" : "text-gray-900"}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>$</span>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>/mo CAD</span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? "text-blue-200" : "text-emerald-500"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-blue-50" : "text-gray-600"}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/setup" className={`mt-8 block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.setupTime'), a: t('faq.setupTimeAnswer') },
    { q: t('faq.importData'), a: t('faq.importDataAnswer') },
    { q: t('faq.quebecTaxes'), a: t('faq.quebecTaxesAnswer') },
    { q: t('faq.techniciansMobile'), a: t('faq.techniciansMobileAnswer') },
    { q: t('faq.soloOperator'), a: t('faq.soloOperatorAnswer') },
    { q: t('faq.contract'), a: t('faq.contractAnswer') },
    { q: t('faq.techSavvy'), a: t('faq.techSavvyAnswer') },
    { q: t('faq.afterTrial'), a: t('faq.afterTrialAnswer') },
    { q: t('faq.specificTrade'), a: t('faq.specificTradeAnswer') },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('faq.faq')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{t('faq.questions')}</h2>
        </div>

        <div className="scroll-fade-up space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-90" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────
export default function LandingPage() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <InteractiveExplorer />
      <Testimonials />
      <AutopilotSection />
      <StatsBanner />
      <CompetitorComparison />
      <BuiltForCanada />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}

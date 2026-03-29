'use client';

import { MarketingLayout, CTASection, Footer } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { ArrowRight, Leaf, Calendar, Clock, RefreshCw, Star, CheckCircle2, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function LandscapingPage() {
  const { t } = useLanguage();
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                {t('landscapingPage.builtFor')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('landscapingPage.heroTitle')}
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                {t('landscapingPage.heroDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/setup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-base font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/25 hover:shadow-green-700/30 hover:-translate-y-0.5"
                >
                  {t('landscapingPage.startFreeTrial')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 text-base font-semibold rounded-full border-2 border-green-200 hover:bg-green-50 transition-all"
                >
                  {t('landscapingPage.seeInAction')}
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">{t('landscapingPage.noCardNeeded')}</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl blur-3xl opacity-60" />
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200">
                  <div className="space-y-4 text-green-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{t('landscapingPage.scheduleCrews')}</div>
                        <div className="text-sm text-green-700">{t('landscapingPage.scheduleCrewsDesc')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{t('landscapingPage.trackCashFlow')}</div>
                        <div className="text-sm text-green-700">{t('landscapingPage.trackCashFlowDesc')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{t('landscapingPage.collectDeposits')}</div>
                        <div className="text-sm text-green-700">{t('landscapingPage.collectDepositsDesc')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{t('landscapingPage.photoOrganized')}</div>
                        <div className="text-sm text-green-700">{t('landscapingPage.photoOrganizedDesc')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landscapingPage.soundFamiliar')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landscapingPage.builtForSolutions')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pain Point 1: Seasonal Cash Flow */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landscapingPage.seasonalCashflow')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('landscapingPage.seasonalCashflowDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t('landscapingPage.seasonalIssues').split('\n').map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>

            {/* Pain Point 2: Crew Scheduling */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landscapingPage.crewScheduling')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('landscapingPage.crewSchedulingDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t('landscapingPage.crewIssues').split('\n').map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>

            {/* Pain Point 3: Estimate Follow-Up */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landscapingPage.deadEstimates')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('landscapingPage.deadEstimatesDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t('landscapingPage.estimateIssues').split('\n').map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>

            {/* Pain Point 4: Equipment & Crew Tracking */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landscapingPage.equipmentTracking')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('landscapingPage.equipmentTrackingDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {t('landscapingPage.equipmentIssues').split('\n').map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landscapingPage.howSolveIt')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('landscapingPage.purposeBuilt')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t('landscapingPage.smartDispatch')}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('landscapingPage.smartDispatchDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.mobileUpdates')}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.trackWorked')}</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t('landscapingPage.recoverEstimates')}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('landscapingPage.recoverEstimatesDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.recoverPercent')}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.saveTime')}</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <RefreshCw className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t('landscapingPage.seasonalDeposits')}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('landscapingPage.seasonalDepositsDesc')}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.reduceStress')}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('landscapingPage.runsAutomatic')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t('landscapingPage.cashFlowClarity')}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('landscapingPage.cashFlowClarityDesc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {t('landscapingPage.equipmentCrewTracking')}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('landscapingPage.equipmentCrewTrackingDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              {t('landscapingPage.testimonialQuote')}
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                PR
              </div>
              <div>
                <p className="font-bold text-gray-900">{t('landscapingPage.testimonialAuthor')}</p>
                <p className="text-gray-600 text-sm">{t('landscapingPage.testimonialCompany')}</p>
                <p className="text-gray-500 text-xs">{t('landscapingPage.testimonialLocation')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('industryPage.simplePricing')}
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t('electricalPage.pricingDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$79</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('pricing.starterDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                {t('pricing.tryFree')}
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-blue-600 p-6 text-left shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$149</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('pricing.growthDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                {t('pricing.tryFree')}
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Scale</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$299</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('pricing.scaleDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                {t('pricing.tryFree')}
              </Link>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            {t('electricalPage.pricingNote')}{" "}
            <Link href="/#pricing" className="text-blue-600 hover:underline">See full plan comparison</Link>
          </p>
        </div>
      </section>

      {/* Book a Demo */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t('industryPage.seeItBeforeTry')}
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            {t('industryPage.bookWalkthrough')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-full hover:bg-gray-800 transition-all hover:-translate-y-0.5"
            >
              {t('contactPage.bookDemo')}
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              {t('hero.startFreeNoCard')}
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

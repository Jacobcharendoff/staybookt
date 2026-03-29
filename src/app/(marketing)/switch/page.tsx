'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SwitchPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Section 1: Hero */}
      <section className="w-full bg-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('switchPage.heroTitle')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('switchPage.heroSubtitle')}
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
          >
            {t('switchPage.heroCta')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Section 2: Benefit Cards */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16 text-center">
            {t('switchPage.whatChanges')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Card 1: Bilingual */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.bilingualTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.bilingualDesc')}
              </p>
            </div>

            {/* Card 2: Canadian Tax */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🍁</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.taxTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.taxDesc')}
              </p>
            </div>

            {/* Card 3: Automations */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.automationsTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.automationsDesc')}
              </p>
            </div>

            {/* Card 4: Pricing */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.pricingTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.pricingDesc')}
              </p>
            </div>

            {/* Card 5: HomeStars */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.homeStarsTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.homeStarsDesc')}
              </p>
            </div>

            {/* Card 6: Built for How You Work */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('switchPage.builtForTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('switchPage.builtForDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How to Switch */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16 text-center">
            {t('switchPage.easyToSwitch')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-blue-600/25">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('switchPage.step1Label')}
              </h3>
              <p className="text-gray-600">
                {t('switchPage.step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-blue-600/25">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('switchPage.step2Label')}
              </h3>
              <p className="text-gray-600">
                {t('switchPage.step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-blue-600/25">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('switchPage.step3Label')}
              </h3>
              <p className="text-gray-600">
                {t('switchPage.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Coming From... Competitor Tabs */}
      <section className="w-full bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center">
            {t('switchPage.comingFrom')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ServiceTitan Card */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('switchPage.fromServiceTitanTitle')}
              </h3>
              <p className="text-slate-300 mb-6">
                {t('switchPage.fromServiceTitanDesc')}
              </p>
              <Link
                href="/vs-servicetitan"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                {t('switchPage.fromServiceTitanLink')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Jobber Card */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('switchPage.fromJobberTitle')}
              </h3>
              <p className="text-slate-300 mb-6">
                {t('switchPage.fromJobberDesc')}
              </p>
              <Link
                href="/vs-jobber"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                {t('switchPage.fromJobberLink')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Housecall Pro Card */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('switchPage.fromHouseCallTitle')}
              </h3>
              <p className="text-slate-300 mb-6">
                {t('switchPage.fromHouseCallDesc')}
              </p>
              <Link
                href="/vs-housecall-pro"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                {t('switchPage.fromHouseCallLink')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Social Proof - Testimonials */}
      <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-16 text-center">
            {t('switchPage.socialProofTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{t('switchPage.testimonial1Text')}"
              </p>
              <div>
                <p className="font-bold text-gray-900">{t('switchPage.testimonial1Name')}</p>
                <p className="text-sm text-gray-600">{t('switchPage.testimonial1Title')}</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{t('switchPage.testimonial2Text')}"
              </p>
              <div>
                <p className="font-bold text-gray-900">{t('switchPage.testimonial2Name')}</p>
                <p className="text-sm text-gray-600">{t('switchPage.testimonial2Title')}</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{t('switchPage.testimonial3Text')}"
              </p>
              <div>
                <p className="font-bold text-gray-900">{t('switchPage.testimonial3Name')}</p>
                <p className="text-sm text-gray-600">{t('switchPage.testimonial3Title')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Final CTA */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-blue-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {t('switchPage.finalCta')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('cta.noCardRequired')}
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 text-base font-semibold rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            {t('switchPage.finalCtaBtn')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

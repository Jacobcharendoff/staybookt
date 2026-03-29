'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { Zap, FileText, AlertCircle, TrendingUp, CheckCircle, Phone, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ElectricalPage() {
  const { t } = useLanguage();
  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('electricalPage.heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('electricalPage.heroDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors"
          >
            {t('electricalPage.getStartedFree')}
            <Zap className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">{t('electricalPage.noCardRequired')}</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            {t('electricalPage.problemsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permit Tracking */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('electricalPage.permitChaos')}</h3>
                  <p className="text-gray-600">
                    {t('electricalPage.permitChaosDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Estimates & Follow-ups */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('electricalPage.estimateFollowUp')}</h3>
                  <p className="text-gray-600">
                    {t('electricalPage.estimateFollowUpDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Code Inspections */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('electricalPage.inspectionFailures')}</h3>
                  <p className="text-gray-600">
                    {t('electricalPage.inspectionFailuresDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* License Management */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('electricalPage.licenseTracking')}</h3>
                  <p className="text-gray-600">
                    {t('electricalPage.licenseTrackingDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            {t('electricalPage.howWeKeep')}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            {t('electricalPage.howWeKeepDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permit Tracking */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.permitTrackingTitle')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('electricalPage.permitTrackingFeature')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.permitReminders')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.permitLink')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.permitNever')}
                </li>
              </ul>
            </div>

            {/* Fast Estimates */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.estimatesCloser')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('electricalPage.estimatesCloserDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.customTemplates')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.onlineApproval')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.autoFollowUp')}
                </li>
              </ul>
            </div>

            {/* Smart Follow-ups */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.neverForgetFollowUp')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('electricalPage.neverForgetFollowUpDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.customReminders')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.seeLeadPipeline')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.autoTextsEmails')}
                </li>
              </ul>
            </div>

            {/* Solo Operator Support */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.officeManager')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('electricalPage.officeManagerDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.licenseInsurance')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.renewalReminders')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('electricalPage.scaleWithout')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 rounded-2xl shadow-sm">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-2xl">★</span>
              ))}
            </div>
            <p className="text-xl text-gray-900 mb-8 leading-relaxed font-medium">
              {t('electricalPage.testimonialQuote')}
            </p>
            <div>
              <p className="font-semibold text-gray-900">{t('electricalPage.testimonialAuthor')}</p>
              <p className="text-gray-600">{t('electricalPage.testimonialCompany')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('electricalPage.testimonialTitle')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('electricalPage.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('electricalPage.ctaDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg"
          >
            {t('electricalPage.startFreeTrial')}
            <Zap className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('electricalPage.pricingTitle')}
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t('electricalPage.pricingDesc')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.starterPlan')}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{t('electricalPage.starterPrice')}</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('electricalPage.starterDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                {t('electricalPage.tryFree14')}
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-blue-600 p-6 text-left shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                {t('electricalPage.mostPopular')}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.growthPlan')}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{t('electricalPage.growthPrice')}</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('electricalPage.growthDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                {t('electricalPage.tryFree14')}
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">{t('electricalPage.scalePlan')}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{t('electricalPage.scalePrice')}</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('electricalPage.scaleDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                {t('electricalPage.tryFree14')}
              </Link>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            {t('electricalPage.pricingNote')}{" "}
            <Link href="/#pricing" className="text-blue-600 hover:underline">{t('electricalPage.seeFullComparison')}</Link>
          </p>
        </div>
      </section>

      {/* Book a Demo */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {t('electricalPage.demoTitle')}
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            {t('electricalPage.demoDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-base font-semibold rounded-full hover:bg-gray-800 transition-all hover:-translate-y-0.5"
            >
              {t('electricalPage.bookDemo')}
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              {t('electricalPage.orStartFreeTrial')}
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

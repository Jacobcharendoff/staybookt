'use client';

import { MarketingLayout } from '@/components/MarketingLayout';
import { useLanguage } from '@/components/LanguageProvider';
import { Phone, Clock, CreditCard, Star, CheckCircle, MessageSquare, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PlumbingPage() {
  const { t } = useLanguage();

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('industryPage.heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('industryPage.heroDesc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors"
          >
            {t('industryPage.getStartedFree')}
            <Phone className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">{t('industryPage.noCardNeeded')}</p>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center">
            {t('industryPage.commonProblems')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Missed Calls */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('industryPage.missedCalls')}</h3>
                  <p className="text-gray-600">
                    {t('industryPage.missedCallsDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Slow Estimates */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('industryPage.slowEstimates')}</h3>
                  <p className="text-gray-600">
                    {t('industryPage.slowEstimatesDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Unpaid Invoices */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-rose-500">
              <div className="flex items-start gap-4">
                <CreditCard className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('industryPage.unpaidInvoices')}</h3>
                  <p className="text-gray-600">
                    {t('industryPage.unpaidInvoicesDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Dispatch */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('industryPage.emergencyDispatch')}</h3>
                  <p className="text-gray-600">
                    {t('industryPage.emergencyDispatchDesc')}
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {t('industryPage.howItFixes')}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            {t('industryPage.oneApp')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unified Inbox */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('industryPage.unifiedInbox')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('industryPage.unifiedInboxDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.seeCallerName')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.autoTranscribe')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.twoWayTexting')}
                </li>
              </ul>
            </div>

            {/* Fast Estimates */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('industryPage.fastEstimates')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('industryPage.fastEstimatesDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.mobileTemplates')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.onlineApproval')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.autoReminders')}
                </li>
              </ul>
            </div>

            {/* Smart Invoicing */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('industryPage.smartInvoicing')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('industryPage.smartInvoicingDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.acceptPayments')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.lateInvoiceReminder')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.overdueAtGlance')}
                </li>
              </ul>
            </div>

            {/* Parts & Warranty */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{t('industryPage.warranty')}</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('industryPage.warrantyDesc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.linkParts')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.warrantyReminders')}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {t('industryPage.pendingParts')}
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
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xl text-gray-900 mb-8 leading-relaxed font-medium">
              "Biggest thing for us was not missing calls. My wife was fielding maybe 15-20 calls a day and probably losing a third of them. Now they all get logged and we follow up same-day instead of next-week. We're probably booking 4-5 more jobs a month — hard to say exactly, but the phone doesn't ring and go nowhere anymore. Still working on getting guys to update job statuses, but we'll get there."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Mike Reynolds</p>
              <p className="text-gray-600">Reynolds Plumbing, Toronto ON</p>
              <p className="text-sm text-gray-500 mt-1">Family plumbing company, 3 teams, 12 years in business</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('industryPage.readyToBook')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('industryPage.startFreeToday')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors text-lg"
          >
            {t('industryPage.startYourTrial')}
            <Phone className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('industryPage.simplePricing')}
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            {t('industryPage.monthToMonth')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$79</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('industryPage.starterDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                Try Free (14 Days)
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
              <p className="mt-2 text-sm text-gray-500">{t('industryPage.growthDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                Try Free (14 Days)
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900">Scale</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$299</span>
                <span className="text-sm text-gray-500">/mo CAD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{t('industryPage.scaleDesc')}</p>
              <Link href="/setup" className="mt-6 block text-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                Try Free (14 Days)
              </Link>
            </div>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            {t('industryPage.tryFreeAllPlans')}{" "}
            <Link href="/#pricing" className="text-blue-600 hover:underline">{t('industryPage.seeFullComparison')}</Link>
          </p>
        </div>
      </section>

      {/* Book a Demo */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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
              {t('industryPage.bookDemo')}
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-base font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              {t('industryPage.orStartTrial')}
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

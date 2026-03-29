'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { ContactRow } from '@/components/ContactRow';
import { Modal } from '@/components/Modal';
import { AddContactForm } from '@/components/AddContactForm';
import { Plus, Search } from 'lucide-react';

export default function ContactsPage() {
  const { t } = useLanguage();
  const { contacts, deals, initializeSeedData } = useStore();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-28 shadow-sm"></div>)}
        </div>
      </div>
    );
  }

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const getDealCount = (contactId: string) =>
    deals.filter((d) => d.contactId === contactId).length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('contacts.title')}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {contacts.length} {t('contacts.totalContacts')}
            </p>
          </div>
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('contacts.addContact')}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('contacts.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0">
            <tr>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('contacts.nameAddress')}
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                {t('contacts.type')}
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                {t('contacts.source')}
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('contacts.contact')}
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('contacts.deals')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  dealCount={getDealCount(contact.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    {searchQuery ? t('contacts.notFound') : t('contacts.noContacts')}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        title="Add New Contact"
      >
        <AddContactForm onClose={() => setIsAddContactOpen(false)} />
      </Modal>
    </div>
  );
}

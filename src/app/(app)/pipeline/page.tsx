'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Deal, PipelineStage, Contact, getLeadSourceRing } from '@/types';
import { Modal } from '@/components/Modal';
import { AddDealForm } from '@/components/AddDealForm';
import { Plus, Search, X, Eye, List } from 'lucide-react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const PIPELINE_STAGES_CONFIG: { stage: PipelineStage; labelKey: string; color: string }[] = [
  { stage: 'new_lead', labelKey: 'pipeline.newLead', color: 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600' },
  { stage: 'contacted', labelKey: 'pipeline.contacted', color: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' },
  { stage: 'estimate_scheduled', labelKey: 'pipeline.estScheduled', color: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700' },
  { stage: 'estimate_sent', labelKey: 'pipeline.estSent', color: 'bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700' },
  { stage: 'booked', labelKey: 'pipeline.booked', color: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700' },
  { stage: 'in_progress', labelKey: 'pipeline.inProgress', color: 'bg-cyan-100 dark:bg-cyan-900 border-cyan-300 dark:border-cyan-700' },
  { stage: 'completed', labelKey: 'pipeline.completed', color: 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700' },
  { stage: 'invoiced', labelKey: 'pipeline.invoiced', color: 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' },
];

export default function PipelinePage() {
  const { t } = useLanguage();
  const { deals, contacts, initializeSeedData, updateDeal, getContact } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [valueFilter, setValueFilter] = useState<string>('all');
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [sortColumn, setSortColumn] = useState<'title' | 'contact' | 'value' | 'days'>('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, debouncedSearchQuery, assignedToFilter, sourceFilter, valueFilter]);

  const applyFilters = () => {
    let filtered = deals.filter((deal) => {
      const contact = getContact(deal.contactId);
      const contactName = contact?.name || '';

      const matchesSearch =
        debouncedSearchQuery === '' ||
        deal.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contactName.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesAssigned =
        assignedToFilter === 'all' ||
        deal.assignedTo === assignedToFilter ||
        (assignedToFilter === 'team' && deal.assignedTo === 'Team');

      const sourceRing = getLeadSourceRing(deal.source);
      const matchesSource =
        sourceFilter === 'all' || sourceRing === sourceFilter;

      const matchesValue =
        valueFilter === 'all' ||
        (valueFilter === 'under_1k' && deal.value < 1000) ||
        (valueFilter === '1k_5k' && deal.value >= 1000 && deal.value < 5000) ||
        (valueFilter === '5k_10k' && deal.value >= 5000 && deal.value < 10000) ||
        (valueFilter === 'over_10k' && deal.value >= 10000);

      return matchesSearch && matchesAssigned && matchesSource && matchesValue;
    });

    setFilteredDeals(filtered);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStage = destination.droppableId as PipelineStage;
    updateDeal(draggableId, { stage: newStage });
  };

  const calculateMetrics = () => {
    const total = filteredDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      totalDeals: filteredDeals.length,
      totalValue: total,
      avgValue: filteredDeals.length > 0 ? Math.round(total / filteredDeals.length) : 0,
    };
  };

  const getDaysInStage = (deal: Deal): number => {
    return Math.floor((Date.now() - deal.updatedAt) / (1000 * 60 * 60 * 24));
  };

  const getStageMetrics = (stage: PipelineStage) => {
    const stageDeals = filteredDeals.filter((d) => d.stage === stage);
    const value = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return { count: stageDeals.length, value };
  };

  const getDealsByStage = (stage: PipelineStage) => {
    return filteredDeals.filter((d) => d.stage === stage);
  };

  const metrics = calculateMetrics();
  const clearFilters = () => {
    setSearchQuery('');
    setAssignedToFilter('all');
    setSourceFilter('all');
    setValueFilter('all');
  };

  const hasActiveFilters =
    debouncedSearchQuery || assignedToFilter !== 'all' || sourceFilter !== 'all' || valueFilter !== 'all';

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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header Section */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">{t('pipeline.title')}</h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mt-1 font-semibold">
              ${metrics.totalValue.toLocaleString()} across {metrics.totalDeals} deals
            </p>
          </div>
          <button
            onClick={() => setIsAddDealOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('pipeline.addDeal')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('pipeline.searchDeals')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={assignedToFilter}
            onChange={(e) => setAssignedToFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allAssigned')}</option>
            <option value="Marcus">Marcus</option>
            <option value="James">James</option>
            <option value="Team">Team</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allSources')}</option>
            <option value="ring_1">Ring 1</option>
            <option value="ring_2">Ring 2</option>
            <option value="ring_3">Ring 3</option>
          </select>

          <select
            value={valueFilter}
            onChange={(e) => setValueFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">{t('pipeline.allValues')}</option>
            <option value="under_1k">{t('pipeline.under1k')}</option>
            <option value="1k_5k">{t('pipeline.1kTo5k')}</option>
            <option value="5k_10k">{t('pipeline.5kTo10k')}</option>
            <option value="over_10k">{t('pipeline.over10k')}</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              {t('pipeline.clearFilters')}
            </button>
          )}

          <div className="ml-auto flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              {t('pipeline.board')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              {t('pipeline.list')}
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 dark:bg-slate-950 p-3 sm:p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-3 sm:gap-6 min-w-max">
              {PIPELINE_STAGES_CONFIG.map(({ stage, labelKey, color }) => {
                const label = t(labelKey as any);
                const stageDeals = getDealsByStage(stage);
                const metrics = getStageMetrics(stage);

                return (
                  <Droppable key={stage} droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-shrink-0 w-64 sm:w-80 rounded-lg border-2 transition-all ${color} ${
                          snapshot.isDraggingOver ? 'shadow-xl ring-2 ring-blue-400' : 'shadow'
                        }`}
                      >
                        {/* Column Header */}
                        <div className="sticky top-0 p-4 border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-t-md">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
                            <button
                              onClick={() => setIsAddDealOpen(true)}
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded p-1"
                              title="Add deal to this stage"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400">{metrics.count} deals</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              ${metrics.value.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Deal Cards */}
                        <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
                          {stageDeals.map((deal, index) => {
                            const contact = getContact(deal.contactId);
                            const daysInStage = getDaysInStage(deal);
                            const ring = getLeadSourceRing(deal.source);

                            return (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <Link href={`/pipeline/${deal.id}`}>
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-move transition-all hover:shadow-lg active:shadow-xl ${
                                        snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
                                      }`}
                                    >
                                      <div className="flex justify-between items-start gap-2 mb-2">
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                                          {deal.title}
                                        </h4>
                                        <span className="flex-shrink-0 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                                          {daysInStage}d
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{contact?.name}</p>
                                      <div className="flex justify-between items-end mb-2">
                                        <span className="font-bold text-lg text-slate-900 dark:text-white">
                                          ${deal.value.toLocaleString()}
                                        </span>
                                        <span className="text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                          {ring}
                                        </span>
                                      </div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400">
                                        {deal.assignedTo}
                                      </div>
                                    </div>
                                  </Link>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.contact')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">Stage</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.value')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('contacts.source')}</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-900 dark:text-white">{t('form.assignedTo')}</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-900 dark:text-white">Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((deal) => {
                const contact = getContact(deal.contactId);
                const daysInStage = getDaysInStage(deal);
                const ring = getLeadSourceRing(deal.source);
                const stageInfo = PIPELINE_STAGES_CONFIG.find((s) => s.stage === deal.stage);

                return (
                  <tr
                    key={deal.id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/pipeline/${deal.id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {deal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{contact?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${stageInfo?.color}`}>
                        {t((stageInfo as any)?.labelKey)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-medium">
                        {ring}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{deal.assignedTo}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{daysInStage}d</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pipeline Summary Bar */}
      <div className="px-4 sm:px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.totalDeals')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalDeals}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.totalValue')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${metrics.totalValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.averageDeal')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${metrics.avgValue.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">{t('pipeline.winRate')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.totalDeals > 0
              ? `${Math.round((getDealsByStage('completed').length / metrics.totalDeals) * 100)}%`
              : '0%'}
          </p>
        </div>
      </div>

      {/* Add Deal Modal */}
      <Modal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        title="Add New Deal"
      >
        <AddDealForm
          contacts={contacts}
          onClose={() => setIsAddDealOpen(false)}
        />
      </Modal>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { Plus, ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';

const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TECHNICIANS = ['Marcus', 'James', 'Team'];
const TECH_COLORS: Record<string, string> = {
  Marcus: 'bg-blue-100 border-blue-300 text-blue-900',
  James: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  Team: 'bg-amber-100 border-amber-300 text-amber-900',
};

interface ScheduledJob {
  id: string;
  title: string;
  customer: string;
  address: string;
  startHour: number;
  endHour: number;
  day: number;
  technician: string;
  isEmergency: boolean;
}

interface UnscheduledJob {
  id: string;
  title: string;
  customer: string;
  address: string;
  value: number;
}

export default function SchedulePage() {
  const { deals, contacts, initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);
  const [unscheduledJobs, setUnscheduledJobs] = useState<UnscheduledJob[]>([]);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  useEffect(() => {
    if (!mounted || deals.length === 0) return;

    // Create mock scheduled jobs from deals
    const scheduled: ScheduledJob[] = [];
    const unscheduled: UnscheduledJob[] = [];

    deals.forEach((deal, index) => {
      const contact = contacts.find((c) => c.id === deal.contactId);
      if (!contact) return;

      // Book some deals (30% of them)
      if (deal.stage === 'booked' || deal.stage === 'in_progress' || deal.stage === 'completed') {
        const day = (index * 2) % 7;
        const startHour = 7 + (index % 5);
        const duration = 1 + (index % 3);
        scheduled.push({
          id: deal.id,
          title: deal.title,
          customer: contact.name,
          address: contact.address.split(',')[0],
          startHour,
          endHour: startHour + duration,
          day,
          technician: (deal.assignedTo as string) || 'Team',
          isEmergency: index % 8 === 0,
        });
      } else if (
        deal.stage === 'estimate_sent' ||
        deal.stage === 'estimate_scheduled' ||
        deal.stage === 'new_lead'
      ) {
        unscheduled.push({
          id: deal.id,
          title: deal.title,
          customer: contact.name,
          address: contact.address.split(',')[0],
          value: deal.value,
        });
      }
    });

    setScheduledJobs(scheduled);
    setUnscheduledJobs(unscheduled.slice(0, 4));
  }, [mounted, deals, contacts]);

  if (!mounted) return <div className="p-8">Loading...</div>;

  const getWeekDates = () => {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    return DAYS.map((_, i) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();
  const todayDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Schedule</h1>
        <p className="text-slate-600">Manage and dispatch technicians to jobs</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          {/* Week Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-900">
                {weekOffset === 0
                  ? 'This Week'
                  : `Week of ${weekDates[0].toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}`}
              </span>
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            <Plus className="w-4 h-4" />
            Schedule Job
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition">
            Bulk Schedule
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Schedule */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Days Header */}
            <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200">
              <div className="p-4 font-semibold text-xs text-slate-600">Time</div>
              {DAYS.map((day, i) => {
                const date = weekDates[i];
                const isTodayCol = isCurrentWeek && i === todayDayIndex;
                return (
                  <div
                    key={day}
                    className={`p-4 text-center font-semibold text-sm ${
                      isTodayCol ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="text-slate-600">{day}</div>
                    <div className={`text-xs mt-1 ${isTodayCol ? 'text-blue-600' : 'text-slate-500'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="divide-y divide-slate-200">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-8 divide-x divide-slate-200"
                >
                  {/* Hour Label */}
                  <div className="p-4 bg-slate-50 text-xs font-semibold text-slate-600">
                    {hour}:00
                  </div>

                  {/* Day Cells */}
                  {DAYS.map((_, dayIndex) => {
                    const cellJobs = scheduledJobs.filter(
                      (job) =>
                        job.day === dayIndex &&
                        job.startHour === hour
                    );

                    return (
                      <div
                        key={`${dayIndex}-${hour}`}
                        className="p-2 relative h-20 bg-white hover:bg-slate-50 transition"
                      >
                        {cellJobs.map((job) => {
                          const height = (job.endHour - job.startHour) * 80;
                          return (
                            <div
                              key={job.id}
                              style={{ minHeight: `${height}px` }}
                              className={`p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition text-xs ${
                                TECH_COLORS[job.technician] || TECH_COLORS.Team
                              } ${job.isEmergency ? 'ring-2 ring-rose-500 ring-offset-1' : ''}`}
                            >
                              <div className="font-semibold truncate">
                                {job.title}
                              </div>
                              <div className="text-xs opacity-75 truncate">
                                {job.customer}
                              </div>
                              <div className="text-xs opacity-75">
                                {job.startHour}:00 - {job.endHour}:00
                              </div>
                              {job.isEmergency && (
                                <div className="mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Emergency
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {TECHNICIANS.map((tech) => (
              <div key={tech} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${TECH_COLORS[tech].split(' ')[0]}`} />
                <span className="text-slate-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unscheduled Jobs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Unscheduled Jobs
            </h3>

            {unscheduledJobs.length > 0 ? (
              <div className="space-y-4">
                {unscheduledJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition group cursor-move"
                  >
                    <div className="font-semibold text-sm text-slate-900 group-hover:text-blue-900 truncate">
                      {job.title}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 truncate">
                      {job.customer}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {job.address}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-emerald-600">
                        ${job.value.toLocaleString()}
                      </span>
                      <button className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                All jobs are scheduled!
              </p>
            )}

            {/* Summary Cards */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Total Scheduled</div>
                <div className="text-2xl font-bold text-slate-900">
                  {scheduledJobs.length}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-600 mb-1">Pending Schedule</div>
                <div className="text-2xl font-bold text-slate-900">
                  {unscheduledJobs.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

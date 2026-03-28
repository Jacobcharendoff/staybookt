'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Send,
  Trash2,
  TrendingUp,
  FileText,
  Clock,
} from 'lucide-react';

type EstimateStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';

interface Estimate {
  id: string;
  number: string;
  customerName: string;
  service: string;
  amount: number;
  status: EstimateStatus;
  sentDate: Date;
  daysOld: number;
}

const MOCK_ESTIMATES: Estimate[] = [
  {
    id: '1',
    number: 'EST-2026-001',
    customerName: 'John Martinez',
    service: 'Main Line Repair',
    amount: 3500,
    status: 'approved',
    sentDate: new Date('2026-03-20'),
    daysOld: 8,
  },
  {
    id: '2',
    number: 'EST-2026-002',
    customerName: 'Sarah Chen',
    service: 'Kitchen Faucet Installation',
    amount: 850,
    status: 'viewed',
    sentDate: new Date('2026-03-25'),
    daysOld: 3,
  },
  {
    id: '3',
    number: 'EST-2026-003',
    customerName: 'Michael O\'Brien',
    service: 'Water Heater Replacement',
    amount: 2200,
    status: 'sent',
    sentDate: new Date('2026-03-27'),
    daysOld: 1,
  },
  {
    id: '4',
    number: 'EST-2026-004',
    customerName: 'Jennifer Williams',
    service: 'Bathroom Remodel Rough-In',
    amount: 5600,
    status: 'draft',
    sentDate: new Date('2026-03-28'),
    daysOld: 0,
  },
  {
    id: '5',
    number: 'EST-2026-005',
    customerName: 'David Rodriguez',
    service: 'Bathroom Fixture Installation',
    amount: 3200,
    status: 'approved',
    sentDate: new Date('2026-03-22'),
    daysOld: 6,
  },
  {
    id: '6',
    number: 'EST-2026-006',
    customerName: 'Lisa Anderson',
    service: 'Water Heater Inspection',
    amount: 1200,
    status: 'rejected',
    sentDate: new Date('2026-03-15'),
    daysOld: 13,
  },
  {
    id: '7',
    number: 'EST-2026-007',
    customerName: 'Robert Thompson',
    service: 'Sewer Line Replacement',
    amount: 8900,
    status: 'sent',
    sentDate: new Date('2026-03-26'),
    daysOld: 2,
  },
  {
    id: '8',
    number: 'EST-2026-008',
    customerName: 'Patricia King',
    service: 'Toilet Replacement',
    amount: 650,
    status: 'expired',
    sentDate: new Date('2026-02-28'),
    daysOld: 29,
  },
  {
    id: '9',
    number: 'EST-2026-009',
    customerName: 'James Davis',
    service: 'Leak Repair and Inspection',
    amount: 2100,
    status: 'viewed',
    sentDate: new Date('2026-03-24'),
    daysOld: 4,
  },
  {
    id: '10',
    number: 'EST-2026-010',
    customerName: 'Michelle Jackson',
    service: 'Pipe Insulation Installation',
    amount: 1800,
    status: 'approved',
    sentDate: new Date('2026-03-19'),
    daysOld: 9,
  },
];

const STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: 'bg-slate-100 text-slate-800 border-slate-300',
  sent: 'bg-blue-100 text-blue-800 border-blue-300',
  viewed: 'bg-amber-100 text-amber-800 border-amber-300',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  expired: 'bg-slate-200 text-slate-800 border-slate-400',
};

export default function EstimatesPage() {
  const { initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [estimates, setEstimates] = useState<Estimate[]>(MOCK_ESTIMATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<EstimateStatus | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) return <div className="p-8">Loading...</div>;

  const filteredEstimates = estimates.filter((est) => {
    const matchesSearch =
      est.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || est.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalEstimates = estimates.length;
  const pendingApproval = estimates.filter(
    (e) => e.status === 'sent' || e.status === 'viewed'
  ).length;
  const approvedThisMonth = estimates.filter(
    (e) =>
      e.status === 'approved' &&
      e.sentDate >= new Date(2026, 2, 1)
  ).length;
  const totalApproved = estimates.filter((e) => e.status === 'approved').length;
  const conversionRate =
    totalEstimates > 0
      ? Math.round((totalApproved / totalEstimates) * 100)
      : 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Estimates</h1>
        <p className="text-slate-600">Create and track customer estimates</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">
                Total Estimates
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {totalEstimates}
              </p>
            </div>
            <FileText className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">
                Pending Approval
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {pendingApproval}
              </p>
            </div>
            <Clock className="w-12 h-12 text-amber-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">
                Approved This Month
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {approvedThisMonth}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-emerald-100" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">
                Conversion Rate
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {conversionRate}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
              <span className="text-xl font-bold text-rose-600">↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search estimates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Create Button */}
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Estimate
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'draft', 'sent', 'viewed', 'approved', 'rejected'] as const).map((status) => {
            const count =
              status === 'all'
                ? totalEstimates
                : estimates.filter((e) => e.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Estimate #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Sent Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEstimates.length > 0 ? (
                filteredEstimates.map((estimate) => (
                  <tr
                    key={estimate.id}
                    onMouseEnter={() => setHoveredRow(estimate.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition ${
                      hoveredRow === estimate.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {estimate.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {estimate.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {estimate.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      ${estimate.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[estimate.status]
                        }`}
                      >
                        {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {estimate.sentDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      <div className="text-xs text-slate-500 mt-1">
                        {estimate.daysOld} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="View">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        {estimate.status === 'draft' && (
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Edit">
                            <Edit2 className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        {estimate.status === 'draft' && (
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Send">
                            <Send className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-slate-500 text-sm">No estimates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Preview Card */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Pricing Tiers Example
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Good',
              description: 'Basic service package',
              price: '$650',
              features: [
                'Service call included',
                'Basic repairs',
                '30-day warranty',
              ],
              color: 'border-slate-200',
            },
            {
              name: 'Better',
              description: 'Standard service + upgrades',
              price: '$1,200',
              features: [
                'Everything in Good',
                'Premium fixtures',
                '1-year warranty',
                'Priority scheduling',
              ],
              color: 'border-blue-300 ring-2 ring-blue-200',
            },
            {
              name: 'Best',
              description: 'Full renovation package',
              price: '$2,500+',
              features: [
                'Everything in Better',
                'Custom design',
                'Lifetime warranty',
                '24/7 support',
                'Free maintenance visits',
              ],
              color: 'border-emerald-300',
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`p-6 border-2 rounded-lg ${tier.color}`}
            >
              <h4 className="text-lg font-semibold text-slate-900 mb-1">
                {tier.name}
              </h4>
              <p className="text-sm text-slate-600 mb-4">{tier.description}</p>
              <div className="text-3xl font-bold text-slate-900 mb-6">
                {tier.price}
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-slate-700 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

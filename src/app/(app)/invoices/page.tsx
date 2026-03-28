'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import {
  Plus,
  Search,
  Eye,
  Bell,
  DollarSign,
  Download,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date;
  sentDate: Date;
  paidDate?: Date;
  daysOverdue?: number;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'INV-2026-001',
    customerName: 'John Martinez',
    amount: 3500,
    status: 'paid',
    dueDate: new Date('2026-03-20'),
    sentDate: new Date('2026-03-05'),
    paidDate: new Date('2026-03-18'),
  },
  {
    id: '2',
    number: 'INV-2026-002',
    customerName: 'Sarah Chen',
    amount: 850,
    status: 'overdue',
    dueDate: new Date('2026-02-20'),
    sentDate: new Date('2026-02-05'),
    daysOverdue: 37,
  },
  {
    id: '3',
    number: 'INV-2026-003',
    customerName: 'Michael O\'Brien',
    amount: 2200,
    status: 'sent',
    dueDate: new Date('2026-04-10'),
    sentDate: new Date('2026-03-25'),
  },
  {
    id: '4',
    number: 'INV-2026-004',
    customerName: 'Jennifer Williams',
    amount: 5600,
    status: 'viewed',
    dueDate: new Date('2026-04-15'),
    sentDate: new Date('2026-03-28'),
  },
  {
    id: '5',
    number: 'INV-2026-005',
    customerName: 'David Rodriguez',
    amount: 3200,
    status: 'paid',
    dueDate: new Date('2026-03-25'),
    sentDate: new Date('2026-03-10'),
    paidDate: new Date('2026-03-22'),
  },
  {
    id: '6',
    number: 'INV-2026-006',
    customerName: 'Lisa Anderson',
    amount: 1200,
    status: 'overdue',
    dueDate: new Date('2026-02-28'),
    sentDate: new Date('2026-02-10'),
    daysOverdue: 29,
  },
  {
    id: '7',
    number: 'INV-2026-007',
    customerName: 'Robert Thompson',
    amount: 8900,
    status: 'paid',
    dueDate: new Date('2026-03-15'),
    sentDate: new Date('2026-03-01'),
    paidDate: new Date('2026-03-14'),
  },
  {
    id: '8',
    number: 'INV-2026-008',
    customerName: 'Patricia King',
    amount: 650,
    status: 'draft',
    dueDate: new Date('2026-04-20'),
    sentDate: new Date('2026-03-28'),
  },
  {
    id: '9',
    number: 'INV-2026-009',
    customerName: 'James Davis',
    amount: 2100,
    status: 'sent',
    dueDate: new Date('2026-04-08'),
    sentDate: new Date('2026-03-26'),
  },
  {
    id: '10',
    number: 'INV-2026-010',
    customerName: 'Michelle Jackson',
    amount: 1800,
    status: 'paid',
    dueDate: new Date('2026-03-22'),
    sentDate: new Date('2026-03-08'),
    paidDate: new Date('2026-03-20'),
  },
  {
    id: '11',
    number: 'INV-2026-011',
    customerName: 'Christopher Lee',
    amount: 4500,
    status: 'overdue',
    dueDate: new Date('2026-03-15'),
    sentDate: new Date('2026-03-01'),
    daysOverdue: 13,
  },
  {
    id: '12',
    number: 'INV-2026-012',
    customerName: 'Amanda White',
    amount: 1800,
    status: 'paid',
    dueDate: new Date('2026-03-30'),
    sentDate: new Date('2026-03-15'),
    paidDate: new Date('2026-03-28'),
  },
];

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-800 border-slate-300',
  sent: 'bg-blue-100 text-blue-800 border-blue-300',
  viewed: 'bg-amber-100 text-amber-800 border-amber-300',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  overdue: 'bg-rose-100 text-rose-800 border-rose-300',
  cancelled: 'bg-slate-200 text-slate-800 border-slate-400',
};

export default function InvoicesPage() {
  const { initializeSeedData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    initializeSeedData();
  }, []);

  if (!mounted) return <div className="p-8">Loading...</div>;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || inv.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const outstanding = invoices.filter(
    (i) => i.status === 'sent' || i.status === 'viewed' || i.status === 'draft'
  );
  const overdue = invoices.filter((i) => i.status === 'overdue');

  const outstandingAmount = outstanding.reduce((sum, i) => sum + i.amount, 0);
  const paidThisMonth = paidInvoices
    .filter((i) => i.paidDate && i.paidDate.getMonth() === 2)
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = overdue.reduce((sum, i) => sum + i.amount, 0);

  const avgDaysToPay =
    paidInvoices.length > 0
      ? Math.round(
          paidInvoices.reduce((sum, i) => {
            if (!i.paidDate) return sum;
            const days = Math.floor(
              (i.paidDate.getTime() - i.sentDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }, 0) / paidInvoices.length
        )
      : 0;

  const totalCollected = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const collectionRate = totalCollected + outstandingAmount + overdueAmount;
  const collectionPercent =
    collectionRate > 0
      ? Math.round((totalCollected / collectionRate) * 100)
      : 0;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Invoices</h1>
        <p className="text-slate-600">Manage invoices and track payments</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 font-medium">Outstanding</p>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${outstandingAmount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">{outstanding.length} invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 font-medium">Paid This Month</p>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${paidThisMonth.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">{paidInvoices.filter(i => i.paidDate?.getMonth() === 2).length} invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-rose-200 p-6 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 font-medium">Overdue</p>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-rose-600">
            ${overdueAmount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-2">{overdue.length} invoices</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 font-medium">Avg Days to Pay</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{avgDaysToPay}</p>
          <p className="text-xs text-slate-500 mt-2">days from invoice</p>
        </div>
      </div>

      {/* Payment Collection Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Payment Collection</h3>
          <span className="text-2xl font-bold text-emerald-600">{collectionPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
            style={{ width: `${collectionPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-xs text-slate-600 mb-1">Collected</p>
            <p className="text-lg font-semibold text-slate-900">
              ${totalCollected.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Outstanding</p>
            <p className="text-lg font-semibold text-slate-900">
              ${outstandingAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-1">Overdue</p>
            <p className="text-lg font-semibold text-rose-600">
              ${overdueAmount.toLocaleString()}
            </p>
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Create Button */}
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'outstanding', 'paid', 'overdue'] as const).map((status) => {
            let count = 0;
            if (status === 'all') count = invoices.length;
            else if (status === 'outstanding')
              count = invoices.filter((i) => i.status === 'sent' || i.status === 'viewed' || i.status === 'draft').length;
            else if (status === 'paid')
              count = invoices.filter((i) => i.status === 'paid').length;
            else if (status === 'overdue')
              count = invoices.filter((i) => i.status === 'overdue').length;

            return (
              <button
                key={status}
                onClick={() => {
                  if (status === 'all') setFilterStatus('all');
                  else if (status === 'outstanding') setFilterStatus('sent');
                  else setFilterStatus(status as InvoiceStatus);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filterStatus === status || (status === 'outstanding' && filterStatus === 'sent')
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
                  Invoice #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Paid Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onMouseEnter={() => setHoveredRow(invoice.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition ${
                      hoveredRow === invoice.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {invoice.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[invoice.status]
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {invoice.dueDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {invoice.status === 'overdue' && invoice.daysOverdue && (
                        <div className="text-xs text-rose-600 font-semibold mt-1">
                          {invoice.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {invoice.paidDate
                        ? invoice.paidDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="View">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Send Reminder">
                            <Bell className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        {invoice.status !== 'paid' && (
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Record Payment">
                            <DollarSign className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Download PDF">
                          <Download className="w-4 h-4 text-slate-600" />
                        </button>
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
                    <p className="text-slate-500 text-sm">No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

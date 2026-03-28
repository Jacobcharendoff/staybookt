'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Send, DollarSign, Download, Edit2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id;

  // Mock invoice data
  const invoice = {
    id: 'INV-2026-001',
    estimateId: 'EST-2026-001',
    status: 'Partially Paid',
    createdDate: 'Mar 18, 2026',
    dueDate: 'Apr 17, 2026',
    paymentTerms: 'Net 30',
    company: {
      name: 'Growth OS Plumbing Co.',
      address: '1847 Water Lane, Austin, TX 78704',
      phone: '(512) 555-0147',
      email: 'support@growthosplumbing.com'
    },
    customer: {
      name: 'Sarah Johnson',
      address: '4521 Oak Hill Drive, Austin, TX 78731',
      email: 'sarah.johnson@email.com'
    },
    lineItems: [
      { description: 'Water Heater Installation - 50 Gal High-Efficiency', quantity: 1, rate: 1299.00, amount: 1299.00 },
      { description: 'Premium Installation Labor', quantity: 4, rate: 150.00, amount: 600.00 },
      { description: 'Expansion Tank', quantity: 1, rate: 175.00, amount: 175.00 },
      { description: 'Permit Fee', quantity: 1, rate: 85.00, amount: 85.00 },
      { description: '10% Loyalty Discount', quantity: 1, rate: -215.90, amount: -215.90 }
    ],
    subtotal: 2043.10,
    taxRate: 0.0831,
    tax: 169.88,
    total: 2212.98,
    amountPaid: 1500.00,
    balancedue: 712.98,
    payments: [
      { amount: 1000.00, method: 'Visa ending 4242', date: 'Mar 20, 2026' },
      { amount: 500.00, method: 'Check #1247', date: 'Mar 25, 2026' }
    ],
    activity: [
      { event: 'Invoice created', date: 'Mar 18', icon: 'check' },
      { event: 'Sent to customer via email', date: 'Mar 19', icon: 'send' },
      { event: 'Viewed by customer', date: 'Mar 19', icon: 'eye' },
      { event: 'Partial payment received ($1,000)', date: 'Mar 20', icon: 'payment' },
      { event: 'Payment reminder sent', date: 'Mar 24', icon: 'bell' },
      { event: 'Partial payment received ($500)', date: 'Mar 25', icon: 'payment' }
    ]
  };

  const percentagePaid = Math.round((invoice.amountPaid / invoice.total) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/invoices" className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{invoice.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'Draft' ? 'bg-slate-100 text-slate-800' :
                invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {invoice.status}
              </span>
            </div>
            <Link href={`/estimates/${invoice.estimateId}`} className="text-sm text-blue-600 hover:text-blue-700">
              From Estimate {invoice.estimateId}
            </Link>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shadow-sm">
              <Send className="w-4 h-4" />
              Send Invoice
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shadow-sm">
              <DollarSign className="w-4 h-4" />
              Record Payment
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shadow-sm">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 shadow-sm">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Invoice Preview Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="mb-8 pb-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">{invoice.company.name}</h2>
              <p className="text-slate-600 text-sm mt-2">{invoice.company.address}</p>
              <p className="text-slate-600 text-sm">{invoice.company.phone}</p>
              <p className="text-slate-600 text-sm">{invoice.company.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Bill To</h3>
                <p className="font-semibold text-slate-900">{invoice.customer.name}</p>
                <p className="text-sm text-slate-600">{invoice.customer.address}</p>
                <p className="text-sm text-slate-600">{invoice.customer.email}</p>
              </div>
              <div className="text-right text-sm">
                <div className="mb-4">
                  <p className="text-slate-500">Invoice #</p>
                  <p className="font-semibold text-slate-900">{invoice.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-slate-500">Invoice Date</p>
                  <p className="font-semibold text-slate-900">{invoice.createdDate}</p>
                </div>
                <div className="mb-4">
                  <p className="text-slate-500">Due Date</p>
                  <p className="font-semibold text-slate-900">{invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment Terms</p>
                  <p className="font-semibold text-slate-900">{invoice.paymentTerms}</p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-900">{item.description}</td>
                      <td className="text-right py-3 px-4 text-slate-600">{item.quantity}</td>
                      <td className="text-right py-3 px-4 text-slate-600">${item.rate.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 font-medium text-slate-900">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (8.31%)</span>
                  <span className="font-medium text-slate-900">${invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-slate-900">${invoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="text-slate-600">Amount Paid</span>
                  <span className="font-medium text-green-600">${invoice.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">Balance Due</span>
                  <span className="font-bold text-lg text-slate-900">${invoice.balancedue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment History</h3>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">{percentagePaid}% Paid</span>
                <span className="text-sm font-medium text-slate-900">${invoice.amountPaid.toFixed(2)} of ${invoice.total.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentagePaid}%` }}></div>
              </div>
            </div>

            <div className="space-y-4">
              {invoice.payments.map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">Payment received - ${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-slate-600">{payment.method} • {payment.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">+${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Log</h3>
            <div className="space-y-4">
              {invoice.activity.map((activity, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{activity.event}</p>
                    <p className="text-sm text-slate-500 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Options</h3>

            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-4">
              Accept Credit Card
            </button>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-semibold text-slate-900 mb-4">Record Manual Payment</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input type="number" placeholder="$0.00" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Method</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Cash</option>
                    <option>Check</option>
                    <option>Card</option>
                    <option>Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reference #</label>
                  <input type="text" placeholder="Check #, etc." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm">
                  Record Payment
                </button>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-sm border border-slate-200">
              Send Payment Reminder
            </button>
          </div>

          {/* Balance Due Highlight */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <p className="text-sm text-amber-900 font-medium mb-2">Balance Due</p>
            <p className="text-3xl font-bold text-amber-900">${invoice.balancedue.toFixed(2)}</p>
            <p className="text-xs text-amber-700 mt-3">Due {invoice.dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Download,
  Edit2,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
} from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface PricingTier {
  name: 'good' | 'better' | 'best';
  label: string;
  description: string;
  items: LineItem[];
  recommended?: boolean;
}

interface ActivityLogEntry {
  action: string;
  date: string;
  details?: string;
}

const mockEstimateData = {
  '1': {
    number: 'EST-2026-001',
    status: 'approved',
    customerName: 'John Martinez',
    email: 'john.martinez@email.com',
    phone: '(555) 123-4567',
    propertyAddress: '1847 Oak Street, Portland, OR 97201',
    createdDate: 'Mar 25, 2026',
    validUntil: 'Apr 25, 2026',
    assignedTech: 'Mike Johnson',
    tiers: [
      {
        name: 'good',
        label: 'Good',
        description: 'Basic service package',
        items: [
          { id: '1', description: 'Standard Water Heater (40 gal)', qty: 1, unitPrice: 899 },
          { id: '2', description: 'Basic Installation Labor', qty: 1, unitPrice: 450 },
          { id: '3', description: 'Permit Fee', qty: 1, unitPrice: 85 },
        ],
      },
      {
        name: 'better',
        label: 'Better',
        description: 'Enhanced service with premium components',
        recommended: true,
        items: [
          { id: '1', description: 'High-Efficiency Water Heater (50 gal)', qty: 1, unitPrice: 1299 },
          { id: '2', description: 'Premium Installation Labor', qty: 1, unitPrice: 650 },
          { id: '3', description: 'Expansion Tank', qty: 1, unitPrice: 175 },
          { id: '4', description: 'Permit Fee', qty: 1, unitPrice: 85 },
        ],
      },
      {
        name: 'best',
        label: 'Best',
        description: 'Premium service with top-tier equipment',
        items: [
          { id: '1', description: 'Tankless Water Heater (Navien)', qty: 1, unitPrice: 2499 },
          { id: '2', description: 'Premium Installation + Venting', qty: 1, unitPrice: 1200 },
          { id: '3', description: 'Recirculating Pump', qty: 1, unitPrice: 450 },
          { id: '4', description: 'Expansion Tank', qty: 1, unitPrice: 175 },
          { id: '5', description: '10-Year Warranty Extension', qty: 1, unitPrice: 299 },
          { id: '6', description: 'Permit Fee', qty: 1, unitPrice: 85 },
        ],
      },
    ] as PricingTier[],
    notes: 'Installation scheduled for the following week. Customer will need to be present during installation. Please advise on water heater sizing based on household usage.',
    terms: 'Estimates valid for 30 days. A 50% deposit is required to secure the appointment. Final payment due upon completion of work.',
    warranty: 'All materials and labor covered under our standard 1-year warranty. Extended warranty options available.',
    activityLog: [
      { action: 'Estimate created', date: 'Mar 25' },
      { action: 'Sent to customer', date: 'Mar 26' },
      { action: 'Viewed by customer', date: 'Mar 27' },
    ] as ActivityLogEntry[],
  },
  '2': {
    number: 'EST-2026-002',
    status: 'viewed',
    customerName: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(555) 234-5678',
    propertyAddress: '2341 Maple Avenue, Portland, OR 97202',
    createdDate: 'Mar 25, 2026',
    validUntil: 'Apr 25, 2026',
    assignedTech: 'Jessica Martinez',
    tiers: [
      {
        name: 'good',
        label: 'Good',
        description: 'Basic faucet replacement',
        items: [
          { id: '1', description: 'Chrome Kitchen Faucet', qty: 1, unitPrice: 225 },
          { id: '2', description: 'Installation Labor', qty: 1, unitPrice: 400 },
          { id: '3', description: 'Supply Lines & Hardware', qty: 1, unitPrice: 45 },
        ],
      },
      {
        name: 'better',
        label: 'Better',
        description: 'Premium faucet with upgrades',
        recommended: true,
        items: [
          { id: '1', description: 'Premium Stainless Faucet', qty: 1, unitPrice: 550 },
          { id: '2', description: 'Installation Labor', qty: 1, unitPrice: 400 },
          { id: '3', description: 'Water Filter System', qty: 1, unitPrice: 150 },
          { id: '4', description: 'Supply Lines & Hardware', qty: 1, unitPrice: 45 },
        ],
      },
      {
        name: 'best',
        label: 'Best',
        description: 'Luxury faucet system',
        items: [
          { id: '1', description: 'Luxury Pull-Down Faucet', qty: 1, unitPrice: 875 },
          { id: '2', description: 'Premium Installation with Counter Work', qty: 1, unitPrice: 600 },
          { id: '3', description: 'Advanced Water Filter System', qty: 1, unitPrice: 299 },
          { id: '4', description: 'Cabinet Refacing (Optional)', qty: 1, unitPrice: 450 },
          { id: '5', description: 'Supply Lines & Hardware', qty: 1, unitPrice: 75 },
        ],
      },
    ] as PricingTier[],
    notes: 'Customer is interested in water quality improvements. Kitchen renovation planned for summer.',
    terms: 'Estimates valid for 30 days. A 50% deposit is required to secure the appointment. Final payment due upon completion of work.',
    warranty: 'All materials and labor covered under our standard 1-year warranty. Extended warranty options available.',
    activityLog: [
      { action: 'Estimate created', date: 'Mar 25' },
      { action: 'Sent to customer', date: 'Mar 25' },
      { action: 'Viewed by customer', date: 'Mar 27' },
    ] as ActivityLogEntry[],
  },
};

export default function EstimateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const estimate = mockEstimateData[id as keyof typeof mockEstimateData];
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [notesExpanded, setNotesExpanded] = useState(false);

  if (!estimate) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Estimate not found</p>
        </div>
      </div>
    );
  }

  const calculateTierTotal = (tier: PricingTier) => {
    const subtotal = tier.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const tax = subtotal * 0.0831;
    return { subtotal, tax, total: subtotal + tax };
  };

  const statusColor = {
    draft: 'bg-slate-100 text-slate-800',
    sent: 'bg-blue-100 text-blue-800',
    viewed: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
    expired: 'bg-slate-200 text-slate-800',
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold text-slate-900">{estimate.number}</h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColor[estimate.status as keyof typeof statusColor]
                }`}
              >
                {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
              </span>
            </div>
            <p className="text-lg text-slate-700 font-semibold">{estimate.customerName}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
              <Send className="w-4 h-4" />
              Send to Customer
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition">
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
          </div>
        </div>
      </div>

      {/* Estimate Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Customer</p>
          <p className="text-sm font-medium text-slate-900 mb-1">{estimate.customerName}</p>
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
            <Mail className="w-3 h-3" />
            {estimate.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="w-3 h-3" />
            {estimate.phone}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Property Address</p>
          <div className="flex items-start gap-2">
            <MapPin className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-700">{estimate.propertyAddress}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Dates</p>
          <div className="flex items-center gap-2 text-xs text-slate-700 mb-2">
            <Calendar className="w-3 h-3" />
            <span>Created: {estimate.createdDate}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Calendar className="w-3 h-3" />
            <span>Valid until: {estimate.validUntil}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Technician</p>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-slate-500" />
            <p className="text-sm font-medium text-slate-900">{estimate.assignedTech}</p>
          </div>
        </div>
      </div>

      {/* Good / Better / Best Pricing Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Options</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {estimate.tiers.map((tier) => {
            const { subtotal, tax, total } = calculateTierTotal(tier);
            const isSelected = selectedTier === tier.name;
            const isRecommended = tier.recommended;

            return (
              <div
                key={tier.name}
                className={`rounded-xl shadow-sm border-2 transition ${
                  isRecommended
                    ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}
              >
                {isRecommended && (
                  <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-t-[8px] text-center">
                    RECOMMENDED
                  </div>
                )}
                <div className={isRecommended ? '' : ''}>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{tier.label}</h3>
                    <p className="text-sm text-slate-600 mb-4">{tier.description}</p>

                    {/* Line Items */}
                    <div className="mb-6 bg-slate-50 rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left text-xs font-semibold text-slate-600 py-2">Item</th>
                            <th className="text-center text-xs font-semibold text-slate-600 py-2">Qty</th>
                            <th className="text-right text-xs font-semibold text-slate-600 py-2">Price</th>
                            <th className="text-right text-xs font-semibold text-slate-600 py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {tier.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-2 text-slate-700 font-medium">{item.description}</td>
                              <td className="text-center text-slate-600">{item.qty}</td>
                              <td className="text-right text-slate-600">${item.unitPrice}</td>
                              <td className="text-right font-semibold text-slate-900">
                                ${(item.qty * item.unitPrice).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="text-slate-700">${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax (8.31%)</span>
                        <span className="text-slate-700">${tax.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                        <span className="text-slate-900">Total</span>
                        <span className="text-slate-900">${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Select Button */}
                    <button
                      onClick={() => setSelectedTier(tier.name)}
                      className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {isSelected ? 'Selected' : 'Select This Option'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes and Terms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Notes</h3>
          <textarea
            defaultValue={estimate.notes}
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
            placeholder="Add notes for the customer..."
          />
        </div>

        {/* Warranty */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Warranty Information</h3>
          <p className="text-sm text-slate-700 mb-4">{estimate.warranty}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Terms & Conditions</p>
                <p>{estimate.terms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature & Approval Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Approval Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-4">E-Signature</p>
            <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center bg-slate-50">
              <p className="text-sm text-slate-500">Customer signature will appear here</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-4">Approved By</p>
            <input
              type="text"
              placeholder="Customer name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-4">Current Status</p>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900">Awaiting Customer Approval</p>
              <p className="text-xs text-amber-700 mt-2">Sent on Mar 26 · Viewed on Mar 27</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Activity Log</h3>
        <div className="space-y-4">
          {estimate.activityLog.map((entry, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-1" />
                {idx < estimate.activityLog.length - 1 && (
                  <div className="w-0.5 h-12 bg-slate-200 my-2" />
                )}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900">{entry.action}</p>
                <p className="text-sm text-slate-600">{entry.date}</p>
                {entry.details && <p className="text-sm text-slate-700 mt-1">{entry.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

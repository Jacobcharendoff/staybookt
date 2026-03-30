'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Invoice, Estimate } from '@/types';

interface PortalData {
  contact: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  estimates: Estimate[];
  invoices: Invoice[];
}

interface ApiResponse {
  success: boolean;
  data?: PortalData;
  error?: string;
}

export default function PortalPage() {
  const params = useParams();
  const token = params.token as string;

  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const response = await fetch(`/api/portal/${token}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json: ApiResponse = await response.json();

        if (!json.success) {
          setError(json.error || 'Failed to load portal data');
          setLoading(false);
          return;
        }

        if (json.data) {
          setData(json.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portal data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPortalData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Invalid Access</h2>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-4">
            If you believe this is an error, please contact the business directly.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const { contact, estimates, invoices } = data;

  // Calculate totals
  const totalEstimates = estimates.length;
  const approvedEstimates = estimates.filter((e) => e.status === 'approved').length;
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {contact.name}
        </h1>
        <p className="text-lg text-gray-600">View your estimates, invoices, and payment status</p>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-900">{contact.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-gray-900">{contact.phone || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="text-gray-900">{contact.address || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Estimates</p>
          <p className="text-3xl font-bold text-green-600">{totalEstimates}</p>
          <p className="text-xs text-gray-500 mt-2">{approvedEstimates} approved</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Invoices</p>
          <p className="text-3xl font-bold text-green-600">{invoices.length}</p>
          <p className="text-xs text-gray-500 mt-2">
            {invoices.filter((i) => i.status === 'paid').length} paid
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Outstanding</p>
          <p className="text-3xl font-bold text-orange-600">
            ${totalOutstanding.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Amount due</p>
        </div>
      </div>

      {/* Estimates Section */}
      {estimates.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Estimates</h2>
          <div className="space-y-4">
            {estimates.map((estimate) => (
              <Link
                key={estimate.id}
                href={`/portal/${token}/estimates/${estimate.id}`}
                className="block border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Estimate #{estimate.number}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {estimate.service || 'Service'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      ${estimate.tiers?.[0]?.price?.toFixed(2) || '0.00'}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      estimate.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : estimate.status === 'sent' || estimate.status === 'viewed'
                        ? 'bg-blue-100 text-blue-800'
                        : estimate.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Created {new Date(estimate.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Section */}
      {invoices.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Invoices</h2>
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const balanceDue = invoice.total - invoice.amountPaid;
              return (
                <Link
                  key={invoice.id}
                  href={`/portal/${token}/invoices/${invoice.id}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:bg-green-50 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Invoice #{invoice.number}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : balanceDue > 0
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {balanceDue > 0 ? `$${balanceDue.toFixed(2)} Due` : 'Paid'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {invoice.amountPaid > 0 && (
                      <p>Paid: ${invoice.amountPaid.toFixed(2)}</p>
                    )}
                    <p>Created {new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {estimates.length === 0 && invoices.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-2">No estimates or invoices yet</p>
          <p className="text-sm text-gray-500">
            Check back soon or contact the business for updates.
          </p>
        </div>
      )}
    </div>
  );
}

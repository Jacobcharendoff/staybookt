'use client';

import { Contact } from '@/types';
import { LeadSourceBadge } from './LeadSourceBadge';
import { Mail, Phone } from 'lucide-react';

interface ContactRowProps {
  contact: Contact;
  dealCount?: number;
  onClick?: () => void;
}

export function ContactRow({
  contact,
  dealCount = 0,
  onClick,
}: ContactRowProps) {
  return (
    <tr
      className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-900">{contact.name}</p>
          <p className="text-xs text-slate-500 mt-1">{contact.address}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            contact.type === 'customer'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {contact.type === 'customer' ? 'Customer' : 'Lead'}
        </span>
      </td>
      <td className="px-6 py-4">
        <LeadSourceBadge source={contact.source} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="text-slate-600 hover:text-slate-900 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="text-slate-600 hover:text-slate-900 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
          </a>
          <span className="text-sm text-slate-600">{contact.phone}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-sm font-medium text-slate-900">{dealCount}</span>
      </td>
    </tr>
  );
}

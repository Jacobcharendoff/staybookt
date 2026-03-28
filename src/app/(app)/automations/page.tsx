'use client';

import { useState } from 'react';
import {
  Star,
  Clock,
  UserPlus,
  Bell,
  RefreshCcw,
  AlertCircle,
  Plus,
  ToggleLeft,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  lastTriggered: string;
  timesRun: number;
  isActive: boolean;
}

const AUTOMATION_TEMPLATES = [
  {
    id: 'review-request',
    icon: Star,
    title: 'Review Request',
    description: 'Request a Google review 24 hours after job completion',
    trigger: 'Deal moves to Completed',
    action: 'Send SMS + Email',
  },
  {
    id: 'estimate-followup',
    icon: Clock,
    title: 'Estimate Follow-Up',
    description: 'Follow up on unseen estimates after 48 hours',
    trigger: 'Estimate not viewed in 48hrs',
    action: 'Send SMS reminder',
  },
  {
    id: 'new-lead-welcome',
    icon: UserPlus,
    title: 'New Lead Welcome',
    description: 'Send welcome message when a new lead enters pipeline',
    trigger: 'New deal created',
    action: 'Send Email',
  },
  {
    id: 'appointment-reminder',
    icon: Bell,
    title: 'Appointment Reminder',
    description: 'Remind customer 24hrs before scheduled job',
    trigger: '24hrs before scheduled date',
    action: 'Send SMS',
  },
  {
    id: 'seasonal-reactivation',
    icon: RefreshCcw,
    title: 'Seasonal Reactivation',
    description: 'Re-engage customers with no activity in 6 months',
    trigger: 'No activity for 180 days',
    action: 'Send Email campaign',
  },
  {
    id: 'invoice-reminder',
    icon: AlertCircle,
    title: 'Invoice Reminder',
    description: 'Send payment reminder for overdue invoices',
    trigger: 'Invoice overdue by 7 days',
    action: 'Send Email + SMS',
  },
];

const ACTIVE_AUTOMATIONS: Automation[] = [
  {
    id: '1',
    name: 'Review Request Follow-up',
    trigger: 'Job completed',
    lastTriggered: '2 hours ago',
    timesRun: 847,
    isActive: true,
  },
  {
    id: '2',
    name: 'New Lead Welcome',
    trigger: 'New deal created',
    lastTriggered: '30 mins ago',
    timesRun: 1203,
    isActive: true,
  },
  {
    id: '3',
    name: 'Estimate Follow-up',
    trigger: 'Estimate not viewed',
    lastTriggered: '4 hours ago',
    timesRun: 562,
    isActive: true,
  },
  {
    id: '4',
    name: 'Payment Reminder',
    trigger: 'Invoice overdue 7 days',
    lastTriggered: '1 day ago',
    timesRun: 341,
    isActive: true,
  },
  {
    id: '5',
    name: 'Appointment Reminder',
    trigger: '24hrs before appointment',
    lastTriggered: '6 hours ago',
    timesRun: 1450,
    isActive: false,
  },
];

export default function AutomationsPage() {
  const [activeAutomations, setActiveAutomations] = useState<Automation[]>(ACTIVE_AUTOMATIONS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderState, setBuilderState] = useState({
    whenTrigger: 'Deal stage changes',
    ifCondition: 'Stage equals',
    thenAction: 'Send SMS',
  });
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const toggleAutomationStatus = (id: string) => {
    setActiveAutomations((prev) =>
      prev.map((auto) => (auto.id === id ? { ...auto, isActive: !auto.isActive } : auto))
    );
  };

  const activateTemplate = (templateId: string) => {
    const template = AUTOMATION_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const newAutomation: Automation = {
        id: Date.now().toString(),
        name: template.title,
        trigger: template.trigger,
        lastTriggered: 'Just activated',
        timesRun: 0,
        isActive: true,
      };
      setActiveAutomations((prev) => [newAutomation, ...prev]);
      setExpandedTemplate(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Automations</h1>
            <p className="text-slate-600 mt-2">
              Set it and forget it. Let Growth OS handle the follow-ups.
            </p>
          </div>
          <button
            onClick={() => setShowBuilder(!showBuilder)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create Automation
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">Active Automations</p>
          <p className="text-3xl font-bold text-slate-900">
            {activeAutomations.filter((a) => a.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">Triggered This Month</p>
          <p className="text-3xl font-bold text-slate-900">147</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">Messages Sent</p>
          <p className="text-3xl font-bold text-slate-900">312</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">Conversion Lift</p>
          <p className="text-3xl font-bold text-green-600">+23%</p>
        </div>
      </div>

      {/* Custom Builder Section - Collapsible */}
      {showBuilder && (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Custom Automation Builder</h2>
            <button
              onClick={() => setShowBuilder(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* WHEN Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
                  1
                </span>
                WHEN
              </h3>
              <select
                value={builderState.whenTrigger}
                onChange={(e) => setBuilderState({ ...builderState, whenTrigger: e.target.value })}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option>Deal stage changes</option>
                <option>New contact added</option>
                <option>Invoice becomes overdue</option>
                <option>No activity for X days</option>
                <option>Scheduled date approaching</option>
              </select>
            </div>

            {/* IF Section */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-lg p-6 border border-purple-100">
              <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-xs font-bold">
                  2
                </span>
                IF
              </h3>
              <div className="space-y-3">
                <select
                  value={builderState.ifCondition}
                  onChange={(e) =>
                    setBuilderState({ ...builderState, ifCondition: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                >
                  <option>Stage equals</option>
                  <option>Contact type is</option>
                  <option>Deal value greater than</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter condition value..."
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add condition
                </button>
              </div>
            </div>

            {/* THEN Section */}
            <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-6 border border-green-100">
              <h3 className="text-sm font-bold text-green-900 mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs font-bold">
                  3
                </span>
                THEN
              </h3>
              <div className="space-y-3">
                <select
                  value={builderState.thenAction}
                  onChange={(e) =>
                    setBuilderState({ ...builderState, thenAction: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-green-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900"
                >
                  <option>Send SMS</option>
                  <option>Send Email</option>
                  <option>Create activity</option>
                  <option>Assign to team member</option>
                  <option>Move to stage</option>
                </select>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add action
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Preview</p>
              <p className="text-slate-600">
                When <span className="font-semibold text-slate-900">{builderState.whenTrigger}</span>{' '}
                and <span className="font-semibold text-slate-900">{builderState.ifCondition}</span>{' '}
                then <span className="font-semibold text-slate-900">{builderState.thenAction}</span>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Automation
              </button>
              <button
                onClick={() => setShowBuilder(false)}
                className="flex-1 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Templates Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Pre-built Automation Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUTOMATION_TEMPLATES.map((template) => {
            const IconComponent = template.icon;
            const isExpanded = expandedTemplate === template.id;

            return (
              <div
                key={template.id}
                className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md ${
                  isExpanded ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <ToggleLeft className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                  {/* Collapsible Details */}
                  <button
                    onClick={() =>
                      setExpandedTemplate(isExpanded ? null : template.id)
                    }
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-4"
                  >
                    <span>Details</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="space-y-3 py-3 border-t border-slate-200 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Trigger</p>
                        <p className="text-sm text-slate-900 mt-1">{template.trigger}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase">Action</p>
                        <p className="text-sm text-slate-900 mt-1">{template.action}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer - Activation Button */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                  <button
                    onClick={() => activateTemplate(template.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Activate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Automations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Active Automations</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Trigger</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">
                  Last Triggered
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700">
                  Times Run
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeAutomations.map((automation, idx) => (
                <tr
                  key={automation.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    idx === activeAutomations.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {automation.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{automation.trigger}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{automation.lastTriggered}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-900 font-medium">
                    {automation.timesRun.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleAutomationStatus(automation.id)}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                        automation.isActive ? 'bg-green-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          automation.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeAutomations.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No automations yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Trial Onboarding Email Sequence for GrowthOS
 * 7 emails over 14 days designed to drive activation and conversion
 */

export interface TrialEmail {
  day: number;
  subject: string;
  previewText: string;
  html: string;
  cta: {
    url: string;
    label: string;
  };
}

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const buttonStyles = `
  display: inline-block;
  padding: 12px 32px;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  margin: 20px 0;
  text-align: center;
`;

const footerStyles = `
  border-top: 1px solid #e5e7eb;
  margin-top: 40px;
  padding-top: 20px;
  color: #6b7280;
  font-size: 12px;
`;

export const trialEmails: Record<number, TrialEmail> = {
  0: {
    day: 0,
    subject: "You're in. Let's book your first job.",
    previewText: "Welcome to GrowthOS — complete your setup in 2 minutes",
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 28px;">Welcome to GrowthOS, {{firstName}}!</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          You're in. Your 14-day trial is live, and your pipeline is ready for leads.
        </p>

        <p style="margin-bottom: 16px;">
          Here's what you're getting:
        </p>

        <ul style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">📋 <strong>Smart Pipeline</strong> — Drag and drop leads through stages</li>
          <li style="margin-bottom: 12px;">⚡ <strong>Autopilot</strong> — Automated follow-ups and reminders</li>
          <li style="margin-bottom: 12px;">💰 <strong>Estimates</strong> — Generate in 30 seconds with tax auto-calculated</li>
          <li style="margin-bottom: 12px;">📱 <strong>Mobile App</strong> — Manage everything on the go</li>
        </ul>

        <p style="margin-bottom: 24px;">
          Let's get you set up. All it takes is 2 minutes to confirm your company info and you'll be ready to add your first contact.
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Complete Setup Now
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          Need help? Reply to this email or check out our <a href="{{docsUrl}}" style="color: #27ae60; text-decoration: none;">quick start guide</a>.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/setup',
      label: 'Complete Setup',
    },
  },

  1: {
    day: 1,
    subject: 'Your first lead is 60 seconds away',
    previewText: 'Adding your first contact to GrowthOS — dead simple',
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">Your pipeline is waiting.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 16px;">
          You've got your company info set up — perfect. Now let's add your first contact.
        </p>

        <p style="margin-bottom: 16px;">
          Here's the beautiful part: no forms, no complexity. Just:
        </p>

        <ol style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">Type in a name and phone</li>
          <li style="margin-bottom: 12px;">Select a job type</li>
          <li style="margin-bottom: 12px;">Done — they're in your pipeline</li>
        </ol>

        <p style="margin-bottom: 24px;">
          Start here. Add one contact and you'll see why GrowthOS beats spreadsheets by a mile.
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Add Your First Contact
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          Already added someone? Great — now try dragging them to a different pipeline stage. That's the magic.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/contacts',
      label: 'Add Your First Contact',
    },
  },

  3: {
    day: 3,
    subject: 'While you were working, GrowthOS was too',
    previewText: 'Meet Autopilot — the feature that pays for itself',
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">The feature that pays for itself.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 16px;">
          We built GrowthOS to do your follow-ups so you don't have to.
        </p>

        <p style="margin-bottom: 16px;">
          <strong>Autopilot does this:</strong>
        </p>

        <ul style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">📲 Sends automated texts/emails when leads arrive</li>
          <li style="margin-bottom: 12px;">⏰ Reminds you to follow up if a lead goes cold</li>
          <li style="margin-bottom: 12px;">📊 Tracks every interaction in your pipeline</li>
          <li style="margin-bottom: 12px;">⚡ Responds fast — your competitors won't keep up</li>
        </ul>

        <p style="margin-bottom: 16px;">
          One HVAC company using Autopilot? They booked an extra 3 jobs per week just from faster response times.
        </p>

        <p style="margin-bottom: 24px;">
          Speed to Lead wins deals. Turn on Autopilot and watch what happens.
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Turn On Autopilot
        </a>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/automations',
      label: 'Turn On Autopilot',
    },
  },

  5: {
    day: 5,
    subject: 'Estimates in 30 seconds (seriously)',
    previewText: 'Send estimates that actually close',
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">Send estimates like a pro.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 16px;">
          You know what kills deals? Slow estimates.
        </p>

        <p style="margin-bottom: 16px;">
          In GrowthOS, here's how fast you move:
        </p>

        <ul style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">💰 <strong>Type materials and labor</strong> — prices auto-populate</li>
          <li style="margin-bottom: 12px;">📊 <strong>Tax calculates instantly</strong> — HST/GST/PST handled</li>
          <li style="margin-bottom: 12px;">📧 <strong>Send in one click</strong> — customer gets a branded PDF</li>
          <li style="margin-bottom: 12px;">✅ <strong>Track approval</strong> — know when they open it</li>
        </ul>

        <p style="margin-bottom: 24px;">
          The best part? Your numbers stay consistent. No more spreadsheet chaos.
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Create Your First Estimate
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          Tip: Set up your line item templates in Settings first — you'll use them for every estimate.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/estimates',
      label: 'Create Your First Estimate',
    },
  },

  7: {
    day: 7,
    subject: 'He changed one thing',
    previewText: 'How Mike booked 47% more jobs in his first month',
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">How Mike booked 47% more jobs.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 24px;">
          <strong>Mike Reynolds runs an HVAC company in Denver.</strong> When he switched to GrowthOS, he didn't change his marketing. Didn't change his service. Didn't change anything about how he operates.
        </p>

        <p style="margin-bottom: 24px;">
          He changed one thing: <strong>how he manages leads.</strong>
        </p>

        <p style="margin-bottom: 16px;">
          <em>"Before GrowthOS, we were losing leads in Slack messages and notepads. Now everything's in one place. We respond faster. The pipeline is clean. We see what's actually happening."</em>
        </p>

        <p style="margin-bottom: 16px;">
          <strong>The result?</strong> 47% more booked jobs in 30 days. Same team. Same market. Better system.
        </p>

        <p style="margin-bottom: 24px;">
          That could be you. You're 7 days in. You've got all the tools. Now let's see what your numbers look like.
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          See Your Dashboard
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          How many leads have you added? How many are in "booked"? Check your dashboard to see your conversion funnel.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/dashboard',
      label: 'See Your Dashboard',
    },
  },

  10: {
    day: 10,
    subject: "4 days left — here's what you'd lose",
    previewText: "Your trial is halfway done. Here's the math.",
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">4 days left.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 24px;">
          Your 14-day trial expires in 4 days. Before you decide, let's be honest about what happens next.
        </p>

        <p style="margin-bottom: 16px;">
          <strong>If you keep GrowthOS:</strong>
        </p>

        <ul style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">✅ Everything you've built stays — your pipeline, your leads, your templates</li>
          <li style="margin-bottom: 12px;">✅ Autopilot keeps running — handling follow-ups while you focus on jobs</li>
          <li style="margin-bottom: 12px;">✅ Estimates keep flowing — 30 seconds from job to customer approval</li>
          <li style="margin-bottom: 12px;">✅ Your data stays safe — it's all encrypted and backed up</li>
        </ul>

        <p style="margin-bottom: 16px;">
          <strong>If you don't upgrade:</strong>
        </p>

        <ul style="margin-bottom: 24px; padding-left: 20px;">
          <li style="margin-bottom: 12px;">❌ Your pipeline disappears</li>
          <li style="margin-bottom: 12px;">❌ Autopilot stops — no more automatic follow-ups</li>
          <li style="margin-bottom: 12px;">❌ You're back to spreadsheets and notepads</li>
          <li style="margin-bottom: 12px;">❌ You lose the system that was just starting to work</li>
        </ul>

        <p style="margin-bottom: 24px;">
          You've already felt the difference. Why go backwards?
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Choose Your Plan
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          Not sure which plan is right for you? <a href="{{supportUrl}}" style="color: #27ae60; text-decoration: none;">We can help</a>.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/pricing',
      label: 'Choose Your Plan',
    },
  },

  13: {
    day: 13,
    subject: "Tomorrow your trial ends",
    previewText: "Last chance — keep everything you've built",
    html: `
      <div style="${baseStyles}">
        <h1 style="color: #27ae60; margin-bottom: 24px; font-size: 24px;">Last day.</h1>

        <p style="font-size: 16px; margin-bottom: 24px;">
          Hi {{firstName}},
        </p>

        <p style="margin-bottom: 24px;">
          Tomorrow at midnight, your trial ends.
        </p>

        <p style="margin-bottom: 24px;">
          No judgment either way. But we want to be clear about what's at stake:
        </p>

        <p style="margin-bottom: 24px; padding: 16px; background-color: #f0fdf4; border-left: 4px solid #27ae60; border-radius: 4px;">
          <strong>Your pipeline. Your automations. Your leads. They're all here waiting.</strong>
        </p>

        <p style="margin-bottom: 24px;">
          Everything you've built over the last 14 days — every contact, every deal, every automation rule — it's ready to work for you. It just needs you to say yes.
        </p>

        <p style="margin-bottom: 24px;">
          This is the moment. You know what works. You know what GrowthOS can do. The only question left is: do you want to keep it?
        </p>

        <a href="{{ctaUrl}}" style="${buttonStyles}">
          Keep Everything — Upgrade Now
        </a>

        <p style="color: #6b7280; font-size: 14px; margin-top: 24px; margin-bottom: 24px;">
          If you have questions about pricing or need a custom plan, <a href="{{supportUrl}}" style="color: #27ae60; text-decoration: none;">reach out to us</a>. We're here.
        </p>

        <p style="margin-bottom: 0; font-size: 14px; color: #6b7280;">
          No credit card required to upgrade. You're already set up. Just choose your plan and keep going.
        </p>

        <div style="${footerStyles}">
          <p style="margin: 0; margin-bottom: 8px;">
            GrowthOS — Pipeline Management for Field Service
          </p>
          <p style="margin: 0;">
            <a href="{{unsubscribeUrl}}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
    cta: {
      url: '/pricing',
      label: 'Keep Everything — Upgrade Now',
    },
  },
};

/**
 * Get trial email for a specific day
 */
export function getTrialEmail(day: number): TrialEmail | null {
  return trialEmails[day] || null;
}

/**
 * Render trial email with variables
 */
export function renderTrialEmail(
  email: TrialEmail,
  variables: Record<string, string>
): {
  subject: string;
  html: string;
} {
  let html = email.html;
  let subject = email.subject;

  // Standard variables
  const allVars = {
    ...variables,
    ctaUrl: variables.ctaUrl || email.cta.url,
  };

  // Replace all {{variable}} with values
  Object.entries(allVars).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), value);
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, html };
}

/**
 * Get all trial email days in order
 */
export function getAllTrialEmailDays(): number[] {
  return Object.keys(trialEmails)
    .map(Number)
    .sort((a, b) => a - b);
}

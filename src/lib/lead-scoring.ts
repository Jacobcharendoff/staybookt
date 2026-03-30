export interface LeadScore {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  label: string; // "Hot Lead", "Warm Lead", "Cold Lead", etc.
  factors: ScoreFactor[]; // What contributed to the score
  recommendations: string[]; // What to do next
  priority: "urgent" | "high" | "medium" | "low";
}

export interface ScoreFactor {
  name: string;
  points: number;
  maxPoints: number;
  description: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date | string;
}

export interface Deal {
  id: string;
  contactId: string;
  value: number;
  status: "booked" | "in_progress" | "estimate_scheduled" | "contacted" | "new_lead";
}

export interface Activity {
  id: string;
  contactId: string;
  type: "call" | "email" | "meeting" | "sms" | "note";
  createdAt: Date | string;
}

export interface LeadQualificationInput {
  contact: Contact;
  deals?: Deal[];
  activities?: Activity[];
  source?: "referral" | "existing_customer" | "google_lsa" | "seo" | "gbp" | "neighborhood" | "other";
}

/**
 * Calculate response speed score (0-20)
 * Measures how quickly the lead was contacted after creation
 */
function calculateResponseSpeed(contact: Contact, activities: Activity[]): ScoreFactor {
  const contactActivities = activities.filter((a) => a.contactId === contact.id);

  if (contactActivities.length === 0) {
    return {
      name: "Response Speed",
      points: 0,
      maxPoints: 20,
      description: "No activities yet — lead hasn't been contacted",
    };
  }

  const contactDate = new Date(contact.createdAt);
  const firstActivity = contactActivities.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  const firstActivityDate = new Date(firstActivity.createdAt);
  const diffMinutes = (firstActivityDate.getTime() - contactDate.getTime()) / (1000 * 60);

  let points = 0;
  let description = "";

  if (diffMinutes < 1) {
    points = 20;
    description = "Contacted within 1 minute";
  } else if (diffMinutes < 5) {
    points = 15;
    description = "Contacted within 5 minutes";
  } else if (diffMinutes < 60) {
    points = 10;
    description = "Contacted within 1 hour";
  } else if (diffMinutes < 1440) {
    points = 5;
    description = "Contacted within 24 hours";
  } else {
    points = 0;
    description = `Contacted after ${Math.round(diffMinutes / 60)} hours`;
  }

  return {
    name: "Response Speed",
    points,
    maxPoints: 20,
    description,
  };
}

/**
 * Calculate engagement score (0-20)
 * Measures number of activities (calls, emails, meetings)
 */
function calculateEngagement(contact: Contact, activities: Activity[]): ScoreFactor {
  const contactActivities = activities.filter((a) => a.contactId === contact.id).length;

  let points = 0;
  let description = "";

  if (contactActivities >= 5) {
    points = 20;
    description = "5+ activities";
  } else if (contactActivities >= 3) {
    points = 15;
    description = "3-4 activities";
  } else if (contactActivities >= 1) {
    points = 10;
    description = "1-2 activities";
  } else {
    points = 0;
    description = "No activities";
  }

  return {
    name: "Engagement",
    points,
    maxPoints: 20,
    description,
  };
}

/**
 * Calculate deal value score (0-15)
 * Higher value deals score higher
 */
function calculateDealValue(contact: Contact, deals: Deal[]): ScoreFactor {
  const contactDeal = deals.find((d) => d.contactId === contact.id);

  if (!contactDeal) {
    return {
      name: "Deal Value",
      points: 0,
      maxPoints: 15,
      description: "No deal associated",
    };
  }

  let points = 0;
  let description = "";

  if (contactDeal.value > 10000) {
    points = 15;
    description = `High value: $${contactDeal.value.toLocaleString()}`;
  } else if (contactDeal.value > 5000) {
    points = 12;
    description = `Mid-high value: $${contactDeal.value.toLocaleString()}`;
  } else if (contactDeal.value > 2000) {
    points = 8;
    description = `Mid value: $${contactDeal.value.toLocaleString()}`;
  } else if (contactDeal.value > 500) {
    points = 4;
    description = `Low-mid value: $${contactDeal.value.toLocaleString()}`;
  } else {
    points = 0;
    description = `Low value: $${contactDeal.value.toLocaleString()}`;
  }

  return {
    name: "Deal Value",
    points,
    maxPoints: 15,
    description,
  };
}

/**
 * Calculate source quality score (0-15)
 * Different acquisition sources have different quality scores
 */
function calculateSourceQuality(source: string | undefined): ScoreFactor {
  const sourceMap: Record<string, { points: number; description: string }> = {
    referral: { points: 15, description: "Referral" },
    existing_customer: { points: 12, description: "Existing customer" },
    google_lsa: { points: 10, description: "Google LSA" },
    seo: { points: 8, description: "Organic search" },
    gbp: { points: 6, description: "Google Business Profile" },
    neighborhood: { points: 4, description: "Neighborhood app" },
    other: { points: 2, description: "Other source" },
  };

  const sourceKey = source || "other";
  const sourceData = sourceMap[sourceKey] || sourceMap["other"];

  return {
    name: "Source Quality",
    points: sourceData.points,
    maxPoints: 15,
    description: sourceData.description,
  };
}

/**
 * Calculate recency score (0-10)
 * How recent was the last activity
 */
function calculateRecency(contact: Contact, activities: Activity[]): ScoreFactor {
  const contactActivities = activities.filter((a) => a.contactId === contact.id);

  if (contactActivities.length === 0) {
    return {
      name: "Recency",
      points: 0,
      maxPoints: 10,
      description: "No recent activity",
    };
  }

  const lastActivity = contactActivities.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
  });

  const now = new Date();
  const lastActivityDate = new Date(lastActivity.createdAt);
  const diffDays = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);

  let points = 0;
  let description = "";

  if (diffDays <= 1) {
    points = 10;
    description = "Activity within 1 day";
  } else if (diffDays <= 3) {
    points = 7;
    description = "Activity within 3 days";
  } else if (diffDays <= 7) {
    points = 4;
    description = "Activity within 7 days";
  } else if (diffDays <= 14) {
    points = 2;
    description = "Activity within 14 days";
  } else {
    points = 0;
    description = `Activity ${Math.round(diffDays)} days ago`;
  }

  return {
    name: "Recency",
    points,
    maxPoints: 10,
    description,
  };
}

/**
 * Calculate completeness score (0-10)
 * Measures if contact has phone, email, and/or address
 */
function calculateCompleteness(contact: Contact): ScoreFactor {
  const hasEmail = !!contact.email;
  const hasPhone = !!contact.phone;
  const hasAddress = !!contact.address;

  const completeness = [hasEmail, hasPhone, hasAddress].filter(Boolean).length;

  let points = 0;
  let description = "";

  if (completeness === 3) {
    points = 10;
    description = "Complete contact info";
  } else if (completeness === 2) {
    points = 6;
    description = "Partial contact info (2 of 3)";
  } else if (completeness === 1) {
    points = 3;
    description = "Minimal contact info (1 of 3)";
  } else {
    points = 0;
    description = "No contact details";
  }

  return {
    name: "Completeness",
    points,
    maxPoints: 10,
    description,
  };
}

/**
 * Calculate pipeline stage score (0-10)
 * Where the deal is in the pipeline
 */
function calculatePipelineStage(contact: Contact, deals: Deal[]): ScoreFactor {
  const contactDeal = deals.find((d) => d.contactId === contact.id);

  if (!contactDeal) {
    return {
      name: "Pipeline Stage",
      points: 3,
      maxPoints: 10,
      description: "New lead",
    };
  }

  const stageMap: Record<string, { points: number; description: string }> = {
    booked: { points: 10, description: "Booked/In progress" },
    in_progress: { points: 10, description: "In progress" },
    estimate_scheduled: { points: 8, description: "Estimate scheduled" },
    contacted: { points: 5, description: "Contacted" },
    new_lead: { points: 3, description: "New lead" },
  };

  const stageData = stageMap[contactDeal.status] || stageMap["new_lead"];

  return {
    name: "Pipeline Stage",
    points: stageData.points,
    maxPoints: 10,
    description: stageData.description,
  };
}

/**
 * Generate recommendations based on score and factors
 */
function generateRecommendations(score: number, factors: ScoreFactor[], deals: Deal[], contact: Contact): string[] {
  const recommendations: string[] = [];

  // Find specific factors
  const responseSpeed = factors.find((f) => f.name === "Response Speed");
  const engagement = factors.find((f) => f.name === "Engagement");
  const dealValue = factors.find((f) => f.name === "Deal Value");
  const recency = factors.find((f) => f.name === "Recency");
  const pipelineStage = factors.find((f) => f.name === "Pipeline Stage");

  // Response speed checks
  if (responseSpeed && responseSpeed.points === 0) {
    recommendations.push("Reach out to this lead immediately — no contact yet");
  } else if (responseSpeed && responseSpeed.points < 10) {
    recommendations.push("Follow up quickly to establish initial contact");
  }

  // Engagement checks
  if (engagement && engagement.points === 0) {
    recommendations.push("Schedule a follow-up call to keep this lead warm");
  } else if (engagement && engagement.points < 15 && dealValue && dealValue.points > 8) {
    recommendations.push("High-value lead with low engagement — increase outreach frequency");
  }

  // Recency checks
  if (recency && recency.points === 0) {
    recommendations.push("Lead is going cold — prioritize immediate follow-up");
  } else if (recency && recency.points < 7) {
    recommendations.push("Schedule a check-in call this week");
  }

  // Deal value with engagement
  if (dealValue && dealValue.points >= 12 && engagement && engagement.points < 10) {
    recommendations.push("High-value opportunity at risk — increase contact frequency");
  }

  // Pipeline progression
  if (pipelineStage && pipelineStage.points <= 5) {
    recommendations.push("Move this lead through the pipeline — prepare estimate or proposal");
  }

  // General recommendations based on score
  if (score >= 80) {
    recommendations.push("This is a hot lead — prioritize immediately");
  } else if (score >= 60 && score < 80) {
    recommendations.push("Warm lead with good potential — maintain regular contact");
  } else if (score < 40) {
    recommendations.push("Low-priority lead — nurture periodically or add to email sequence");
  }

  return recommendations;
}

/**
 * Determine priority level based on score and factors
 */
function determinePriority(score: number, factors: ScoreFactor[]): "urgent" | "high" | "medium" | "low" {
  const dealValue = factors.find((f) => f.name === "Deal Value");
  const recency = factors.find((f) => f.name === "Recency");
  const responseSpeed = factors.find((f) => f.name === "Response Speed");

  // Urgent: high value + no contact or cold
  if (dealValue && dealValue.points > 10 && responseSpeed && responseSpeed.points === 0) {
    return "urgent";
  }

  // High: high value or recent activity
  if ((dealValue && dealValue.points > 10) || (recency && recency.points >= 10)) {
    return "high";
  }

  // Medium: moderate score
  if (score >= 50) {
    return "medium";
  }

  return "low";
}

/**
 * Main lead qualification function
 */
export function qualifyLead(input: LeadQualificationInput): LeadScore {
  const { contact, deals = [], activities = [], source } = input;

  // Calculate all factors
  const factors: ScoreFactor[] = [
    calculateResponseSpeed(contact, activities),
    calculateEngagement(contact, activities),
    calculateDealValue(contact, deals),
    calculateSourceQuality(source),
    calculateRecency(contact, activities),
    calculateCompleteness(contact),
    calculatePipelineStage(contact, deals),
  ];

  // Sum the score
  const score = factors.reduce((sum, factor) => sum + factor.points, 0);

  // Determine grade
  let grade: "A" | "B" | "C" | "D" | "F";
  let label: string;

  if (score >= 80) {
    grade = "A";
    label = "Hot Lead";
  } else if (score >= 60) {
    grade = "B";
    label = "Warm Lead";
  } else if (score >= 40) {
    grade = "C";
    label = "Lukewarm Lead";
  } else if (score >= 20) {
    grade = "D";
    label = "Cold Lead";
  } else {
    grade = "F";
    label = "Dead Lead";
  }

  const recommendations = generateRecommendations(score, factors, deals, contact);
  const priority = determinePriority(score, factors);

  return {
    score,
    grade,
    label,
    factors,
    recommendations,
    priority,
  };
}

/**
 * Batch qualify multiple leads
 */
export function qualifyLeads(
  contacts: Contact[],
  deals: Deal[],
  activities: Activity[],
  sources: Map<string, string> = new Map()
): Map<string, LeadScore> {
  const results = new Map<string, LeadScore>();

  for (const contact of contacts) {
    const source = sources.get(contact.id) as any;
    const leadScore = qualifyLead({
      contact,
      deals,
      activities,
      source,
    });
    results.set(contact.id, leadScore);
  }

  return results;
}

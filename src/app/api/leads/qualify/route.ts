import { NextRequest, NextResponse } from "next/server";
import { qualifyLead, qualifyLeads, LeadScore } from "@/lib/lead-scoring";
import type { Contact, Deal, Activity } from "@/lib/lead-scoring";

/**
 * POST /api/leads/qualify
 * Qualifies a single lead
 *
 * Request body:
 * {
 *   contactId: string
 *   contact?: Contact (if not provided, must exist in database)
 *   deals?: Deal[]
 *   activities?: Activity[]
 *   source?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, contact, deals = [], activities = [], source } = body;

    if (!contact && !contactId) {
      return NextResponse.json({ error: "contactId or contact object is required" }, { status: 400 });
    }

    // If contact object is provided, use it directly
    // Otherwise, you would fetch from database here
    const contactData: Contact = contact || {
      id: contactId,
      name: "",
      email: undefined,
      phone: undefined,
      address: undefined,
      createdAt: new Date(),
    };

    const leadScore = qualifyLead({
      contact: contactData,
      deals,
      activities,
      source,
    });

    return NextResponse.json({ success: true, data: leadScore }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/leads/qualify
 * Returns top qualified leads for the organization
 *
 * Query parameters:
 * - limit: number (default: 10, max: 100)
 * - sort: 'score' | 'priority' (default: 'score')
 * - grade: 'A' | 'B' | 'C' | 'D' | 'F' (optional, filter by grade)
 * - priority: 'urgent' | 'high' | 'medium' | 'low' (optional, filter by priority)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100);
    const sort = searchParams.get("sort") || "score";
    const gradeFilter = searchParams.get("grade");
    const priorityFilter = searchParams.get("priority");

    // Note: This is a template endpoint. In a real implementation, you would:
    // 1. Fetch all contacts from your database
    // 2. Fetch all deals for those contacts
    // 3. Fetch all activities for those contacts
    // 4. Call qualifyLeads() to score them all
    // 5. Apply filters and sorting

    // Example response structure:
    const qualifiedLeads: Array<{
      contactId: string;
      contactName: string;
      email: string;
      score: LeadScore;
    }> = [];

    // Filter by grade if specified
    let filtered = qualifiedLeads;
    if (gradeFilter) {
      filtered = filtered.filter((lead) => lead.score.grade === gradeFilter);
    }

    // Filter by priority if specified
    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.score.priority === priorityFilter);
    }

    // Sort
    if (sort === "priority") {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => {
        const aOrder = priorityOrder[a.score.priority as keyof typeof priorityOrder];
        const bOrder = priorityOrder[b.score.priority as keyof typeof priorityOrder];
        return aOrder - bOrder;
      });
    } else {
      // Default sort by score descending
      filtered.sort((a, b) => b.score.score - a.score.score);
    }

    // Apply limit
    const results = filtered.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        data: results,
        total: results.length,
        limit,
        sort,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

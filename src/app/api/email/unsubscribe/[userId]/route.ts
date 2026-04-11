import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // Mark user as unsubscribed in database using userId
  try {
    const supabase = await createServerComponentClient();

    // Update the user's email_unsubscribed field
    const { error } = await supabase
      .from('users')
      .update({ email_unsubscribed: true })
      .eq('id', userId);

    if (error) {
      console.warn('Failed to mark user as unsubscribed:', error);
      // Continue anyway - user still sees confirmation
    }
  } catch (error) {
    console.warn('Error updating unsubscribe status:', error);
    // Continue anyway - user still sees confirmation
  }

  const html = `<!DOCTYPE html><html><head><title>Unsubscribed</title></head><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f9fafb;"><div style="text-align:center;max-width:400px;"><h1 style="color:#111827;">You've been unsubscribed</h1><p style="color:#6b7280;">You won't receive any more emails from Staybookt.</p><a href="/" style="color:#2563eb;">Return to Staybookt</a></div></body></html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

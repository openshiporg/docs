import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { platform, endpoint, events } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🪝 Demo Channel API: Creating webhooks for events: ${events.join(', ')}`);

    const webhooks = [];

    // Map Openfront events to channel events
    const eventMapping: Record<string, string> = {
      "TRACKING_CREATED": "fulfillment.shipped",
      "ORDER_CANCELLED": "purchase.cancelled",
      "ORDER_CHARGEBACKED": "purchase.disputed"
    };

    for (const event of events) {
      const internalEvent = eventMapping[event] || event;
      const webhookId = `demo_webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`🔗 Demo Channel API: Registering webhook: ${internalEvent} -> ${endpoint}`);
      
      webhooks.push({
        id: webhookId,
        endpoint: {
          callbackUrl: endpoint
        },
        events: [internalEvent],
        active: true,
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ webhooks });

  } catch (error) {
    console.error('Demo Channel API Error:', error);
    return NextResponse.json(
      { error: "Webhook creation failed", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
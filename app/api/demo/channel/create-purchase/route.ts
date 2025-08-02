import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory purchase storage for demo
const DEMO_PURCHASES: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const { platform, cartItems, shipping, notes } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🛒 Demo Channel API: Creating purchase with ${cartItems.length} items`);

    // Generate unique purchase ID
    const purchaseId = `PO-DEMO-${Date.now()}`;
    const orderNumber = `#${purchaseId}`;

    // Calculate total price
    const totalPrice = cartItems.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);

    // Check for special items that need special handling
    const hasHighValueItems = cartItems.some((item: any) => 
      parseFloat(item.price) > 500
    );
    
    const hasElectronicsItems = cartItems.some((item: any) =>
      item.productId?.includes('laptop') ||
      item.productId?.includes('monitor') ||
      item.productId?.includes('tablet')
    );

    const hasOutOfStockItems = cartItems.some((item: any) =>
      item.productId?.includes('printer')
    );

    // Process line items
    const processedLineItems = cartItems.map((item: any) => ({
      id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: item.name || `Product ${item.variantId}`,
      quantity: item.quantity,
      variantId: item.variantId,
      productId: item.productId
    }));

    // Store purchase for later tracking
    DEMO_PURCHASES[purchaseId] = {
      id: purchaseId,
      orderNumber,
      cartItems,
      shipping,
      notes,
      status: "processing",
      createdAt: new Date().toISOString(),
      lineItems: processedLineItems
    };

    console.log(`📧 Demo Channel API: Purchase Order Created: ${orderNumber}`);
    console.log(`📦 Demo Channel API: Items:`, processedLineItems);
    console.log(`🚚 Demo Channel API: Ship to: ${shipping?.firstName} ${shipping?.lastName}`);
    console.log(`💰 Demo Channel API: Total: $${totalPrice}`);

    // Special handling for different product types
    if (hasOutOfStockItems) {
      console.log(`⚠️ Demo Channel API: Out of stock item detected - order cannot be processed`);
      return NextResponse.json({
        purchaseId,
        orderNumber,
        totalPrice,
        invoiceUrl: `https://demo-supplier.com/invoices/${purchaseId}`,
        lineItems: processedLineItems,
        status: "item_temporarily_unavailable"
      });
    }

    if (hasHighValueItems) {
      console.log(`💎 Demo Channel API: High-value items detected - additional verification required`);
      return NextResponse.json({
        purchaseId,
        orderNumber,
        totalPrice,
        invoiceUrl: `https://demo-supplier.com/invoices/${purchaseId}`,
        lineItems: processedLineItems,
        status: "pending_verification"
      });
    }

    if (hasElectronicsItems) {
      console.log(`🔌 Demo Channel API: Electronics detected - triggering inventory sync`);
      return NextResponse.json({
        purchaseId,
        orderNumber,
        totalPrice,
        invoiceUrl: `https://demo-supplier.com/invoices/${purchaseId}`,
        lineItems: processedLineItems,
        status: "inventory_sync_in_progress"
      });
    }

    // Regular purchase flow
    return NextResponse.json({
      purchaseId,
      orderNumber,
      totalPrice,
      invoiceUrl: `https://demo-supplier.com/invoices/${purchaseId}`,
      lineItems: processedLineItems,
      status: "processing"
    });

  } catch (error) {
    console.error('Demo Channel API Error:', error);
    return NextResponse.json(
      { error: "Purchase creation failed", details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
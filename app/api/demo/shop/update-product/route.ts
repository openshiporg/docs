import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { platform, productId, variantId, inventory, price } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🔄 Demo Shop API: Updating product ${productId}:${variantId}`);

    const results = [];

    if (price !== undefined) {
      console.log(`💰 Demo Shop API: Price update ${productId}:${variantId} -> $${price}`);
      results.push({
        operation: "price_update",
        productId,
        variantId, 
        oldPrice: "149.99", // Mock old price
        newPrice: price,
        success: true
      });
    }

    if (inventory !== undefined) {
      console.log(`📦 Demo Shop API: Inventory update ${productId}:${variantId} -> ${inventory}`);
      results.push({
        operation: "inventory_update", 
        productId,
        variantId,
        oldInventory: 42, // Mock old inventory
        newInventory: inventory,
        success: true
      });
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Demo Shop API Error:', error);
    return NextResponse.json(
      { error: "Product update failed" }, 
      { status: 500 }
    );
  }
}
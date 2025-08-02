import { NextRequest, NextResponse } from 'next/server';

// Product database with variants
const DEMO_PRODUCTS: Record<string, Record<string, any>> = {
  "headphones001": {
    black: {
      image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=HEADPHONES",
      title: "Wireless Bluetooth Headphones - Midnight Black",
      productId: "headphones001",
      variantId: "black",
      price: "149.99", 
      availableForSale: true,
      inventory: 42,
      inventoryTracked: true,
      productLink: "https://demo-store.com/products/bluetooth-headphones"
    }
  },
  "charger001": {
    "portable": {
      image: "https://via.placeholder.com/300x300/008080/FFFFFF?text=CHARGER",
      title: "Portable Phone Charger - 10000mAh",
      productId: "charger001", 
      variantId: "portable",
      price: "29.99",
      availableForSale: true,
      inventory: 15,
      inventoryTracked: true,
      productLink: "https://demo-store.com/products/phone-charger"
    }
  },
  "watch001": {
    "default": {
      image: "https://via.placeholder.com/300x300/0000FF/FFFFFF?text=WATCH",
      title: "Smart Watch Series 5 - Space Gray",
      productId: "watch001",
      variantId: "default",
      price: "299.00",
      availableForSale: false,
      inventory: 0,
      inventoryTracked: true,
      productLink: "https://demo-store.com/products/smart-watch"
    }
  },
  "cable001": {
    white: {
      image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=CABLE",
      title: "USB Cable - 6ft White",
      productId: "cable001",
      variantId: "white",
      price: "19.99",
      availableForSale: true,
      inventory: 75,
      inventoryTracked: true,
      productLink: "https://demo-store.com/products/usb-cable"
    }
  },
  "mouse001": {
    "blue": {
      image: "https://via.placeholder.com/300x300/4B0082/FFFFFF?text=MOUSE",
      title: "Wireless Mouse - Blue",
      productId: "mouse001",
      variantId: "blue",
      price: "49.99",
      availableForSale: true,
      inventory: 25,
      inventoryTracked: true,
      productLink: "https://demo-store.com/products/wireless-mouse"
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const { platform, productId, variantId } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🔍 Demo Shop API: Getting product ${productId}:${variantId}`);

    const product = DEMO_PRODUCTS[productId]?.[variantId || 'default'];
    
    if (!product) {
      console.log(`❌ Demo Shop API: Product not found: ${productId}:${variantId}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log(`📦 Demo Shop API: Found product: ${product.title}`);

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Demo Shop API Error:', error);
    return NextResponse.json(
      { error: "Product fetch failed" }, 
      { status: 500 }
    );
  }
}
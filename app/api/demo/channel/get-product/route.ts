import { NextRequest, NextResponse } from 'next/server';

// Product database with variants
const DEMO_CHANNEL_PRODUCTS: Record<string, Record<string, any>> = {
  "tablet001": {
    white: {
      image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=TABLET",
      title: "Tablet - 10 inch White",
      productId: "tablet001",
      variantId: "white", 
      price: "299.99",
      availableForSale: true,
      inventory: 150,
      inventoryTracked: true,
      productLink: "https://demo-supplier.com/products/tablet"
    }
  },
  "laptop001": {
    "business": {
      image: "https://via.placeholder.com/300x300/008080/FFFFFF?text=LAPTOP",
      title: "Laptop Computer - Business Edition",
      productId: "laptop001",
      variantId: "business",
      price: "899.99",
      availableForSale: true,
      inventory: 25,
      inventoryTracked: true,
      productLink: "https://demo-supplier.com/products/laptop"
    }
  },
  "keyboard001": {
    "blue-switch": {
      image: "https://via.placeholder.com/300x300/4B0082/FFFFFF?text=KEYBOARD",
      title: "Keyboard - Mechanical Blue Switch",
      productId: "keyboard001",
      variantId: "blue-switch",
      price: "89.99",
      availableForSale: true,
      inventory: 18,
      inventoryTracked: true,
      productLink: "https://demo-supplier.com/products/keyboard"
    }
  },
  "monitor001": {
    "4k": {
      image: "https://via.placeholder.com/300x300/800080/FFFFFF?text=MONITOR",
      title: "Monitor - 27 inch 4K Display",
      productId: "monitor001",
      variantId: "4k",
      price: "399.99",
      availableForSale: true,
      inventory: 12,
      inventoryTracked: true,
      productLink: "https://demo-supplier.com/products/monitor"
    }
  },
  "printer001": {
    "color": {
      image: "https://via.placeholder.com/300x300/000080/FFFFFF?text=PRINTER",
      title: "Printer - Laser Color",
      productId: "printer001",
      variantId: "color",
      price: "199.99",
      availableForSale: false,
      inventory: 0,
      inventoryTracked: true,
      productLink: "https://demo-supplier.com/products/printer"
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

    console.log(`🔍 Demo Channel API: Getting product ${productId}:${variantId}`);

    const product = DEMO_CHANNEL_PRODUCTS[productId]?.[variantId || 'default'];
    
    if (!product) {
      console.log(`❌ Demo Channel API: Product not found: ${productId}:${variantId}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log(`📦 Demo Channel API: Found product: ${product.title}`);

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Demo Channel API Error:', error);
    return NextResponse.json(
      { error: "Product fetch failed" }, 
      { status: 500 }
    );
  }
}
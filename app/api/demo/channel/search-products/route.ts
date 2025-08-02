import { NextRequest, NextResponse } from 'next/server';

// Demo channel fulfillment catalog
const DEMO_CHANNEL_PRODUCTS = [
  {
    image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=TABLET",
    title: "Tablet - 10 inch",
    productId: "tablet001",
    variantId: "white",
    price: "299.99",
    availableForSale: true,
    inventory: 150,
    inventoryTracked: true,
    productLink: "https://demo-supplier.com/products/tablet",
    cursor: "eyJpZCI6InRhYmxldDAwMSJ9"
  },
  {
    image: "https://via.placeholder.com/300x300/008080/FFFFFF?text=LAPTOP",
    title: "Laptop Computer - Business",
    productId: "laptop001", 
    variantId: "business",
    price: "899.99",
    availableForSale: true,
    inventory: 25,
    inventoryTracked: true,
    productLink: "https://demo-supplier.com/products/laptop",
    cursor: "eyJpZCI6ImxhcHRvcDAwMSJ9"
  },
  {
    image: "https://via.placeholder.com/300x300/4B0082/FFFFFF?text=KEYBOARD", 
    title: "Keyboard - Mechanical Blue Switch",
    productId: "keyboard001",
    variantId: "blue-switch",
    price: "89.99",
    availableForSale: true,
    inventory: 18,
    inventoryTracked: true,
    productLink: "https://demo-supplier.com/products/keyboard",
    cursor: "eyJpZCI6ImtleWJvYXJkMDAxIn0="
  },
  {
    image: "https://via.placeholder.com/300x300/800080/FFFFFF?text=MONITOR",
    title: "Monitor - 27 inch 4K",
    productId: "monitor001",
    variantId: "4k",
    price: "399.99",
    availableForSale: true,
    inventory: 12,
    inventoryTracked: true,
    productLink: "https://demo-supplier.com/products/monitor",
    cursor: "eyJpZCI6Im1vbml0b3IwMDEifQ=="
  },
  {
    image: "https://via.placeholder.com/300x300/000080/FFFFFF?text=PRINTER",
    title: "Printer - Laser Color",
    productId: "printer001",
    variantId: "color",
    price: "199.99",
    availableForSale: false, // Out of stock
    inventory: 0,
    inventoryTracked: true,
    productLink: "https://demo-supplier.com/products/printer",
    cursor: "eyJpZCI6InByaW50ZXIwMDEifQ=="
  }
];

export async function POST(request: NextRequest) {
  try {
    const { platform, searchEntry, after } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🔍 Demo Channel API: Searching products with entry: "${searchEntry}"`);

    let filteredProducts = [...DEMO_CHANNEL_PRODUCTS];

    // Filter by search term if provided
    if (searchEntry) {
      filteredProducts = DEMO_CHANNEL_PRODUCTS.filter(product =>
        product.title.toLowerCase().includes(searchEntry.toLowerCase())
      );
    }

    // Simple pagination
    let startIndex = 0;
    if (after) {
      try {
        const decodedCursor = JSON.parse(Buffer.from(after, 'base64').toString());
        startIndex = DEMO_CHANNEL_PRODUCTS.findIndex(p => p.productId === decodedCursor.id) + 1;
      } catch (e) {
        console.warn('Invalid cursor provided:', e);
      }
    }

    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 10);
    const hasNextPage = startIndex + 10 < filteredProducts.length;
    const endCursor = paginatedProducts.length > 0 
      ? paginatedProducts[paginatedProducts.length - 1].cursor 
      : null;

    console.log(`📦 Demo Channel API: Returning ${paginatedProducts.length} products`);

    return NextResponse.json({
      products: paginatedProducts,
      pageInfo: {
        hasNextPage,
        endCursor
      }
    });

  } catch (error) {
    console.error('Demo Channel API Error:', error);
    return NextResponse.json(
      { error: "Product search failed" }, 
      { status: 500 }
    );
  }
}
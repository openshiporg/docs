import { NextRequest, NextResponse } from 'next/server';

// Demo product catalog - sample business products
const DEMO_PRODUCTS = [
  {
    image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=HEADPHONES",
    title: "Wireless Bluetooth Headphones",
    productId: "headphones001", 
    variantId: "black",
    price: "149.99",
    availableForSale: true,
    inventory: 42,
    inventoryTracked: true,
    productLink: "https://demo-store.com/products/bluetooth-headphones",
    cursor: "eyJpZCI6ImhlYWRwaG9uZXMwMDEifQ=="
  },
  {
    image: "https://via.placeholder.com/300x300/008080/FFFFFF?text=CHARGER",
    title: "Portable Phone Charger", 
    productId: "charger001",
    variantId: "portable",
    price: "29.99",
    availableForSale: true,
    inventory: 15,
    inventoryTracked: true,
    productLink: "https://demo-store.com/products/phone-charger",
    cursor: "eyJpZCI6ImNoYXJnZXIwMDEifQ=="
  },
  {
    image: "https://via.placeholder.com/300x300/0000FF/FFFFFF?text=WATCH",
    title: "Smart Watch Series 5",
    productId: "watch001",
    variantId: "default", 
    price: "299.00",
    availableForSale: false,
    inventory: 0,
    inventoryTracked: true,
    productLink: "https://demo-store.com/products/smart-watch",
    cursor: "eyJpZCI6IndhdGNoMDAxIn0="
  },
  {
    image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=CABLE",
    title: "USB Cable - 6ft",
    productId: "cable001",
    variantId: "white",
    price: "19.99",
    availableForSale: true,
    inventory: 75,
    inventoryTracked: true,
    productLink: "https://demo-store.com/products/usb-cable",
    cursor: "eyJpZCI6ImNhYmxlMDAxIn0="
  },
  {
    image: "https://via.placeholder.com/300x300/4B0082/FFFFFF?text=MOUSE",
    title: "Wireless Mouse - Blue",
    productId: "mouse001",
    variantId: "blue",
    price: "49.99",
    availableForSale: true,
    inventory: 25,
    inventoryTracked: true,
    productLink: "https://demo-store.com/products/wireless-mouse",
    cursor: "eyJpZCI6Im1vdXNlMDAxIn0="
  }
];

export async function POST(request: NextRequest) {
  try {
    const { platform, searchEntry, after } = await request.json();

    // Verify access token (in production, use proper authentication)
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🔍 Demo Shop API: Searching products with entry: "${searchEntry}"`);

    let filteredProducts = [...DEMO_PRODUCTS];

    // Filter by search term if provided
    if (searchEntry) {
      filteredProducts = DEMO_PRODUCTS.filter(product =>
        product.title.toLowerCase().includes(searchEntry.toLowerCase())
      );
    }

    // Simple pagination
    let startIndex = 0;
    if (after) {
      try {
        const decodedCursor = JSON.parse(Buffer.from(after, 'base64').toString());
        startIndex = DEMO_PRODUCTS.findIndex(p => p.productId === decodedCursor.id) + 1;
      } catch (e) {
        console.warn('Invalid cursor provided:', e);
      }
    }

    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 10);
    const hasNextPage = startIndex + 10 < filteredProducts.length;
    const endCursor = paginatedProducts.length > 0 
      ? paginatedProducts[paginatedProducts.length - 1].cursor 
      : null;

    console.log(`📦 Demo Shop API: Returning ${paginatedProducts.length} products`);

    return NextResponse.json({
      products: paginatedProducts,
      pageInfo: {
        hasNextPage,
        endCursor
      }
    });

  } catch (error) {
    console.error('Demo Shop API Error:', error);
    return NextResponse.json(
      { error: "Product search failed" }, 
      { status: 500 }
    );
  }
}
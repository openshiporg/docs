import { NextRequest, NextResponse } from 'next/server';

// Demo orders database
const DEMO_ORDERS = [
  {
    orderId: "order001",
    orderName: "#ORDER-001", 
    link: "https://demo-store.com/orders/order001",
    date: "2024-01-15",
    firstName: "John",
    lastName: "Smith",
    streetAddress1: "123 Main Street",
    streetAddress2: "Apt 2B",
    city: "New York", 
    state: "NY",
    zip: "10001",
    country: "United States",
    email: "john@demo-store.com",
    fulfillmentStatus: "unfulfilled",
    financialStatus: "paid",
    totalPrice: "149.99",
    currency: "USD",
    lineItems: [
      {
        lineItemId: "headphones001item001",
        name: "Wireless Bluetooth Headphones",
        quantity: 1,
        image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=HEADPHONES",
        price: "149.99",
        variantId: "black",
        productId: "headphones001"
      }
    ],
    cursor: "eyJpZCI6Im9yZGVyMDAxIn0="
  },
  {
    orderId: "order002", 
    orderName: "#ORDER-002",
    link: "https://demo-store.com/orders/order002",
    date: "2024-01-16",
    firstName: "Jane",
    lastName: "Doe",
    streetAddress1: "456 Oak Avenue",
    streetAddress2: "", 
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
    email: "jane@demo-store.com",
    fulfillmentStatus: "unfulfilled",
    financialStatus: "paid", 
    totalPrice: "29.99",
    currency: "USD",
    lineItems: [
      {
        lineItemId: "charger001item001",
        name: "Portable Phone Charger",
        quantity: 1,
        image: "https://via.placeholder.com/300x300/008080/FFFFFF?text=CHARGER",
        price: "29.99",
        variantId: "portable",
        productId: "charger001"
      }
    ],
    cursor: "eyJpZCI6Im9yZGVyMDAyIn0="
  },
  {
    orderId: "order003",
    orderName: "#ORDER-003", 
    link: "https://demo-store.com/orders/order003",
    date: "2024-01-17",
    firstName: "Mike",
    lastName: "Johnson",
    streetAddress1: "789 Pine Street",
    streetAddress2: "Suite 4A",
    city: "Seattle",
    state: "WA", 
    zip: "98101",
    country: "United States",
    email: "mike@demo-store.com",
    fulfillmentStatus: "unfulfilled",
    financialStatus: "paid",
    totalPrice: "19.99",
    currency: "USD",
    lineItems: [
      {
        lineItemId: "cable001item001",
        name: "USB Cable - 6ft",
        quantity: 1,
        image: "https://via.placeholder.com/300x300/FF0000/FFFFFF?text=CABLE",
        price: "19.99",
        variantId: "white", 
        productId: "cable001"
      }
    ],
    cursor: "eyJpZCI6Im9yZGVyMDAzIn0="
  }
];

export async function POST(request: NextRequest) {
  try {
    const { platform, searchEntry, after } = await request.json();

    // Verify access token
    if (platform.accessToken !== process.env.DEMO_ACCESS_TOKEN && platform.accessToken !== 'demo_token') {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    console.log(`🔍 Demo Shop API: Searching orders with entry: "${searchEntry}"`);

    let filteredOrders = [...DEMO_ORDERS];

    // Filter by search term if provided
    if (searchEntry) {
      filteredOrders = DEMO_ORDERS.filter(order =>
        order.orderName.toLowerCase().includes(searchEntry.toLowerCase()) ||
        order.firstName.toLowerCase().includes(searchEntry.toLowerCase()) ||
        order.lastName.toLowerCase().includes(searchEntry.toLowerCase())
      );
    }

    console.log(`📋 Demo Shop API: Returning ${filteredOrders.length} orders`);

    return NextResponse.json({
      orders: filteredOrders,
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    });

  } catch (error) {
    console.error('Demo Shop API Error:', error);
    return NextResponse.json(
      { error: "Order search failed" }, 
      { status: 500 }
    );
  }
}
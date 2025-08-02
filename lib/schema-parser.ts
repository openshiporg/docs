import type { Node, Edge } from '@xyflow/react';

export interface TableField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  isOptional?: boolean;
  defaultValue?: string;
  isUnique?: boolean;
  isArray?: boolean;
}

interface ParsedModel {
  name: string;
  fields: TableField[];
  relations: {
    field: string;
    model: string;
    relation?: string;
    references?: string;
  }[];
}

function parseFieldType(rawType: string): { type: string; isOptional: boolean; isArray: boolean } {
  let type = rawType;
  const isOptional = type.includes('?');
  const isArray = type.includes('[]');
  
  // Clean up the type
  type = type.replace('?', '').replace('[]', '');
  
  // Map Prisma types to more readable database types
  const typeMap: Record<string, string> = {
    'String': 'varchar',
    'Int': 'int',
    'Boolean': 'boolean',
    'DateTime': 'timestamp',
    'Float': 'decimal',
    'Json': 'json',
  };
  
  return {
    type: typeMap[type] || type.toLowerCase(),
    isOptional,
    isArray
  };
}

export function parsePrismaSchema(schemaContent: string): { models: ParsedModel[]; nodes: Node[]; edges: Edge[] } {
  const models: ParsedModel[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  
  let match;
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelContent = match[2];
    
    const fields: TableField[] = [];
    const relations: ParsedModel['relations'] = [];
    
    // Parse fields
    const fieldLines = modelContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('@@'));
    
    for (const line of fieldLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('@@') || trimmed.startsWith('//')) continue;
      
      // Parse field definition
      const fieldMatch = trimmed.match(/(\w+)\s+([^\s@]+)(?:\s+([^@]*?))?(?:\s+@(.+))?$/);
      if (!fieldMatch) continue;
      
      const [, fieldName, rawFieldType, , attributes] = fieldMatch;
      const { type, isOptional, isArray } = parseFieldType(rawFieldType);
      
      // Check for field attributes
      const isPrimary = attributes?.includes('@id') || false;
      const isUnique = attributes?.includes('@unique') || false;
      const defaultMatch = attributes?.match(/@default\(([^)]+)\)/);
      const defaultValue = defaultMatch ? defaultMatch[1] : undefined;
      
      // Check if this is a relation field
      const relationMatch = attributes?.match(/@relation\("([^"]+)",\s*fields:\s*\[([^\]]+)\],\s*references:\s*\[([^\]]+)\]/);
      const mapMatch = attributes?.match(/@map\("([^"]+)"\)/);
      
      if (relationMatch) {
        relations.push({
          field: fieldName,
          model: type,
          relation: relationMatch[1],
          references: relationMatch[3]
        });
        
        // This is a foreign key field
        fields.push({
          name: mapMatch ? mapMatch[1] : fieldName,
          type: 'varchar', // Relations are typically IDs
          isForeign: true,
          isOptional,
          isArray,
          defaultValue
        });
      } else if (!models.some(m => m.name.toLowerCase() === type.toLowerCase()) && type !== rawFieldType) {
        // This is likely a relation to another model
        relations.push({
          field: fieldName,
          model: type,
        });
      } else {
        // Regular field
        fields.push({
          name: fieldName,
          type,
          isPrimary,
          isUnique,
          isOptional,
          isArray,
          defaultValue
        });
      }
    }
    
    models.push({
      name: modelName,
      fields,
      relations
    });
  }
  
  return {
    models,
    nodes: createNodesFromModels(models),
    edges: createEdgesFromModels(models)
  };
}

function createNodesFromModels(models: ParsedModel[]): Node[] {
  // Calculate positions in a grid-like layout
  const positions = calculateNodePositions(models.length);
  
  return models.map((model, index) => ({
    id: model.name.toLowerCase(),
    type: 'tableNode',
    position: positions[index],
    data: {
      label: model.name,
      fields: model.fields,
    },
  }));
}

function createEdgesFromModels(models: ParsedModel[]): Edge[] {
  const edges: Edge[] = [];
  
  for (const model of models) {
    for (const relation of model.relations) {
      const targetModel = models.find(m => m.name === relation.model);
      if (!targetModel) continue;
      
      // Find the primary key of the target model
      const targetPrimaryKey = targetModel.fields.find(f => f.isPrimary)?.name || 'id';
      
      // Create edge from target model's primary key to source model's foreign key
      edges.push({
        id: `${relation.model.toLowerCase()}-${model.name.toLowerCase()}-${relation.field}`,
        source: relation.model.toLowerCase(),
        target: model.name.toLowerCase(),
        sourceHandle: relation.references || targetPrimaryKey,
        targetHandle: relation.field,
        type: 'custom',
      });
    }
  }
  
  return edges;
}

function calculateNodePositions(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  
  // Create a roughly square grid
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  
  const nodeWidth = 280;
  const nodeHeight = 200;
  const horizontalSpacing = 350;
  const verticalSpacing = 250;
  
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols && index < count; col++) {
      positions.push({
        x: col * horizontalSpacing + 50,
        y: row * verticalSpacing + 50
      });
      index++;
    }
  }
  
  return positions;
}

// Openship schema content
export const openshipSchemaContent = `model User {
  id               String            @id @default(cuid())
  name             String            @default("")
  email            String            @unique @default("")
  password         String
  role             Role?             @relation("User_role", fields: [roleId], references: [id])
  roleId           String?           @map("role")
  shops            Shop[]            @relation("Shop_user")
  channels         Channel[]         @relation("Channel_user")
  orders           Order[]           @relation("Order_user")
  lineItems        LineItem[]        @relation("LineItem_user")
  cartItems        CartItem[]        @relation("CartItem_user")
  shopItems        ShopItem[]        @relation("ShopItem_user")
  channelItems     ChannelItem[]     @relation("ChannelItem_user")
  matches          Match[]           @relation("Match_user")
  links            Link[]            @relation("Link_user")
  trackingDetails  TrackingDetail[]  @relation("TrackingDetail_user")
  shopPlatforms    ShopPlatform[]    @relation("ShopPlatform_user")
  channelPlatforms ChannelPlatform[] @relation("ChannelPlatform_user")
  apiKeys          ApiKey[]          @relation("ApiKey_user")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @default(now())
}

model Role {
  id                     String  @id @default(cuid())
  name                   String  @default("")
  canSeeOtherUsers       Boolean @default(false)
  canEditOtherUsers      Boolean @default(false)
  canManageUsers         Boolean @default(false)
  canManageRoles         Boolean @default(false)
  canAccessDashboard     Boolean @default(false)
  canSeeOtherShops       Boolean @default(false)
  canManageShops         Boolean @default(false)
  canCreateShops         Boolean @default(false)
  canSeeOtherChannels    Boolean @default(false)
  canManageChannels      Boolean @default(false)
  canCreateChannels      Boolean @default(false)
  canSeeOtherOrders      Boolean @default(false)
  canManageOrders        Boolean @default(false)
  canProcessOrders       Boolean @default(false)
  canSeeOtherMatches     Boolean @default(false)
  canManageMatches       Boolean @default(false)
  canCreateMatches       Boolean @default(false)
  canSeeOtherLinks       Boolean @default(false)
  canManageLinks         Boolean @default(false)
  canCreateLinks         Boolean @default(false)
  canManagePlatforms     Boolean @default(false)
  canViewPlatformMetrics Boolean @default(false)
  canManageApiKeys       Boolean @default(false)
  canCreateApiKeys       Boolean @default(false)
  canAccessAnalytics     Boolean @default(false)
  canExportData          Boolean @default(false)
  canManageWebhooks      Boolean @default(false)
  assignedTo             User[]  @relation("User_role")
}

model ShopPlatform {
  id                             String   @id @default(cuid())
  name                           String   @default("")
  appKey                         String   @default("")
  appSecret                      String   @default("")
  orderLinkFunction              String   @default("")
  updateProductFunction          String   @default("")
  getWebhooksFunction            String   @default("")
  deleteWebhookFunction          String   @default("")
  createWebhookFunction          String   @default("")
  searchProductsFunction         String   @default("")
  getProductFunction             String   @default("")
  searchOrdersFunction           String   @default("")
  addTrackingFunction            String   @default("")
  addCartToPlatformOrderFunction String   @default("")
  cancelOrderWebhookHandler      String   @default("")
  createOrderWebhookHandler      String   @default("")
  oAuthFunction                  String   @default("")
  oAuthCallbackFunction          String   @default("")
  shops                          Shop[]   @relation("Shop_platform")
  user                           User?    @relation("ShopPlatform_user", fields: [userId], references: [id])
  userId                         String?  @map("user")
  createdAt                      DateTime @default(now())
  updatedAt                      DateTime @default(now())
}

model ChannelPlatform {
  id                           String    @id @default(cuid())
  name                         String    @default("")
  appKey                       String    @default("")
  appSecret                    String    @default("")
  createPurchaseFunction       String    @default("")
  searchProductsFunction       String    @default("")
  getProductFunction           String    @default("")
  getWebhooksFunction          String    @default("")
  deleteWebhookFunction        String    @default("")
  createWebhookFunction        String    @default("")
  cancelPurchaseWebhookHandler String    @default("")
  createTrackingWebhookHandler String    @default("")
  oAuthFunction                String    @default("")
  oAuthCallbackFunction        String    @default("")
  channels                     Channel[] @relation("Channel_platform")
  user                         User?     @relation("ChannelPlatform_user", fields: [userId], references: [id])
  userId                       String?   @map("user")
  createdAt                    DateTime  @default(now())
  updatedAt                    DateTime  @default(now())
}

model Shop {
  id          String        @id @default(cuid())
  name        String        @default("")
  domain      String        @default("")
  accessToken String        @default("")
  linkMode    String?       @default("sequential")
  metadata    Json?         @default("{}")
  platform    ShopPlatform? @relation("Shop_platform", fields: [platformId], references: [id])
  platformId  String?       @map("platform")
  user        User?         @relation("Shop_user", fields: [userId], references: [id])
  userId      String?       @map("user")
  links       Link[]        @relation("Link_shop")
  orders      Order[]       @relation("Order_shop")
  shopItems   ShopItem[]    @relation("ShopItem_shop")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @default(now())
}

model Channel {
  id           String           @id @default(cuid())
  name         String           @default("")
  domain       String           @default("")
  accessToken  String           @default("")
  metadata     Json?            @default("{}")
  platform     ChannelPlatform? @relation("Channel_platform", fields: [platformId], references: [id])
  platformId   String?          @map("platform")
  user         User?            @relation("Channel_user", fields: [userId], references: [id])
  userId       String?          @map("user")
  links        Link[]           @relation("Link_channel")
  channelItems ChannelItem[]    @relation("ChannelItem_channel")
  cartItems    CartItem[]       @relation("CartItem_channel")
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @default(now())
}

model Order {
  id             String     @id @default(cuid())
  orderId        String     @unique @default("")
  orderName      String     @default("")
  email          String     @default("")
  firstName      String     @default("")
  lastName       String     @default("")
  streetAddress1 String     @default("")
  streetAddress2 String     @default("")
  city           String     @default("")
  state          String     @default("")
  zip            String     @default("")
  country        String     @default("")
  phone          String     @default("")
  currency       String     @default("")
  totalPrice     Float?
  subTotalPrice  Float?
  totalDiscounts Float?
  totalTax       Float?
  linkOrder      Boolean    @default(true)
  matchOrder     Boolean    @default(true)
  processOrder   Boolean    @default(true)
  status         String     @default("PENDING")
  error          String     @default("")
  orderMetadata  Json?
  shop           Shop?      @relation("Order_shop", fields: [shopId], references: [id])
  shopId         String?    @map("shop")
  lineItems      LineItem[] @relation("LineItem_order")
  cartItems      CartItem[] @relation("CartItem_order")
  user           User?      @relation("Order_user", fields: [userId], references: [id])
  userId         String?    @map("user")
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @default(now())
}

model LineItem {
  id         String   @id @default(cuid())
  name       String   @default("")
  image      String   @default("")
  price      Float?
  quantity   Int?
  productId  String   @default("")
  variantId  String   @default("")
  sku        String   @default("")
  lineItemId String   @default("")
  order      Order?   @relation("LineItem_order", fields: [orderId], references: [id])
  orderId    String?  @map("order")
  user       User?    @relation("LineItem_user", fields: [userId], references: [id])
  userId     String?  @map("user")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now())
}

model CartItem {
  id              String           @id @default(cuid())
  name            String           @default("")
  image           String           @default("")
  price           String           @default("")
  quantity        Int?
  productId       String           @default("")
  variantId       String           @default("")
  sku             String           @default("")
  lineItemId      String           @default("")
  url             String           @default("")
  error           String           @default("")
  purchaseId      String           @default("")
  status          String           @default("PENDING")
  order           Order?           @relation("CartItem_order", fields: [orderId], references: [id])
  orderId         String?          @map("order")
  channel         Channel?         @relation("CartItem_channel", fields: [channelId], references: [id])
  channelId       String?          @map("channel")
  trackingDetails TrackingDetail[] @relation("CartItem_trackingDetails")
  user            User?            @relation("CartItem_user", fields: [userId], references: [id])
  userId          String?          @map("user")
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @default(now())
}

model ShopItem {
  id         String   @id @default(cuid())
  quantity   Int?
  productId  String   @default("")
  variantId  String   @default("")
  lineItemId String   @default("")
  matches    Match[]  @relation("Match_input")
  shop       Shop?    @relation("ShopItem_shop", fields: [shopId], references: [id])
  shopId     String?  @map("shop")
  user       User?    @relation("ShopItem_user", fields: [userId], references: [id])
  userId     String?  @map("user")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now())
}

model ChannelItem {
  id         String   @id @default(cuid())
  quantity   Int?
  productId  String   @default("")
  variantId  String   @default("")
  lineItemId String   @default("")
  price      String   @default("")
  matches    Match[]  @relation("ChannelItem_matches")
  channel    Channel? @relation("ChannelItem_channel", fields: [channelId], references: [id])
  channelId  String?  @map("channel")
  user       User?    @relation("ChannelItem_user", fields: [userId], references: [id])
  userId     String?  @map("user")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now())
}

model Match {
  id        String        @id @default(cuid())
  input     ShopItem[]    @relation("Match_input")
  output    ChannelItem[] @relation("ChannelItem_matches")
  user      User?         @relation("Match_user", fields: [userId], references: [id])
  userId    String?       @map("user")
  createdAt DateTime      @default(now())
  updatedAt DateTime      @default(now())
}

model Link {
  id          String   @id @default(cuid())
  rank        Int?     @default(1)
  filters     Json?    @default("[]")
  customWhere Json?    @default("{}")
  shop        Shop?    @relation("Link_shop", fields: [shopId], references: [id])
  shopId      String?  @map("shop")
  channel     Channel? @relation("Link_channel", fields: [channelId], references: [id])
  channelId   String?  @map("channel")
  user        User?    @relation("Link_user", fields: [userId], references: [id])
  userId      String?  @map("user")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())
}

model TrackingDetail {
  id              String     @id @default(cuid())
  trackingCompany String     @default("")
  trackingNumber  String     @default("")
  purchaseId      String     @default("")
  cartItems       CartItem[] @relation("CartItem_trackingDetails")
  user            User?      @relation("TrackingDetail_user", fields: [userId], references: [id])
  userId          String?    @map("user")
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @default(now())
}

model ApiKey {
  id        String   @id @default(cuid())
  user      User?    @relation("ApiKey_user", fields: [userId], references: [id])
  userId    String?  @map("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
}`;

// Default openfront schema data (fallback)
export const openfrontSchemaContent = `// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource postgresql {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model Address {
  id                           String             @id @default(cuid())
  company                      String             @default("")
  firstName                    String             @default("")
  lastName                     String             @default("")
  address1                     String             @default("")
  address2                     String             @default("")
  city                         String             @default("")
  province                     String             @default("")
  postalCode                   String             @default("")
  phone                        String             @default("")
  isBilling                    Boolean            @default(false)
  metadata                     Json?
  country                      Country?           @relation("Address_country", fields: [countryId], references: [id])
  countryId                    String?            @map("country")
  user                         User?              @relation("Address_user", fields: [userId], references: [id])
  userId                       String?            @map("user")
  shippingProviders            ShippingProvider[] @relation("ShippingProvider_fromAddress")
  cart                         Cart?              @relation("Address_cart", fields: [cartId], references: [id])
  cartId                       String?            @map("cart")
  claimOrders                  ClaimOrder[]       @relation("ClaimOrder_address")
  ordersUsingAsBillingAddress  Order[]            @relation("Order_billingAddress")
  ordersUsingAsShippingAddress Order[]            @relation("Order_shippingAddress")
  cartsUsingAsBillingAddress   Cart[]             @relation("Cart_billingAddress")
  cartsUsingAsShippingAddress  Cart[]             @relation("Cart_shippingAddress")
  swaps                        Swap[]             @relation("Swap_address")
  createdAt                    DateTime           @default(now())
  updatedAt                    DateTime           @default(now()) @updatedAt

  @@index([countryId])
  @@index([userId])
  @@index([cartId])
}

model ApiKey {
  id        String   @id @default(cuid())
  user      User?    @relation("ApiKey_user", fields: [userId], references: [id])
  userId    String?  @map("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([userId])
}

model Product {
  id                 String              @id @default(cuid())
  title              String              @default("")
  description        Json                @default("[{\\"type\\":\\"paragraph\\",\\"children\\":[{\\"text\\":\\"\\"}]}]")
  handle             String              @unique @default("")
  subtitle           String              @default("")
  isGiftcard         Boolean             @default(false)
  metadata           Json?
  discountable       Boolean             @default(true)
  status             ProductStatusType   @default(draft)
  externalId         String              @default("")
  productCollections ProductCollection[] @relation("Product_productCollections")
  productCategories  ProductCategory[]   @relation("Product_productCategories")
  shippingProfile    ShippingProfile?    @relation("Product_shippingProfile", fields: [shippingProfileId], references: [id])
  shippingProfileId  String?             @map("shippingProfile")
  productType        ProductType?        @relation("Product_productType", fields: [productTypeId], references: [id])
  productTypeId      String?             @map("productType")
  discountConditions DiscountCondition[] @relation("DiscountCondition_products")
  discountRules      DiscountRule[]      @relation("DiscountRule_products")
  productImages      ProductImage[]      @relation("Product_productImages")
  productOptions     ProductOption[]     @relation("ProductOption_product")
  productTags        ProductTag[]        @relation("Product_productTags")
  taxRates           TaxRate[]           @relation("Product_taxRates")
  productVariants    ProductVariant[]    @relation("ProductVariant_product")
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @default(now()) @updatedAt

  @@index([shippingProfileId])
  @@index([productTypeId])
}

model ProductVariant {
  id                                String               @id @default(cuid())
  title                             String               @default("")
  sku                               String               @default("")
  barcode                           String               @default("")
  ean                               String               @default("")
  upc                               String               @default("")
  inventoryQuantity                 Int
  allowBackorder                    Boolean              @default(false)
  manageInventory                   Boolean              @default(true)
  hsCode                            String               @default("")
  originCountry                     String               @default("")
  midCode                           String               @default("")
  material                          String               @default("")
  metadata                          Json?
  variantRank                       Int?                 @default(0)
  product                           Product?             @relation("ProductVariant_product", fields: [productId], references: [id])
  productId                         String?              @map("product")
  claimItems                        ClaimItem[]          @relation("ClaimItem_productVariant")
  lineItems                         LineItem[]           @relation("LineItem_productVariant")
  prices                            MoneyAmount[]        @relation("MoneyAmount_productVariant")
  productOptionValues               ProductOptionValue[] @relation("ProductOptionValue_productVariants")
  location                          Location?            @relation("ProductVariant_location", fields: [locationId], references: [id])
  locationId                        String?              @map("location")
  stockMovements                    StockMovement[]      @relation("StockMovement_variant")
  measurements                      Measurement[]        @relation("Measurement_productVariant")
  createdAt                         DateTime             @default(now())
  updatedAt                         DateTime             @default(now()) @updatedAt
  from_OrderLineItem_productVariant OrderLineItem[]      @relation("OrderLineItem_productVariant")

  @@index([productId])
  @@index([locationId])
}

model Order {
  id                   String                @id @default(cuid())
  status               OrderStatusType       @default(pending)
  displayId            Int
  email                String                @default("")
  taxRate              Float?
  canceledAt           DateTime?
  metadata             Json?
  idempotencyKey       String                @default("")
  noNotification       Boolean               @default(false)
  externalId           String                @default("")
  shippingAddress      Address?              @relation("Order_shippingAddress", fields: [shippingAddressId], references: [id])
  shippingAddressId    String?               @map("shippingAddress")
  billingAddress       Address?              @relation("Order_billingAddress", fields: [billingAddressId], references: [id])
  billingAddressId     String?               @map("billingAddress")
  currency             Currency?             @relation("Order_currency", fields: [currencyId], references: [id])
  currencyId           String?               @map("currency")
  draftOrder           DraftOrder?           @relation("DraftOrder_order")
  cart                 Cart?                 @relation("Cart_order")
  user                 User?                 @relation("Order_user", fields: [userId], references: [id])
  userId               String?               @map("user")
  region               Region?               @relation("Order_region", fields: [regionId], references: [id])
  regionId             String?               @map("region")
  claimOrders          ClaimOrder[]          @relation("ClaimOrder_order")
  fulfillments         Fulfillment[]         @relation("Fulfillment_order")
  giftCards            GiftCard[]            @relation("GiftCard_order")
  giftCardTransactions GiftCardTransaction[] @relation("GiftCardTransaction_order")
  lineItems            OrderLineItem[]       @relation("OrderLineItem_order")
  discounts            Discount[]            @relation("Discount_orders")
  payments             Payment[]             @relation("Payment_order")
  returns              Return[]              @relation("Return_order")
  shippingMethods      ShippingMethod[]      @relation("ShippingMethod_order")
  swaps                Swap[]                @relation("Swap_order")
  secretKey            String                @default("")
  events               OrderEvent[]          @relation("OrderEvent_order")
  note                 String                @default("")
  shippingLabels       ShippingLabel[]       @relation("ShippingLabel_order")
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  @@index([shippingAddressId])
  @@index([billingAddressId])
  @@index([currencyId])
  @@index([userId])
  @@index([regionId])
}

model Cart {
  id                    String                 @id @default(cuid())
  email                 String                 @default("")
  type                  CartTypeType           @default(default)
  metadata              Json?
  idempotencyKey        String                 @default("")
  context               Json?
  paymentAuthorizedAt   DateTime?
  abandonedEmailSent    Boolean                @default(false)
  user                  User?                  @relation("Cart_user", fields: [userId], references: [id])
  userId                String?                @map("user")
  region                Region?                @relation("Cart_region", fields: [regionId], references: [id])
  regionId              String?                @map("region")
  addresses             Address[]              @relation("Address_cart")
  discounts             Discount[]             @relation("Cart_discounts")
  giftCards             GiftCard[]             @relation("Cart_giftCards")
  draftOrder            DraftOrder?            @relation("Cart_draftOrder", fields: [draftOrderId], references: [id])
  draftOrderId          String?                @unique @map("draftOrder")
  order                 Order?                 @relation("Cart_order", fields: [orderId], references: [id])
  orderId               String?                @unique @map("order")
  lineItems             LineItem[]             @relation("LineItem_cart")
  customShippingOptions CustomShippingOption[] @relation("CustomShippingOption_cart")
  swap                  Swap?                  @relation("Cart_swap", fields: [swapId], references: [id])
  swapId                String?                @unique @map("swap")
  shippingMethods       ShippingMethod[]       @relation("ShippingMethod_cart")
  payment               Payment?               @relation("Cart_payment", fields: [paymentId], references: [id])
  paymentId             String?                @unique @map("payment")
  paymentCollection     PaymentCollection?     @relation("Cart_paymentCollection", fields: [paymentCollectionId], references: [id])
  paymentCollectionId   String?                @unique @map("paymentCollection")
  billingAddress        Address?               @relation("Cart_billingAddress", fields: [billingAddressId], references: [id])
  billingAddressId      String?                @map("billingAddress")
  shippingAddress       Address?               @relation("Cart_shippingAddress", fields: [shippingAddressId], references: [id])
  shippingAddressId     String?                @map("shippingAddress")
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @default(now()) @updatedAt

  @@index([userId])
  @@index([regionId])
  @@index([billingAddressId])
  @@index([shippingAddressId])
}

model Payment {
  id                  String             @id @default(cuid())
  status              PaymentStatusType  @default(pending)
  amount              Int
  currencyCode        String             @default("")
  amountRefunded      Int                @default(0)
  data                Json?
  capturedAt          DateTime?
  canceledAt          DateTime?
  metadata            Json?
  idempotencyKey      String             @default("")
  cart                Cart?              @relation("Cart_payment")
  paymentCollection   PaymentCollection? @relation("Payment_paymentCollection", fields: [paymentCollectionId], references: [id])
  paymentCollectionId String?            @map("paymentCollection")
  swap                Swap?              @relation("Payment_swap", fields: [swapId], references: [id])
  swapId              String?            @unique @map("swap")
  currency            Currency?          @relation("Payment_currency", fields: [currencyId], references: [id])
  currencyId          String?            @map("currency")
  order               Order?             @relation("Payment_order", fields: [orderId], references: [id])
  orderId             String?            @map("order")
  captures            Capture[]          @relation("Capture_payment")
  refunds             Refund[]           @relation("Refund_payment")
  user                User?              @relation("Payment_user", fields: [userId], references: [id])
  userId              String?            @map("user")
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @default(now()) @updatedAt

  @@index([paymentCollectionId])
  @@index([currencyId])
  @@index([orderId])
  @@index([userId])
}

model Store {
  id                  String     @id @default(cuid())
  name                String     @default("Openfront Store")
  defaultCurrencyCode String     @default("usd")
  metadata            Json?
  swapLinkTemplate    String     @default("")
  paymentLinkTemplate String     @default("")
  inviteLinkTemplate  String     @default("")
  currencies          Currency[] @relation("Currency_stores")
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @default(now()) @updatedAt
}

model User {
  id                        String          @id @default(cuid())
  name                      String          @default("")
  email                     String          @unique @default("")
  password                  String
  role                      Role?           @relation("User_role", fields: [roleId], references: [id])
  roleId                    String?         @map("role")
  apiKeys                   ApiKey[]        @relation("ApiKey_user")
  phone                     String          @default("")
  hasAccount                Boolean         @default(false)
  addresses                 Address[]       @relation("Address_user")
  orders                    Order[]         @relation("Order_user")
  orderEvents               OrderEvent[]    @relation("OrderEvent_user")
  carts                     Cart[]          @relation("Cart_user")
  customerGroups            CustomerGroup[] @relation("CustomerGroup_users")
  notifications             Notification[]  @relation("Notification_user")
  payments                  Payment[]       @relation("Payment_user")
  batchJobs                 BatchJob[]      @relation("BatchJob_createdBy")
  team                      Team?           @relation("User_team", fields: [teamId], references: [id])
  teamId                    String?         @map("team")
  teamLead                  Team[]          @relation("Team_leader")
  userField                 UserField?      @relation("User_userField", fields: [userFieldId], references: [id])
  userFieldId               String?         @unique @map("userField")
  onboardingStatus          String?         @default("not_started")
  createdAt                 DateTime        @default(now())
  updatedAt                 DateTime        @default(now()) @updatedAt
  passwordResetToken        String?
  passwordResetIssuedAt     DateTime?
  passwordResetRedeemedAt   DateTime?
  from_OrderEvent_createdBy OrderEvent[]    @relation("OrderEvent_createdBy")

  @@index([roleId])
  @@index([teamId])
}

model Role {
  id                       String   @id @default(cuid())
  name                     String   @default("")
  canAccessDashboard       Boolean  @default(false)
  canReadOrders            Boolean  @default(false)
  canManageOrders          Boolean  @default(false)
  canReadProducts          Boolean  @default(false)
  canManageProducts        Boolean  @default(false)
  canReadFulfillments      Boolean  @default(false)
  canManageFulfillments    Boolean  @default(false)
  canReadUsers             Boolean  @default(false)
  canManageUsers           Boolean  @default(false)
  canReadRoles             Boolean  @default(false)
  canManageRoles           Boolean  @default(false)
  canReadCheckouts         Boolean  @default(false)
  canManageCheckouts       Boolean  @default(false)
  canReadDiscounts         Boolean  @default(false)
  canManageDiscounts       Boolean  @default(false)
  canReadGiftCards         Boolean  @default(false)
  canManageGiftCards       Boolean  @default(false)
  canReadReturns           Boolean  @default(false)
  canManageReturns         Boolean  @default(false)
  canReadSalesChannels     Boolean  @default(false)
  canManageSalesChannels   Boolean  @default(false)
  canReadPayments          Boolean  @default(false)
  canManagePayments        Boolean  @default(false)
  canReadIdempotencyKeys   Boolean  @default(false)
  canManageIdempotencyKeys Boolean  @default(false)
  canReadApps              Boolean  @default(false)
  canManageApps            Boolean  @default(false)
  canManageKeys            Boolean  @default(false)
  canManageOnboarding      Boolean  @default(false)
  assignedTo               User[]   @relation("User_role")
  createdAt                DateTime @default(now())
  updatedAt                DateTime @default(now()) @updatedAt
}

enum ProductStatusType {
  draft
  proposed
  published
  rejected
}

enum CartTypeType {
  default
  swap
  draft_order
  payment_link
  claim
}

enum OrderStatusType {
  pending
  completed
  archived
  canceled
  requires_action
}

enum PaymentStatusType {
  pending
  authorized
  captured
  failed
  canceled
}`;
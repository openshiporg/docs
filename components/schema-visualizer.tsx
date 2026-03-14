"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { Plus, Minus, Maximize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelNode from "@/components/model-node";
import EnumNode from "@/components/enum-node";
import SchemaEdge from "@/components/schema-edge";
import { generateFlowFromDMMF } from "@/lib/dmmf-to-flow";
import type { ModelNodeData, EnumNodeData, DMMFDatamodel } from "@/lib/schema-types";

interface SchemaVisualizerProps {
  schemaId?: string;
}

// Register custom node types and edge types
const nodeTypes = {
  modelNode: ModelNode,
  enumNode: EnumNode,
};

const edgeTypes = {
  custom: SchemaEdge,
  relation: SchemaEdge,
  smoothstep: SchemaEdge,
};

// Embed schema content directly as strings to avoid file system issues
const OPENFRONT_SCHEMA = `
datasource postgresql {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                                           String                   @id @default(cuid())
  user                                         User?                    @relation("Account_user", fields: [userId], references: [id])
  userId                                       String?                  @map("user")
  accountNumber                                String                   @unique @default("")
  title                                        String                   @default("Business Account")
  description                                  String                   @default("Running business account for automated orders placed through API integration")
  totalAmount                                  Int?                     @default(0)
  paidAmount                                   Int?                     @default(0)
  creditLimit                                  Int                      @default(100000)
  currency                                     Currency?                @relation("Account_currency", fields: [currencyId], references: [id])
  currencyId                                   String?                  @map("currency")
  status                                       String                   @default("active")
  dueDate                                      DateTime?
  paidAt                                       DateTime?
  suspendedAt                                  DateTime?
  notApprovedAt                                DateTime?
  accountType                                  String                   @default("business")
  metadata                                     Json?                    @default("{}")
  orders                                       Order[]                  @relation("Order_account")
  lineItems                                    AccountLineItem[]        @relation("AccountLineItem_account")
  invoices                                     Invoice[]                @relation("Invoice_account")
  createdAt                                    DateTime                 @default(now())
  updatedAt                                    DateTime                 @default(now()) @updatedAt
  from_BusinessAccountRequest_generatedAccount BusinessAccountRequest[] @relation("BusinessAccountRequest_generatedAccount")

  @@index([userId])
  @@index([currencyId])
}

model AccountLineItem {
  id               String            @id @default(cuid())
  account          Account?          @relation("AccountLineItem_account", fields: [accountId], references: [id])
  accountId        String?           @map("account")
  order            Order?            @relation("AccountLineItem_order", fields: [orderId], references: [id])
  orderId          String?           @map("order")
  region           Region?           @relation("AccountLineItem_region", fields: [regionId], references: [id])
  regionId         String?           @map("region")
  description      String            @default("Order line item")
  amount           Int
  orderDisplayId   String            @default("")
  itemCount        Int               @default(0)
  paymentStatus    String            @default("unpaid")
  invoiceLineItems InvoiceLineItem[] @relation("InvoiceLineItem_accountLineItem")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @default(now()) @updatedAt

  @@index([accountId])
  @@index([orderId])
  @@index([regionId])
  @@index([orderDisplayId])
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
  id              String            @id @default(cuid())
  name            String            @default("")
  tokenSecret     String
  tokenPreview    String            @default("")
  scopes          Json?             @default("[]")
  status          ApiKeyStatusType? @default(active)
  expiresAt       DateTime?
  lastUsedAt      DateTime?
  usageCount      Json?             @default("{\\"total\\":0,\\"daily\\":{}}")
  restrictedToIPs Json?             @default("[]")
  user            User?             @relation("ApiKey_user", fields: [userId], references: [id])
  userId          String?           @map("user")
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @default(now()) @updatedAt

  @@index([userId])
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

model Country {
  id          String    @id @default(cuid())
  iso2        String    @unique @default("")
  iso3        String    @default("")
  numCode     Int
  name        String    @default("")
  displayName String    @default("")
  region      Region?   @relation("Country_region", fields: [regionId], references: [id])
  regionId    String?   @map("region")
  addresses   Address[] @relation("Address_country")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @default(now()) @updatedAt

  @@index([regionId])
}

model Currency {
  id                             String             @id @default(cuid())
  code                           String             @unique @default("")
  symbol                         String             @default("")
  symbolNative                   String             @default("")
  name                           String             @default("")
  moneyAmounts                   MoneyAmount[]      @relation("MoneyAmount_currency")
  orders                         Order[]            @relation("Order_currency")
  payments                       Payment[]          @relation("Payment_currency")
  regions                        Region[]           @relation("Region_currency")
  stores                         Store[]            @relation("Currency_stores")
  accounts                       Account[]          @relation("Account_currency")
  invoices                       Invoice[]          @relation("Invoice_currency")
  createdAt                      DateTime           @default(now())
  updatedAt                      DateTime           @default(now()) @updatedAt
  from_OrderMoneyAmount_currency OrderMoneyAmount[] @relation("OrderMoneyAmount_currency")
}

model Discount {
  id                  String               @id @default(cuid())
  code                String               @unique @default("")
  isDynamic           Boolean              @default(false)
  isDisabled          Boolean              @default(false)
  stackable           Boolean              @default(false)
  startsAt            DateTime             @default(now())
  endsAt              DateTime?
  metadata            Json?
  usageLimit          Int?
  usageCount          Int                  @default(0)
  validDuration       String               @default("")
  discountRule        DiscountRule?        @relation("Discount_discountRule", fields: [discountRuleId], references: [id])
  discountRuleId      String?              @map("discountRule")
  carts               Cart[]               @relation("Cart_discounts")
  lineItemAdjustments LineItemAdjustment[] @relation("LineItemAdjustment_discount")
  regions             Region[]             @relation("Discount_regions")
  orders              Order[]              @relation("Discount_orders")
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @default(now()) @updatedAt

  @@index([discountRuleId])
}

model Fulfillment {
  id                    String               @id @default(cuid())
  shippedAt             DateTime?
  canceledAt            DateTime?
  data                  Json?
  metadata              Json?
  idempotencyKey        String               @default("")
  noNotification        Boolean              @default(false)
  order                 Order?               @relation("Fulfillment_order", fields: [orderId], references: [id])
  orderId               String?              @map("order")
  claimOrder            ClaimOrder?          @relation("Fulfillment_claimOrder", fields: [claimOrderId], references: [id])
  claimOrderId          String?              @map("claimOrder")
  swap                  Swap?                @relation("Fulfillment_swap", fields: [swapId], references: [id])
  swapId                String?              @map("swap")
  fulfillmentProvider   FulfillmentProvider? @relation("Fulfillment_fulfillmentProvider", fields: [fulfillmentProviderId], references: [id])
  fulfillmentProviderId String?              @map("fulfillmentProvider")
  fulfillmentItems      FulfillmentItem[]    @relation("FulfillmentItem_fulfillment")
  shippingLabels        ShippingLabel[]      @relation("ShippingLabel_fulfillment")
  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @default(now()) @updatedAt

  @@index([orderId])
  @@index([claimOrderId])
  @@index([swapId])
  @@index([fulfillmentProviderId])
}

model GiftCard {
  id                   String                @id @default(cuid())
  code                 String                @unique @default("")
  value                Int
  balance              Int
  isDisabled           Boolean               @default(false)
  endsAt               DateTime?
  metadata             Json?
  order                Order?                @relation("GiftCard_order", fields: [orderId], references: [id])
  orderId              String?               @map("order")
  carts                Cart[]                @relation("Cart_giftCards")
  giftCardTransactions GiftCardTransaction[] @relation("GiftCardTransaction_giftCard")
  region               Region?               @relation("GiftCard_region", fields: [regionId], references: [id])
  regionId             String?               @map("region")
  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @default(now()) @updatedAt

  @@index([orderId])
  @@index([regionId])
}

model Location {
  id          String           @id @default(cuid())
  name        String           @default("")
  description String           @default("")
  address     String           @default("")
  variants    ProductVariant[] @relation("ProductVariant_location")
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @default(now()) @updatedAt
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
  account              Account?              @relation("Order_account", fields: [accountId], references: [id])
  accountId            String?               @map("account")
  accountLineItems     AccountLineItem[]     @relation("AccountLineItem_order")
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
  @@index([accountId])
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
  primaryImage                      ProductImage?        @relation("ProductVariant_primaryImage", fields: [primaryImageId], references: [id])
  primaryImageId                    String?              @map("primaryImage")
  createdAt                         DateTime             @default(now())
  updatedAt                         DateTime             @default(now()) @updatedAt
  from_OrderLineItem_productVariant OrderLineItem[]      @relation("OrderLineItem_productVariant")

  @@index([productId])
  @@index([locationId])
  @@index([primaryImageId])
}

model Region {
  id                           String                @id @default(cuid())
  code                         String                @unique @default("")
  name                         String                @default("")
  taxRate                      Float
  taxCode                      String                @default("")
  metadata                     Json?
  giftCardsTaxable             Boolean               @default(true)
  automaticTaxes               Boolean               @default(true)
  currency                     Currency?             @relation("Region_currency", fields: [currencyId], references: [id])
  currencyId                   String?               @map("currency")
  carts                        Cart[]                @relation("Cart_region")
  countries                    Country[]             @relation("Country_region")
  discounts                    Discount[]            @relation("Discount_regions")
  giftCards                    GiftCard[]            @relation("GiftCard_region")
  moneyAmounts                 MoneyAmount[]         @relation("MoneyAmount_region")
  orders                       Order[]               @relation("Order_region")
  taxProvider                  TaxProvider?          @relation("Region_taxProvider", fields: [taxProviderId], references: [id])
  taxProviderId                String?               @map("taxProvider")
  fulfillmentProviders         FulfillmentProvider[] @relation("FulfillmentProvider_regions")
  paymentProviders             PaymentProvider[]     @relation("PaymentProvider_regions")
  shippingOptions              ShippingOption[]      @relation("ShippingOption_region")
  taxRates                     TaxRate[]             @relation("TaxRate_region")
  shippingProviders            ShippingProvider[]    @relation("Region_shippingProviders")
  accountLineItems             AccountLineItem[]     @relation("AccountLineItem_region")
  createdAt                    DateTime              @default(now())
  updatedAt                    DateTime              @default(now()) @updatedAt
  from_OrderMoneyAmount_region OrderMoneyAmount[]    @relation("OrderMoneyAmount_region")

  @@index([currencyId])
  @@index([taxProviderId])
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
  canReadWebhooks          Boolean  @default(false)
  canManageWebhooks        Boolean  @default(false)
  assignedTo               User[]   @relation("User_role")
  createdAt                DateTime @default(now())
  updatedAt                DateTime @default(now()) @updatedAt
}

model Store {
  id                  String     @id @default(cuid())
  name                String     @default("Openfront Store")
  defaultCurrencyCode String     @default("usd")
  homepageTitle       String     @default("Openfront Next.js Starter")
  homepageDescription String     @default("A performant frontend e-commerce starter template with Next.js 15 and Openfront.")
  logoIcon            String     @default("<svg width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 200 200\\" fill=\\"none\\" xmlns=\\"http://www.w3.org/2000/svg\\"><g clipPath=\\"url(#clip0_238_1296)\\"><path fillRule=\\"evenodd\\" clipRule=\\"evenodd\\" d=\\"M100 0H0L100 100H0L100 200H200L100 100H200L100 0Z\\" fill=\\"currentColor\\" /></g><defs><clipPath id=\\"clip0_238_1296\\"><rect width=\\"200\\" height=\\"200\\" fill=\\"white\\" /></clipPath></defs></svg>")
  logoColor           String     @default("#2b7fff")
  metadata            Json?
  swapLinkTemplate    String     @default("")
  paymentLinkTemplate String     @default("")
  inviteLinkTemplate  String     @default("")
  currencies          Currency[] @relation("Currency_stores")
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @default(now()) @updatedAt
}

model User {
  id                                     String                   @id @default(cuid())
  name                                   String                   @default("")
  email                                  String                   @unique @default("")
  password                               String
  role                                   Role?                    @relation("User_role", fields: [roleId], references: [id])
  roleId                                 String?                  @map("role")
  apiKeys                                ApiKey[]                 @relation("ApiKey_user")
  phone                                  String                   @default("")
  hasAccount                             Boolean                  @default(false)
  addresses                              Address[]                @relation("Address_user")
  orders                                 Order[]                  @relation("Order_user")
  orderEvents                            OrderEvent[]             @relation("OrderEvent_user")
  carts                                  Cart[]                   @relation("Cart_user")
  customerGroups                         CustomerGroup[]          @relation("CustomerGroup_users")
  notifications                          Notification[]           @relation("Notification_user")
  payments                               Payment[]                @relation("Payment_user")
  batchJobs                              BatchJob[]               @relation("BatchJob_createdBy")
  team                                   Team?                    @relation("User_team", fields: [teamId], references: [id])
  teamId                                 String?                  @map("team")
  teamLead                               Team[]                   @relation("Team_leader")
  userField                              UserField?               @relation("User_userField", fields: [userFieldId], references: [id])
  userFieldId                            String?                  @unique @map("userField")
  onboardingStatus                       String?                  @default("not_started")
  accounts                               Account[]                @relation("Account_user")
  invoices                               Invoice[]                @relation("Invoice_user")
  businessAccountRequest                 BusinessAccountRequest?  @relation("BusinessAccountRequest_user")
  customerToken                          String?
  tokenGeneratedAt                       DateTime?
  orderWebhookUrl                        String                   @default("")
  createdAt                              DateTime                 @default(now())
  updatedAt                              DateTime                 @default(now()) @updatedAt
  passwordResetToken                     String?
  passwordResetIssuedAt                  DateTime?
  passwordResetRedeemedAt                DateTime?
  from_BusinessAccountRequest_reviewedBy BusinessAccountRequest[] @relation("BusinessAccountRequest_reviewedBy")
  from_OAuthToken_user                   OAuthToken[]             @relation("OAuthToken_user")
  from_OrderEvent_createdBy              OrderEvent[]             @relation("OrderEvent_createdBy")

  @@index([roleId])
  @@index([teamId])
}

model ClaimOrder {
  id                String                          @id @default(cuid())
  paymentStatus     ClaimOrderPaymentStatusType     @default(na)
  fulfillmentStatus ClaimOrderFulfillmentStatusType @default(not_fulfilled)
  type              ClaimOrderTypeType
  refundAmount      Int?
  canceledAt        DateTime?
  metadata          Json?
  idempotencyKey    String                          @default("")
  noNotification    Boolean                         @default(false)
  address           Address?                        @relation("ClaimOrder_address", fields: [addressId], references: [id])
  addressId         String?                         @map("address")
  order             Order?                          @relation("ClaimOrder_order", fields: [orderId], references: [id])
  orderId           String?                         @map("order")
  claimItems        ClaimItem[]                     @relation("ClaimItem_claimOrder")
  fulfillments      Fulfillment[]                   @relation("Fulfillment_claimOrder")
  lineItems         LineItem[]                      @relation("LineItem_claimOrder")
  return            Return?                         @relation("ClaimOrder_return", fields: [returnId], references: [id])
  returnId          String?                         @unique @map("return")
  shippingMethods   ShippingMethod[]                @relation("ShippingMethod_claimOrder")
  createdAt         DateTime                        @default(now())
  updatedAt         DateTime                        @default(now()) @updatedAt

  @@index([addressId])
  @@index([orderId])
}

model ClaimItem {
  id               String              @id @default(cuid())
  reason           ClaimItemReasonType
  note             String              @default("")
  quantity         Int
  metadata         Json?
  productVariant   ProductVariant?     @relation("ClaimItem_productVariant", fields: [productVariantId], references: [id])
  productVariantId String?             @map("productVariant")
  lineItem         LineItem?           @relation("ClaimItem_lineItem", fields: [lineItemId], references: [id])
  lineItemId       String?             @map("lineItem")
  claimOrder       ClaimOrder?         @relation("ClaimItem_claimOrder", fields: [claimOrderId], references: [id])
  claimOrderId     String?             @map("claimOrder")
  claimImages      ClaimImage[]        @relation("ClaimImage_claimItem")
  claimTags        ClaimTag[]          @relation("ClaimItem_claimTags")
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @default(now()) @updatedAt

  @@index([productVariantId])
  @@index([lineItemId])
  @@index([claimOrderId])
}

model Return {
  id               String           @id @default(cuid())
  status           ReturnStatusType @default(requested)
  shippingData     Json?
  refundAmount     Int
  receivedAt       DateTime?
  metadata         Json?
  idempotencyKey   String           @default("")
  noNotification   Boolean          @default(false)
  claimOrder       ClaimOrder?      @relation("ClaimOrder_return")
  swap             Swap?            @relation("Return_swap", fields: [swapId], references: [id])
  swapId           String?          @unique @map("swap")
  order            Order?           @relation("Return_order", fields: [orderId], references: [id])
  orderId          String?          @map("order")
  returnItems      ReturnItem[]     @relation("ReturnItem_return")
  shippingMethod   ShippingMethod?  @relation("Return_shippingMethod", fields: [shippingMethodId], references: [id])
  shippingMethodId String?          @unique @map("shippingMethod")
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @default(now()) @updatedAt

  @@index([orderId])
}

model Swap {
  id                String                    @id @default(cuid())
  fulfillmentStatus SwapFulfillmentStatusType
  paymentStatus     SwapPaymentStatusType
  differenceDue     Int?
  confirmedAt       DateTime?
  metadata          Json?
  idempotencyKey    String                    @default("")
  noNotification    Boolean                   @default(false)
  canceledAt        DateTime?
  allowBackorder    Boolean                   @default(false)
  cart              Cart?                     @relation("Cart_swap")
  order             Order?                    @relation("Swap_order", fields: [orderId], references: [id])
  orderId           String?                   @map("order")
  address           Address?                  @relation("Swap_address", fields: [addressId], references: [id])
  addressId         String?                   @map("address")
  lineItems         LineItem[]                @relation("LineItem_swap")
  fulfillments      Fulfillment[]             @relation("Fulfillment_swap")
  payment           Payment?                  @relation("Payment_swap")
  return            Return?                   @relation("Return_swap")
  shippingMethods   ShippingMethod[]          @relation("ShippingMethod_swap")
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @default(now()) @updatedAt

  @@index([orderId])
  @@index([addressId])
}

enum ApiKeyStatusType {
  active
  inactive
  revoked
}

enum CartTypeType {
  default
  swap
  draft_order
  payment_link
  claim
}

enum ClaimOrderPaymentStatusType {
  na
  not_refunded
  refunded
}

enum ClaimOrderFulfillmentStatusType {
  not_fulfilled
  partially_fulfilled
  fulfilled
  partially_shipped
  shipped
  partially_returned
  returned
  canceled
  requires_action
}

enum ClaimOrderTypeType {
  refund
  replace
}

enum ClaimItemReasonType {
  missing_item
  wrong_item
  production_failure
  other
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
}

enum ProductStatusType {
  draft
  proposed
  published
  rejected
}

enum ReturnStatusType {
  requested
  received
  requires_action
  canceled
}

enum SwapFulfillmentStatusType {
  not_fulfilled
  fulfilled
  shipped
  partially_shipped
  canceled
  requires_action
}

enum SwapPaymentStatusType {
  not_paid
  awaiting
  captured
  confirmed
  canceled
  difference_refunded
  partially_refunded
  refunded
  requires_action
}
`;

const OPENSHIP_SCHEMA = `
datasource postgresql {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                      String            @id @default(cuid())
  name                    String            @default("")
  email                   String            @unique @default("")
  password                String
  role                    Role?             @relation("User_role", fields: [roleId], references: [id])
  roleId                  String?           @map("role")
  shops                   Shop[]            @relation("Shop_user")
  channels                Channel[]         @relation("Channel_user")
  orders                  Order[]           @relation("Order_user")
  lineItems               LineItem[]        @relation("LineItem_user")
  cartItems               CartItem[]        @relation("CartItem_user")
  shopItems               ShopItem[]        @relation("ShopItem_user")
  channelItems            ChannelItem[]     @relation("ChannelItem_user")
  matches                 Match[]           @relation("Match_user")
  links                   Link[]            @relation("Link_user")
  trackingDetails         TrackingDetail[]  @relation("TrackingDetail_user")
  shopPlatforms           ShopPlatform[]    @relation("ShopPlatform_user")
  channelPlatforms        ChannelPlatform[] @relation("ChannelPlatform_user")
  apiKeys                 ApiKey[]          @relation("ApiKey_user")
  createdAt               DateTime          @default(now())
  updatedAt               DateTime          @default(now())
  passwordResetToken      String?
  passwordResetIssuedAt   DateTime?
  passwordResetRedeemedAt DateTime?

  @@index([roleId])
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

model ApiKey {
  id              String            @id @default(cuid())
  name            String            @default("")
  tokenSecret     String
  tokenPreview    String            @default("")
  scopes          Json?             @default("[]")
  status          ApiKeyStatusType? @default(active)
  expiresAt       DateTime?
  lastUsedAt      DateTime?
  usageCount      Json?             @default("{\\"total\\":0,\\"daily\\":{}}")
  restrictedToIPs Json?             @default("[]")
  user            User?             @relation("ApiKey_user", fields: [userId], references: [id])
  userId          String?           @map("user")
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @default(now())

  @@index([userId])
}

model ShopPlatform {
  id                             String   @id @default(cuid())
  name                           String   @default("")
  appKey                         String   @default("")
  appSecret                      String   @default("")
  searchProductsFunction         String   @default("")
  getProductFunction             String   @default("")
  searchOrdersFunction           String   @default("")
  updateProductFunction          String   @default("")
  createWebhookFunction          String   @default("")
  oAuthFunction                  String   @default("")
  oAuthCallbackFunction          String   @default("")
  createOrderWebhookHandler      String   @default("")
  cancelOrderWebhookHandler      String   @default("")
  addTrackingFunction            String   @default("")
  orderLinkFunction              String   @default("")
  addCartToPlatformOrderFunction String   @default("")
  getWebhooksFunction            String   @default("")
  deleteWebhookFunction          String   @default("")
  shops                          Shop[]   @relation("Shop_platform")
  user                           User?    @relation("ShopPlatform_user", fields: [userId], references: [id])
  userId                         String?  @map("user")
  createdAt                      DateTime @default(now())
  updatedAt                      DateTime @default(now())

  @@index([userId])
}

model ChannelPlatform {
  id                           String    @id @default(cuid())
  name                         String    @default("")
  appKey                       String    @default("")
  appSecret                    String    @default("")
  searchProductsFunction       String    @default("")
  getProductFunction           String    @default("")
  createPurchaseFunction       String    @default("")
  createWebhookFunction        String    @default("")
  oAuthFunction                String    @default("")
  oAuthCallbackFunction        String    @default("")
  createTrackingWebhookHandler String    @default("")
  cancelPurchaseWebhookHandler String    @default("")
  getWebhooksFunction          String    @default("")
  deleteWebhookFunction        String    @default("")
  channels                     Channel[] @relation("Channel_platform")
  user                         User?     @relation("ChannelPlatform_user", fields: [userId], references: [id])
  userId                       String?   @map("user")
  createdAt                    DateTime  @default(now())
  updatedAt                    DateTime  @default(now())

  @@index([userId])
}

model Shop {
  id             String        @id @default(cuid())
  name           String        @default("")
  domain         String        @default("")
  accessToken    String        @default("")
  refreshToken   String        @default("")
  tokenExpiresAt DateTime?
  linkMode       String?       @default("sequential")
  metadata       Json?         @default("{}")
  platform       ShopPlatform? @relation("Shop_platform", fields: [platformId], references: [id])
  platformId     String?       @map("platform")
  user           User?         @relation("Shop_user", fields: [userId], references: [id])
  userId         String?       @map("user")
  links          Link[]        @relation("Link_shop")
  orders         Order[]       @relation("Order_shop")
  shopItems      ShopItem[]    @relation("ShopItem_shop")
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @default(now())

  @@index([platformId])
  @@index([userId])
}

model Channel {
  id             String           @id @default(cuid())
  name           String           @default("")
  domain         String           @default("")
  accessToken    String           @default("")
  refreshToken   String           @default("")
  tokenExpiresAt DateTime?
  metadata       Json?            @default("{}")
  platform       ChannelPlatform? @relation("Channel_platform", fields: [platformId], references: [id])
  platformId     String?          @map("platform")
  user           User?            @relation("Channel_user", fields: [userId], references: [id])
  userId         String?          @map("user")
  links          Link[]           @relation("Link_channel")
  channelItems   ChannelItem[]    @relation("ChannelItem_channel")
  cartItems      CartItem[]       @relation("CartItem_channel")
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @default(now())

  @@index([platformId])
  @@index([userId])
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

  @@index([shopId])
  @@index([userId])
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

  @@index([orderId])
  @@index([userId])
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

  @@index([orderId])
  @@index([channelId])
  @@index([userId])
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

  @@unique([quantity, productId, variantId, shopId, userId])
  @@index([shopId])
  @@index([userId])
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

  @@unique([quantity, productId, variantId, channelId, userId])
  @@index([channelId])
  @@index([userId])
}

model Match {
  id        String        @id @default(cuid())
  input     ShopItem[]    @relation("Match_input")
  output    ChannelItem[] @relation("ChannelItem_matches")
  user      User?         @relation("Match_user", fields: [userId], references: [id])
  userId    String?       @map("user")
  createdAt DateTime      @default(now())
  updatedAt DateTime      @default(now())

  @@index([userId])
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

  @@index([shopId])
  @@index([channelId])
  @@index([userId])
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

  @@index([userId])
}

enum ApiKeyStatusType {
  active
  inactive
  revoked
}
`;

function SchemaVisualizerInner({ schemaId = "openfront" }: SchemaVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ModelNodeData | EnumNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const parseSchema = async () => {
      setLoading(true);
      setError(null);

      try {
        const schemaContent = schemaId === "openship" ? OPENSHIP_SCHEMA : OPENFRONT_SCHEMA;

        const response = await fetch("/api/schema/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schema: schemaContent }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to parse schema");
        }

        const datamodel: DMMFDatamodel = await response.json();
        const { nodes: newNodes, edges: newEdges } = generateFlowFromDMMF(datamodel);

        setNodes(newNodes as any);
        setEdges(newEdges);
      } catch (err) {
        console.error("Schema parsing error:", err);
        setError(err instanceof Error ? err.message : "Failed to parse schema");
      } finally {
        setLoading(false);
      }
    };

    parseSchema();
  }, [schemaId, setNodes, setEdges]);

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  const schemaTitle = schemaId === "openship" ? "Openship" : "Openfront";

  if (loading) {
    return (
      <div className="w-full flex flex-col">
        <header className="border-b bg-background px-6 py-4 mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {schemaTitle} Database Schema
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Loading schema visualization...
          </p>
        </header>
        <div className="h-[800px] w-full border rounded-lg bg-background flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Parsing schema...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col">
        <header className="border-b bg-background px-6 py-4 mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {schemaTitle} Database Schema
          </h1>
          <p className="text-sm text-destructive mt-1">Error loading schema</p>
        </header>
        <div className="h-[800px] w-full border rounded-lg bg-background flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-destructive font-medium mb-2">Failed to parse schema</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <header className="border-b bg-background px-6 py-4 mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {schemaTitle} Database Schema
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive visualization of the {schemaTitle} data model and relationships
          <span className="ml-2 text-xs">
            ({nodes.filter(n => n.type === "modelNode").length} models, {nodes.filter(n => n.type === "enumNode").length} enums)
          </span>
        </p>
      </header>
      <div className="h-[800px] w-full border rounded-lg bg-background">
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: "smoothstep",
              className: "stroke-muted-foreground/40",
              style: { strokeWidth: 1.5 },
            }}
            className="bg-background"
            attributionPosition="bottom-left"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="opacity-30"
            />

            <Panel position="bottom-right" className="flex -space-x-px">
              <Button
                variant="outline"
                size="icon"
                className="rounded-none rounded-l-md h-8 w-8 bg-background border-r-0"
                onClick={() => zoomIn()}
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-none h-8 w-8 bg-background border-r-0"
                onClick={() => zoomOut()}
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-none rounded-r-md h-8 w-8 bg-background"
                onClick={onFitView}
                aria-label="Fit view"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function SchemaVisualizer({ schemaId }: SchemaVisualizerProps) {
  return (
    <ReactFlowProvider>
      <SchemaVisualizerInner schemaId={schemaId} />
    </ReactFlowProvider>
  );
}

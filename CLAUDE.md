# OpenFront Documentation - AI Assistant Guide

## Overview

OpenFront Documentation covers a comprehensive, enterprise-grade e-commerce platform built with Next.js 15 and KeystoneJS 6. This documentation site provides guides, API references, and integration instructions for OpenFront Final 2.

## Platform Understanding

For comprehensive technical details about the OpenFront platform architecture, schema, and features, refer to:
**`/Users/junaid/openfront-final2/features/platform/PLATFORM.md`**

This platform documentation explains:
- 78+ KeystoneJS data models and relationships
- Payment and shipping adapter systems
- Advanced e-commerce features (analytics, claims, gift cards)
- Multi-regional commerce capabilities
- GraphQL API structure and operations
- Access control and security model

## Documentation Focus

This documentation covers OpenFront Final 2, a modern, open-source e-commerce platform built with Next.js 15 and Keystone.js 6. The focus is on accurate information about implemented and working capabilities rather than aspirational features.

## Current Implementation Status

### Fully Implemented ✅

#### Core E-commerce Features
- **Product Management**: Complete CRUD with variants, options, images, categories, and collections
- **Order Management**: Full order lifecycle with status tracking, line items, and fulfillment
- **Cart & Checkout**: Shopping cart with payment processing and order completion
- **Customer Management**: User accounts, addresses, order history, and authentication
- **Payment Processing**: Stripe and PayPal integration with webhook support, plus manual payments
- **Shipping**: Shippo integration with live rates and label generation, plus manual shipping options
- **Multi-currency Support**: Complete currency system with conversion and regional pricing
- **Inventory Management**: Stock tracking, movements, and availability
- **Tax System**: Tax rates, calculations, and regional tax support

#### Advanced Features Currently Working
- **Gift Cards**: Complete gift card system with transactions and redemption
- **Returns & Refunds**: Full return management with refund processing
- **Claims Processing**: Product claim system with images and tracking
- **Discounts & Promotions**: Flexible discount rules, conditions, and applications
- **Price Lists**: Bulk pricing and customer-specific pricing
- **Regional Settings**: Country-specific settings and configurations
- **Role-based Permissions**: Comprehensive access control system
- **API Authentication**: Session-based auth and API key authentication
- **File Storage**: S3-compatible storage with image handling
- **Email Notifications**: Order confirmations and system notifications
- **Batch Processing**: Background job processing system

### Partially Implemented 🚧

- **Analytics**: Data collection models exist, dashboard UI needs completion
- **Multi-tenant Support**: Basic store model exists, full multi-tenant implementation not yet available
- **Sales Channels**: Basic model exists, needs integration with product listing and external platforms
- **Advanced Reporting**: Data structures exist, need reporting UI and export features

### Technology Stack (Current)

#### Backend (Fully Implemented)
- **Keystone.js 6**: Headless CMS with admin interface
- **GraphQL**: Complete API with 78+ data models
- **Prisma**: Database ORM with PostgreSQL
- **Node.js**: Runtime environment
- **TypeScript**: Full type safety

#### Frontend (Fully Implemented)
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React features
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Radix UI**: Accessible primitives

## Data Models (78+ Implemented)

### Core Models
- **Store**: Store configuration and settings
- **Product**: Product information with variants and options
- **ProductVariant**: Product variations with pricing
- **ProductOption**: Product option definitions (size, color, etc.)
- **ProductOptionValue**: Specific option values
- **ProductImage**: Product images with metadata
- **ProductCategory**: Product categorization
- **ProductCollection**: Product groupings
- **ProductTag**: Product tagging system
- **Order**: Order management and tracking
- **OrderLineItem**: Individual order items
- **Cart**: Shopping cart functionality
- **User**: Customer and admin management
- **Address**: Customer addresses
- **Currency**: Multi-currency support
- **Region**: Geographic regions and settings
- **Payment**: Payment processing and transactions
- **PaymentSession**: Payment processing sessions
- **Fulfillment**: Order fulfillment tracking
- **Shipping**: Shipping methods and providers
- **Discount**: Discount rules and promotions
- **GiftCard**: Gift card system
- **Return**: Return management
- **Claim**: Product claims system

### Supporting Models
- **Role**: User roles and permissions
- **ApiKey**: API authentication
- **Notification**: System notifications
- **BatchJob**: Background processing
- **StockMovement**: Inventory tracking
- **MoneyAmount**: Pricing system
- **TaxRate**: Tax calculations
- **SalesChannel**: Sales channel management
- **Location**: Inventory locations
- **Measurement**: Product dimensions and weight

## Integration Ecosystem (Working)

### Payment Providers
- **Stripe**: Complete integration with payment intents, webhooks, and refunds
- **PayPal**: Full PayPal integration with order creation, capture, and refunds
- **Manual**: Manual payment processing for cash/check payments

### Shipping Providers
- **Shippo**: Complete integration with rate calculation, label generation, and tracking
- **Manual**: Mock shipping provider for testing and manual processes

### Storage
- **S3-compatible**: File upload and storage with configurable endpoints (AWS S3, DigitalOcean Spaces, etc.)

## Architecture

### Application Structure
```
openfront/
├── app/                    # Next.js App Router
│   ├── (storefront)/      # Customer-facing pages
│   ├── dashboard/         # Admin interface
│   └── api/              # API endpoints
├── features/
│   ├── keystone/         # Backend models and API
│   ├── storefront/       # Frontend components and screens
│   ├── platform/         # Admin panel components
│   └── integrations/     # Payment and shipping integrations
├── components/           # Shared UI components
└── lib/                 # Utility functions
```

### Key Features Working

#### Admin Dashboard
- Complete product management interface
- Order processing and fulfillment
- Customer management
- Payment and shipping configuration
- User and role management
- Settings and configuration

#### Storefront
- Product browsing and search
- Shopping cart and checkout
- Customer account management
- Order tracking and history
- Responsive design across devices

#### API
- GraphQL API with complete schema
- Authentication and authorization
- Real-time updates via subscriptions
- File upload handling
- Webhook processing

## Environment Configuration

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/openfront"

# Session Security
SESSION_SECRET="your-32-character-secret-key"

# Payment Providers (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Shipping Providers (Optional)
SHIPPO_API_KEY="shippo_test_..."

# File Storage (Optional)
S3_BUCKET_NAME="your-bucket"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"
S3_ENDPOINT="https://your-s3-endpoint.com"
```

## Development Workflow

### Getting Started (Tested Steps)
1. Clone repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Configure environment variables
5. Run migrations: `npm run migrate`
6. Start development server: `npm run dev`
7. Access admin at `/dashboard` to create first user
8. Access storefront at `/`

### Available Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build
- `npm run start`: Start production server
- `npm run migrate`: Apply database migrations
- `npm run migrate:gen`: Generate new migration

## Current Limitations

### Known Issues
- ShipEngine integration mentioned but not implemented
- Analytics dashboard needs UI completion
- Multi-tenant support needs admin UI updates
- Rate limiting is commented out in code
- Some error handling could be more robust

### Performance Considerations
- Database queries could benefit from optimization
- Image optimization needs improvement
- Caching layer not implemented
- CDN integration manual setup required

## Sales Channels Integration

Sales channels allow you to connect Openfront to external platforms and marketplaces to list and sell your products.

### Current Implementation
- Basic SalesChannel model with name, description, and status
- Integration with permissions system
- Foundation for connecting to external platforms

### Planned Enhancements
- Platform-specific integrations (Amazon, eBay, Facebook, etc.)
- Product synchronization with external channels
- Order import from external platforms
- Inventory synchronization across channels
- Channel-specific pricing and availability

## Documentation Strategy

### Focus Areas
1. **Accurate Implementation Docs**: Document what actually works
2. **Real Examples**: Provide working code samples and API calls
3. **Setup Guides**: Step-by-step instructions that work
4. **Integration Guides**: How to connect real services
5. **Troubleshooting**: Common issues and solutions

### Avoid
- Features not yet implemented
- Aspirational timelines
- Broken links and references
- Outdated information
- Placeholder content

## Next Steps for Documentation

### Immediate (High Priority)
1. Update all GitHub repository URLs
2. Fix broken API explorer links
3. Create working GraphQL examples
4. Update feature comparison tables
5. Complete getting started guide

### Short Term (Medium Priority)
1. Document all 78+ data models
2. Create integration guides for Stripe/PayPal/Shippo
3. Add deployment guides for various platforms
4. Create troubleshooting section
5. Add real performance benchmarks

### Long Term (Low Priority)
1. Video tutorials for complex workflows
2. Community contribution guidelines
3. Plugin development documentation
4. Advanced customization guides
5. Migration tools from other platforms

## Content Creation Guidelines

### Use Steps Component
All workflow documentation must use the official Steps component:
```jsx
import { Step, Steps } from 'fumadocs-ui/components/steps';

<Steps>
<Step>
### Step Title
Step content...
</Step>
</Steps>
```

### Code Examples
Include real examples from the platform:
```typescript
// GraphQL mutation example
const order = await context.query.Order.createOne({
  data: {
    email: "customer@example.com",
    displayId: 1001,
    status: "pending",
    lineItems: {
      create: lineItemsData
    }
  }
});
```

### Integration Examples
Show actual adapter patterns:
```typescript
// Payment provider integration
const paymentResult = await paymentProviderAdapter.createPaymentFunction({
  cart,
  amount: cart.total,
  currency: cart.currency.code
});
```

## AI Assistant Instructions

When working on OpenFront documentation:

1. **Read Platform Documentation**: Always reference the PLATFORM.md file for accurate technical details
2. **Verify Implementation**: Check actual code in `/Users/junaid/openfront-final2/` rather than making assumptions
3. **Use Steps Components**: Replace numbered lists with proper Steps components
4. **Focus on Real Features**: Document implemented capabilities, not planned features
5. **Include Examples**: Provide working GraphQL queries, mutations, and integration code
6. **Maintain Consistency**: Follow existing documentation patterns and styling

## Important Notes

- OpenFront Final 2 has significantly more features than currently documented
- The platform includes enterprise-level capabilities often not found in basic e-commerce solutions
- Payment and shipping systems use sophisticated adapter patterns for flexibility
- Analytics, claims, and gift card systems are fully implemented but undocumented
- Multi-regional commerce is production-ready with currency and tax support

## Conclusion

OpenFront is a robust, production-ready e-commerce platform with comprehensive features already implemented. The focus should be on accurately documenting existing capabilities and providing clear guidance for developers and businesses to successfully deploy and customize the platform.

The platform offers a genuine alternative to Shopify with modern technology, full customization capabilities, and no vendor lock-in, backed by a solid implementation that's ready for real-world use.
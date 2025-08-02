import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const shopPlatformData = {
  name: "shopplatform",
  fields: [
    { name: "id", type: "varchar" },
    { name: "name", type: "varchar" },
    { name: "appKey", type: "varchar" },
    { name: "appSecret", type: "varchar" },
    { name: "orderLinkFunction", type: "varchar" },
    { name: "updateProductFunction", type: "varchar" },
    { name: "getWebhooksFunction", type: "varchar" },
    { name: "deleteWebhookFunction", type: "varchar" },
    { name: "createWebhookFunction", type: "varchar" },
    { name: "searchProductsFunction", type: "varchar" },
    { name: "getProductFunction", type: "varchar" },
    { name: "searchOrdersFunction", type: "varchar" },
    { name: "addTrackingFunction", type: "varchar" },
    { name: "user", type: "user" },
    { name: "userId", type: "varchar" },
    { name: "createdAt", type: "timestamp" },
    { name: "updatedAt", type: "timestamp" }
  ],
  shops: [
    {
      name: "shop",
      fields: [
        { name: "id", type: "varchar" },
        { name: "name", type: "varchar" },
        { name: "domain", type: "varchar" },
        { name: "accessToken", type: "varchar" },
        { name: "linkMode", type: "varchar" },
        { name: "metadata", type: "json" }
      ]
    },
    {
      name: "shop",
      fields: [
        { name: "id", type: "varchar" },
        { name: "name", type: "varchar" },
        { name: "domain", type: "varchar" },
        { name: "accessToken", type: "varchar" },
        { name: "linkMode", type: "varchar" },
        { name: "metadata", type: "json" }
      ]
    },
    {
      name: "shop",
      fields: [
        { name: "id", type: "varchar" },
        { name: "name", type: "varchar" },
        { name: "domain", type: "varchar" },
        { name: "accessToken", type: "varchar" },
        { name: "linkMode", type: "varchar" },
        { name: "metadata", type: "json" }
      ]
    }
  ]
};

function ShopPlatformCard() {
  return (
    <div className="rounded-xl bg-card shadow-[0_1px_1px_rgba(0,0,0,0.02),_0_2px_2px_rgba(0,0,0,0.02),_0_4px_4px_rgba(0,0,0,0.02),_0_8px_8px_rgba(0,0,0,0.02),_0_16px_16px_rgba(0,0,0,0.02),_0_32px_32px_rgba(0,0,0,0.02)] w-[264px] font-mono">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-gradient-to-t from-background/70 dark:from-background/30">
        <div className="text-[13px]">
          <span className="text-muted-foreground/80">/</span>{" "}
          <span className="font-medium">{shopPlatformData.name}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="shadow-none hover:bg-transparent -my-2 -me-2 text-muted-foreground/60 hover:text-muted-foreground"
          aria-label="Open edit menu"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="text-xs py-2">
        {shopPlatformData.fields.map((field) => (
          <div key={field.name} className="px-4 relative group">
            <div className="flex items-center justify-between gap-2 py-2 border-dashed border-border/40 [&:not(:last-child)]:border-b">
              <span className="truncate font-medium">{field.name}</span>
              <span className="text-muted-foreground/60">{field.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopInstanceCard({ shop, index }: { shop: typeof shopPlatformData.shops[0], index: number }) {
  return (
    <div className="rounded-xl bg-card shadow-[0_1px_1px_rgba(0,0,0,0.02),_0_2px_2px_rgba(0,0,0,0.02),_0_4px_4px_rgba(0,0,0,0.02),_0_8px_8px_rgba(0,0,0,0.02),_0_16px_16px_rgba(0,0,0,0.02),_0_32px_32px_rgba(0,0,0,0.02)] w-[264px] font-mono">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-gradient-to-t from-background/70 dark:from-background/30">
        <div className="text-[13px]">
          <span className="text-muted-foreground/80">/</span>{" "}
          <span className="font-medium">{shop.name}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="shadow-none hover:bg-transparent -my-2 -me-2 text-muted-foreground/60 hover:text-muted-foreground"
          aria-label="Open edit menu"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="text-xs py-2">
        {shop.fields.map((field) => (
          <div key={field.name} className="px-4 relative group">
            <div className="flex items-center justify-between gap-2 py-2 border-dashed border-border/40 [&:not(:last-child)]:border-b">
              <span className="truncate font-medium">{field.name}</span>
              <span className="text-muted-foreground/60">{field.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPlatformCards() {
  return (
    <div className="not-prose">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Shop Platform Template</h3>
        <div className="flex justify-center">
          <ShopPlatformCard />
        </div>
      </div>
      
      <div className="text-center my-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
          <span>connects to</span>
          <div className="w-8 h-px bg-border" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Shop Instances</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {shopPlatformData.shops.map((shop, index) => (
            <ShopInstanceCard key={index} shop={shop} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
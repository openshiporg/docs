"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  BackgroundVariant,
  Handle,
  Position,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import SchemaEdge from "@/components/schema/schema-edge";

// Shop Platform Node
function ShopPlatformNode({ data }: NodeProps) {
  return (
    <div className="rounded-xl bg-card shadow-[0_1px_1px_rgba(0,0,0,0.02),_0_2px_2px_rgba(0,0,0,0.02),_0_4px_4px_rgba(0,0,0,0.02),_0_8px_8px_rgba(0,0,0,0.02),_0_16px_16px_rgba(0,0,0,0.02),_0_32px_32px_rgba(0,0,0,0.02)] w-[264px] font-mono">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-gradient-to-t from-background/70 dark:from-background/30">
        <div className="text-[13px]">
          <span className="text-muted-foreground/80">/</span>{" "}
          <span className="font-medium">shopplatform</span>
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
        {(data.fields as any[]).map((field: any) => (
          <div key={field.name} className="px-4 relative group">
            <div className="flex items-center justify-between gap-2 py-2 border-dashed border-border/40 [&:not(:last-child)]:border-b">
              <span className="truncate font-medium">{field.name}</span>
              <span className="text-muted-foreground/60">{field.type}</span>
              
              {field.isPrimary && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={field.name}
                  className="size-2.5 rounded-full !bg-foreground border-2 border-background !-right-1.5"
                  isConnectable={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shop Instance Node
function ShopInstanceNode({ data }: NodeProps) {
  return (
    <div className="rounded-xl bg-card shadow-[0_1px_1px_rgba(0,0,0,0.02),_0_2px_2px_rgba(0,0,0,0.02),_0_4px_4px_rgba(0,0,0,0.02),_0_8px_8px_rgba(0,0,0,0.02),_0_16px_16px_rgba(0,0,0,0.02),_0_32px_32px_rgba(0,0,0,0.02)] w-[264px] font-mono">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-gradient-to-t from-background/70 dark:from-background/30">
        <div className="text-[13px]">
          <span className="text-muted-foreground/80">/</span>{" "}
          <span className="font-medium">shop</span>
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
        {(data.fields as any[]).map((field: any) => (
          <div key={field.name} className="px-4 relative group">
            <div className="flex items-center justify-between gap-2 py-2 border-dashed border-border/40 [&:not(:last-child)]:border-b">
              <span className="truncate font-medium">{field.name}</span>
              <span className="text-muted-foreground/60">{field.type}</span>
              
              {field.isForeign && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={field.name}
                  className="size-2.5 rounded-full !bg-foreground border-2 border-background !-left-1.5"
                  isConnectable={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = {
  shopPlatform: ShopPlatformNode,
  shopInstance: ShopInstanceNode,
};

const edgeTypes = {
  custom: SchemaEdge,
};

// Data for the flow
const initialNodes = [
  {
    id: "shopplatform",
    type: "shopPlatform",
    position: { x: 0, y: 200 },
    data: {
      fields: [
        { name: "id", type: "shop_platform_001", isPrimary: true },
        { name: "name", type: "Shopify" },
        { name: "appKey", type: "abc123key" },
        { name: "appSecret", type: "xyz789secret" },
        { name: "searchProductsFunction", type: "shopify" },
        { name: "getProductFunction", type: "shopify" },
        { name: "searchOrdersFunction", type: "shopify" },
        { name: "updateProductFunction", type: "shopify" },
        { name: "createWebhookFunction", type: "shopify" },
        { name: "oAuthFunction", type: "shopify" },
      ],
    },
  },
  {
    id: "shop1",
    type: "shopInstance",
    position: { x: 450, y: 0 },
    data: {
      fields: [
        { name: "id", type: "shop_001" },
        { name: "name", type: "Tech Gadgets Pro" },
        { name: "domain", type: "techgadgets.myshopify.com" },
        { name: "accessToken", type: "shpat_abc123..." },
        { name: "platformId", type: "shop_platform_001", isForeign: true },
        { name: "linkMode", type: "sequential" },
        { name: "metadata", type: "{...}" },
      ],
    },
  },
  {
    id: "shop2",
    type: "shopInstance",
    position: { x: 450, y: 280 },
    data: {
      fields: [
        { name: "id", type: "shop_002" },
        { name: "name", type: "Modern Home Decor" },
        { name: "domain", type: "modernhome.myshopify.com" },
        { name: "accessToken", type: "shpat_xyz789..." },
        { name: "platformId", type: "shop_platform_001", isForeign: true },
        { name: "linkMode", type: "simultaneous" },
        { name: "metadata", type: "{...}" },
      ],
    },
  },
  {
    id: "shop3",
    type: "shopInstance",
    position: { x: 450, y: 560 },
    data: {
      fields: [
        { name: "id", type: "shop_003" },
        { name: "name", type: "Fashion Boutique" },
        { name: "domain", type: "boutique.myshopify.com" },
        { name: "accessToken", type: "shpat_def456..." },
        { name: "platformId", type: "shop_platform_001", isForeign: true },
        { name: "linkMode", type: "sequential" },
        { name: "metadata", type: "{...}" },
      ],
    },
  },
];

const initialEdges = [
  {
    id: "shopplatform-shop1",
    source: "shopplatform",
    target: "shop1", 
    sourceHandle: "id",
    targetHandle: "platformId",
    type: "custom",
  },
  {
    id: "shopplatform-shop2",
    source: "shopplatform",
    target: "shop2",
    sourceHandle: "id", 
    targetHandle: "platformId",
    type: "custom",
  },
  {
    id: "shopplatform-shop3",
    source: "shopplatform",
    target: "shop3",
    sourceHandle: "id",
    targetHandle: "platformId", 
    type: "custom",
  },
];

function ShopFlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-[600px]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: "custom",
          style: { strokeWidth: 1.5, stroke: 'var(--foreground)' },
          className: "opacity-40",
        }}
        style={
          {
            "--xy-background-pattern-dots-color-default":
              "var(--color-border)",
            "--xy-edge-stroke-width-default": 1.5,
            "--xy-edge-stroke-default": "var(--color-foreground)",
            "--xy-edge-stroke-selected-default": "var(--color-foreground)",
            "--xy-attribution-background-color-default": "transparent",
          } as React.CSSProperties
        }
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
      </ReactFlow>
    </div>
  );
}

export default function ShopFlowDiagram() {
  return (
    <div className="not-prose">
      <div className="border rounded-lg p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">Shop Platform Architecture</h3>
        <ReactFlowProvider>
          <ShopFlowInner />
        </ReactFlowProvider>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Shop Platform</strong> contains all the integration logic and function mappings (searchProductsFunction, getProductFunction, etc.) that define how to interact with the e-commerce platform.
          </p>
          <p>
            <strong>Shop Instances</strong> contain only the connection details (domain, accessToken) and reference the platform for all functionality. Multiple shops can use the same platform template.
          </p>
        </div>
      </div>
    </div>
  );
}
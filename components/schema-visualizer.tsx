"use client";

import { useCallback, useRef, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableNode from "@/components/table-node";
import SchemaEdge from "@/components/schema-edge";
import { parsePrismaSchema, openfrontSchemaContent, openshipSchemaContent } from "@/lib/schema-parser";

interface SchemaVisualizerProps {
  schemaId?: string;
}

// Register custom node types and edge types
const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  custom: SchemaEdge,
};

function SchemaVisualizerInner({ schemaId = "openfront" }: SchemaVisualizerProps) {
  // Parse the correct schema based on schemaId
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const schemaContent = schemaId === "openship" ? openshipSchemaContent : openfrontSchemaContent;
    return parsePrismaSchema(schemaContent);
  }, [schemaId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  // Add a title based on schema type
  const schemaTitle = schemaId === "openship" ? "Openship" : "Openfront";

  return (
    <div className="w-full flex flex-col">
      <header className="border-b bg-background px-6 py-4 mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {schemaTitle} Database Schema
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive visualization of the {schemaTitle} data model and relationships
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
          minZoom={0.3}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: "custom",
            className: "stroke-muted-foreground/40",
            style: { strokeWidth: 2 }
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

          <Panel
            position="bottom-right"
            className="flex -space-x-px"
          >
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
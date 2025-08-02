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
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableNode from "@/components/table-node";
import SchemaEdge from "@/components/schema-edge";
import { parsePrismaSchema, openshipSchemaContent } from "@/lib/schema-parser";

// Parse the Openship schema
const { nodes: initialNodes, edges: initialEdges } = parsePrismaSchema(openshipSchemaContent);

// Register custom node types and edge types
const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  custom: SchemaEdge,
};

function SchemaVisualizerInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const onFitView = useCallback(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  return (
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
  );
}

export function SchemaVisualizer() {
  return (
    <ReactFlowProvider>
      <SchemaVisualizerInner />
    </ReactFlowProvider>
  );
}
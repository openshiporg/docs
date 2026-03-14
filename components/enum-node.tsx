"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { EnumNodeData } from "@/lib/schema-types";

type EnumNodeType = Node<EnumNodeData, "enumNode">;

function EnumNode({ data }: NodeProps<EnumNodeType>) {
  return (
    <div
      className={cn(
        "bg-card border-2 border-purple-500/50 rounded-lg shadow-lg font-mono text-sm",
        "min-w-[180px] max-w-[300px]"
      )}
    >
      {/* Header */}
      <div
        className="px-3 py-2 bg-purple-500/10 border-b-2 border-purple-500/50 rounded-t-md font-bold text-center relative"
        title={data.documentation}
      >
        <Handle
          className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-background !-right-1"
          type="source"
          id={data.name}
          position={Position.Right}
          isConnectable={false}
        />
        <span className="text-purple-700 dark:text-purple-300 text-xs mr-2">
          enum
        </span>
        <span className="text-foreground">{data.name}</span>
      </div>

      {/* Values */}
      <div className="divide-y divide-border/50">
        {data.values.map((value) => (
          <div
            key={value}
            className="px-3 py-1.5 text-xs text-muted-foreground"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(EnumNode);

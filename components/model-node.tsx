"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
  relationEdgeSourceHandleId,
  relationEdgeTargetHandleId,
  enumEdgeTargetHandleId,
} from "@/lib/dmmf-to-flow";
import type { ModelNodeData } from "@/lib/schema-types";

type ColumnData = ModelNodeData["columns"][number];

const isRelationed = ({ relationData }: ColumnData) => !!relationData?.side;

type ModelNodeType = Node<ModelNodeData, "modelNode">;

function ModelNode({ data }: NodeProps<ModelNodeType>) {
  return (
    <div
      className={cn(
        "bg-card border-2 border-border rounded-lg shadow-lg font-mono text-sm",
        "min-w-[240px] max-w-[400px]"
      )}
    >
      {/* Header */}
      <div
        className="px-3 py-2 bg-muted/50 border-b-2 border-border rounded-t-md font-bold text-center"
        title={data.documentation}
      >
        <span className="text-foreground">{data.name}</span>
        {data.dbName && (
          <span className="font-normal text-muted-foreground ml-1">
            ({data.dbName})
          </span>
        )}
      </div>

      {/* Columns */}
      <div className="divide-y divide-border/50">
        {data.columns.map((col) => {
          const reled = isRelationed(col);
          let targetHandle: React.ReactNode = null;
          let sourceHandle: React.ReactNode = null;

          if (col.kind === "enum") {
            const handleId = enumEdgeTargetHandleId(data.name, col.name);
            targetHandle = (
              <Handle
                key={handleId}
                className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-background !-left-1"
                type="target"
                id={handleId}
                position={Position.Left}
                isConnectable={false}
              />
            );
          } else if (col.relationData) {
            const targetHandleId = relationEdgeTargetHandleId(
              data.name,
              col.relationData.name,
              col.name
            );
            const sourceHandleId = relationEdgeSourceHandleId(
              data.name,
              col.relationData.name,
              col.name
            );

            targetHandle =
              col.relationData.side === "target" ? (
                <Handle
                  key={targetHandleId}
                  className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-background !-left-1"
                  type="target"
                  id={targetHandleId}
                  position={Position.Left}
                  isConnectable={false}
                />
              ) : null;

            sourceHandle =
              col.relationData.side === "source" ? (
                <Handle
                  key={sourceHandleId}
                  className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-background !-right-1"
                  type="source"
                  id={sourceHandleId}
                  position={Position.Right}
                  isConnectable={false}
                />
              ) : null;
          }

          return (
            <div
              key={col.name}
              className={cn(
                "flex items-center justify-between px-3 py-1.5 text-xs relative group",
                reled && "cursor-pointer hover:bg-muted/30"
              )}
              title={col.documentation}
            >
              {/* Column name */}
              <div className="flex items-center gap-2 min-w-0 flex-1 relative">
                {targetHandle}
                <span
                  className={cn(
                    "font-semibold text-foreground truncate",
                    reled && "text-blue-600 dark:text-blue-400"
                  )}
                >
                  {col.name}
                </span>
              </div>

              {/* Type */}
              <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                <span
                  className={cn(
                    col.kind === "enum" && "text-purple-600 dark:text-purple-400",
                    col.kind === "object" && "text-blue-600 dark:text-blue-400"
                  )}
                >
                  {col.displayType}
                </span>
                {col.defaultValue && (
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                    = {col.defaultValue}
                  </span>
                )}
              </div>

              {sourceHandle}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ModelNode);

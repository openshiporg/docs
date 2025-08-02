import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  isOptional?: boolean;
  isUnique?: boolean;
  isArray?: boolean;
  defaultValue?: string;
}

interface TableNodeData extends Record<string, unknown> {
  label: string;
  fields: TableField[];
  selected?: boolean;
}

type TableNodeType = Node<TableNodeData, "tableNode">;

function TableNode({ data, id }: NodeProps<TableNodeType>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-lg border w-72 font-mono text-sm",
        data.selected ? "ring-2 ring-primary ring-offset-2" : "",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20 rounded-t-xl">
        <div className="text-sm font-medium">
          <span className="text-muted-foreground">/</span>{" "}
          <span className="text-foreground">{data.label}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-muted-foreground hover:text-foreground -my-2 -me-2"
          aria-label="Table options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="py-2">
        {data.fields.map((field: TableField, index) => (
          <div key={field.name} className="px-4 relative group">
            <div className="flex items-center justify-between gap-2 py-2 group-not-last-of-type:border-b border-dashed border-border/40">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-medium text-foreground truncate">{field.name}</span>
                {field.isPrimary && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-1.5 py-0.5 rounded">
                    PK
                  </span>
                )}
                {field.isForeign && (
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-1.5 py-0.5 rounded">
                    FK
                  </span>
                )}
                {field.isUnique && (
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-1.5 py-0.5 rounded">
                    U
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{field.type}</span>
                {field.isOptional && <span>?</span>}
                {field.isArray && <span>[]</span>}
              </div>

              {/* Connection handles for primary and foreign keys */}
              {field.isPrimary && (
                <Handle
                  type="source"
                  position={Position.Left}
                  id={field.name}
                  className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-background -left-1.5"
                  isConnectable={false}
                />
              )}
              {field.isForeign && (
                <Handle
                  type="target"
                  position={Position.Right}
                  id={field.name}
                  className="w-3 h-3 rounded-full bg-blue-500 border-2 border-background -right-1.5"
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

export default memo(TableNode);
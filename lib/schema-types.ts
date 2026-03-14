import { Edge, Node } from "@xyflow/react";

export type RelationType = "1-1" | "1-n" | "m-n";
export type RelationSide = "source" | "target";

export interface ModelRelationData {
  side: RelationSide;
  type: RelationType;
  name: string;
}

export interface EnumNodeData extends Record<string, unknown> {
  type: "enum";
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: string[];
}

export interface ModelNodeData extends Record<string, unknown> {
  type: "model";
  name: string;
  dbName?: string | null;
  documentation?: string;
  columns: Array<{
    name: string;
    type: string;
    displayType: string;
    kind: string;
    documentation?: string;
    isList: boolean;
    isRequired: boolean;
    defaultValue?: string | null;
    relationData: ModelRelationData | null;
  }>;
}

export interface RelationEdgeData extends Record<string, unknown> {
  relationType: RelationType;
}

export interface DMMFToElementsResult {
  nodes: Array<Node<EnumNodeData> | Node<ModelNodeData>>;
  edges: Edge[];
}

// DMMF types from Prisma
export interface DMMFField {
  name: string;
  kind: string;
  type: string;
  isList: boolean;
  isRequired: boolean;
  documentation?: string;
  hasDefaultValue: boolean;
  default?: any;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
}

export interface DMMFModel {
  name: string;
  dbName?: string | null;
  documentation?: string;
  fields: DMMFField[];
}

export interface DMMFEnum {
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: Array<{ name: string }>;
}

export interface DMMFDatamodel {
  models: DMMFModel[];
  enums: DMMFEnum[];
}

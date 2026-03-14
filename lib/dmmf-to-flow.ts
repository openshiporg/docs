import type { Edge, Node } from "@xyflow/react";
import type {
  DMMFDatamodel,
  DMMFField,
  DMMFModel,
  DMMFEnum,
  ModelNodeData,
  EnumNodeData,
  RelationType,
  RelationSide,
  ModelRelationData,
  RelationEdgeData,
  DMMFToElementsResult,
} from "./schema-types";

const letters = ["A", "B"];

// ID generation functions for consistency
export const edgeId = (target: string, source: string, targetColumn: string) =>
  `edge-${target}-${targetColumn}-${source}`;

export const enumEdgeTargetHandleId = (table: string, column: string) =>
  `${table}-${column}`;

const implicitManyToManyModelNodeId = (relation: string) => `_${relation}`;

export const relationEdgeSourceHandleId = (
  table: string,
  relation: string,
  column: string
) => `${table}-${relation}-${column}`;

export const relationEdgeTargetHandleId = (
  table: string,
  relation: string,
  column: string
) => `${table}-${relation}-${column}`;

const virtualTableName = (relation: string, table: string) =>
  `${relation}-${table}`;

interface GotModelRelations {
  name: string;
  dbName?: string;
  type: RelationType;
  virtual?: {
    name: string;
    field: {
      name: string;
      type: string;
    };
  };
  fields: Array<{
    name: string;
    tableName: string;
    side: RelationSide;
    type: string;
  }>;
}

const relationType = (listCount: number): RelationType =>
  listCount > 1 ? "m-n" : listCount === 1 ? "1-n" : "1-1";

const relationSide = (field: DMMFField): RelationSide =>
  field.relationFromFields?.length || field.relationToFields?.length
    ? "source"
    : "target";

/**
 * Filter through a schema to find all the models that are part of a
 * relationship, as well as what side of the relationships they are on.
 */
const getModelRelations = (
  models: DMMFModel[]
): Record<string, GotModelRelations> => {
  const groupedRelations: Record<
    string,
    Array<DMMFField & { tableName: string }>
  > = {};

  // Group fields by relation name
  for (const model of models) {
    for (const field of model.fields) {
      if (field.relationName) {
        if (!groupedRelations[field.relationName]) {
          groupedRelations[field.relationName] = [];
        }
        groupedRelations[field.relationName].push({
          ...field,
          tableName: model.name,
        });
      }
    }
  }

  const output: Record<string, GotModelRelations> = {};

  for (const [key, fields] of Object.entries(groupedRelations)) {
    const listCount = fields.filter((f) => f.isList).length;
    const type = relationType(listCount);

    output[key] = {
      name: key,
      type,
      fields: fields.map((f) => ({
        name: f.name,
        tableName: f.tableName,
        side: relationSide(f),
        type: f.type,
      })),
    };
  }

  // Handle implicit many-to-many relationships
  const withVirtuals: Record<string, GotModelRelations> = {};

  for (const curr of Object.values(output)) {
    if (curr.type === "m-n") {
      for (const [i, field] of curr.fields.entries()) {
        const newName = virtualTableName(curr.name, field.tableName);
        const virtualLetter = letters[i] || "";

        withVirtuals[newName] = {
          name: newName,
          dbName: curr.name,
          type: "1-n",
          virtual: {
            name: implicitManyToManyModelNodeId(curr.name),
            field: { name: virtualLetter, type: field.tableName },
          },
          fields: [
            field,
            {
              name: virtualLetter,
              tableName: implicitManyToManyModelNodeId(curr.name),
              side: "source",
              type: field.tableName,
            },
          ],
        };
      }
    } else {
      withVirtuals[curr.name] = curr;
    }
  }

  return withVirtuals;
};

/**
 * Filter through a schema to find all the models that refer to a defined Enum.
 */
const getEnumRelations = (models: DMMFModel[]) =>
  models
    .map((m) => {
      const fields = m.fields.filter((f) => f.kind === "enum");
      const relations = fields.map((f) => ({
        enum: f.type,
        column: f.name,
      }));

      return {
        name: m.name,
        relations,
      };
    })
    .filter((m) => m.relations.length);

/**
 * Map found relationships into React Flow edges.
 */
const relationsToEdges = (
  modelRelations: Record<string, GotModelRelations>,
  enumRelations: ReturnType<typeof getEnumRelations>
): Array<Edge<RelationEdgeData | {}>> => {
  const result: Array<Edge<RelationEdgeData | {}>> = [];

  // Enum edges
  for (const rel of enumRelations) {
    for (const r of rel.relations) {
      result.push({
        id: edgeId(rel.name, r.enum, r.column),
        type: "smoothstep",
        source: r.enum,
        target: rel.name,
        sourceHandle: r.enum,
        targetHandle: enumEdgeTargetHandleId(rel.name, r.column),
      });
    }
  }

  // Model relation edges
  for (const rel of Object.values(modelRelations)) {
    const source = rel.fields.find((f) => f.side === "source");
    let target = rel.fields.find((f) => f.side === "target");

    if (!target && rel.virtual) {
      target = rel.fields.find((f) => f.tableName === rel.virtual?.name);
    }

    if (!source || !target) continue;

    result.push({
      id: `edge-${rel.name}`,
      type: "relation",
      label: rel.name,
      data: { relationType: rel.type },
      source: source.tableName,
      target: target.tableName,
      sourceHandle: relationEdgeSourceHandleId(
        source.tableName,
        rel.name,
        source.name
      ),
      targetHandle: relationEdgeTargetHandleId(
        target.tableName,
        rel.name,
        target.name
      ),
    });
  }

  return result;
};

const generateEnumNodes = (enums: DMMFEnum[]): EnumNodeData[] =>
  enums.map(({ name, dbName, documentation, values }) => ({
    type: "enum" as const,
    name,
    dbName,
    documentation,
    values: values.map(({ name }) => name),
  }));

const generateModelNodes = (
  models: DMMFModel[],
  relations: Record<string, GotModelRelations>
): ModelNodeData[] =>
  models.map(({ name, dbName, documentation, fields }) => {
    const columns: ModelNodeData["columns"] = fields.map((f) => {
      const displayType = f.type + (f.isList ? "[]" : !f.isRequired ? "?" : "");
      let defaultValue: string | null = null;

      if (f.hasDefaultValue && f.default !== undefined) {
        if (typeof f.default === "object" && "name" in f.default) {
          defaultValue = `${f.default.name}(${(f.default.args || [])
            .map((arg: any) => JSON.stringify(arg))
            .join(",")})`;
        } else if (f.kind === "enum") {
          defaultValue = f.default.toString();
        } else {
          defaultValue = JSON.stringify(f.default);
        }
      }

      const relData =
        relations[f.relationName!] ||
        relations[virtualTableName(f.relationName!, name)];
      const thisRel = relData?.fields.find(
        (g) => g.name === f.name && g.tableName === name
      );

      const relationData: ModelRelationData | null = relData
        ? {
            name: relData.name,
            type: relData.type,
            side: thisRel?.side || ("" as any),
          }
        : null;

      return {
        name: f.name,
        kind: f.kind,
        documentation: f.documentation,
        isList: f.isList,
        isRequired: f.isRequired,
        type: f.type,
        displayType,
        defaultValue,
        relationData,
      };
    });

    return {
      type: "model" as const,
      name,
      dbName,
      documentation,
      columns,
    };
  });

/**
 * Generates intermediary tables for implicit many-to-many relationships.
 */
const generateImplicitModelNodes = (
  relations: Record<string, GotModelRelations>
): ModelNodeData[] => {
  const hasVirtuals = Object.values(relations).filter((rel) => rel.virtual);

  const grouped: Record<
    string,
    { relationName: string; fields: Array<{ name: string; type: string }> }
  > = {};

  for (const rel of hasVirtuals) {
    const virtualName = rel.virtual!.name;
    if (!grouped[virtualName]) {
      grouped[virtualName] = { relationName: rel.dbName!, fields: [] };
    }
    grouped[virtualName].fields.push(rel.virtual!.field);
  }

  return Object.entries(grouped).map(([name, { relationName, fields }]) => {
    const columns: ModelNodeData["columns"] = fields.map((col, i) => ({
      name: letters[i]!,
      kind: "scalar",
      isList: false,
      isRequired: true,
      defaultValue: null,
      type: col.type,
      displayType: col.type,
      relationData: {
        name: virtualTableName(relationName, col.type),
        side: "source" as RelationSide,
        type: "1-n" as RelationType,
      },
    }));

    return {
      type: "model" as const,
      name,
      dbName: null,
      columns,
    };
  });
};

/**
 * Calculate positions for nodes in a grid layout
 */
const calculatePositions = (
  count: number
): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const horizontalSpacing = 380;
  const verticalSpacing = 400;

  let index = 0;
  let row = 0;
  while (index < count) {
    for (let col = 0; col < cols && index < count; col++) {
      const xOffset = (row % 2) * 40;
      positions.push({
        x: col * horizontalSpacing + xOffset + 50,
        y: row * verticalSpacing + 50,
      });
      index++;
    }
    row++;
  }

  return positions;
};

/**
 * Convert node data to positioned React Flow nodes
 */
const positionNodes = (
  nodeData: Array<EnumNodeData | ModelNodeData>
): Array<Node<EnumNodeData> | Node<ModelNodeData>> => {
  const positions = calculatePositions(nodeData.length);

  return nodeData.map((n, index) => ({
    id: n.name,
    type: n.type === "enum" ? "enumNode" : "modelNode",
    position: positions[index] || { x: 0, y: 0 },
    data: n as any,
  }));
};

/**
 * Main function to convert DMMF datamodel to React Flow elements
 */
export const generateFlowFromDMMF = (
  datamodel: DMMFDatamodel
): DMMFToElementsResult => {
  const modelRelations = getModelRelations(datamodel.models);
  const enumRelations = getEnumRelations(datamodel.models);

  const modelNodes = generateModelNodes(datamodel.models, modelRelations);
  const implicitNodes = generateImplicitModelNodes(modelRelations);
  const enumNodes = generateEnumNodes(datamodel.enums);

  const allNodeData = [...modelNodes, ...implicitNodes, ...enumNodes];
  const nodes = positionNodes(allNodeData);
  const edges = relationsToEdges(modelRelations, enumRelations);

  return { nodes, edges };
};

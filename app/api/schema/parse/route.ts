import { NextRequest, NextResponse } from "next/server";

interface ParsedField {
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

interface ParsedModel {
  name: string;
  dbName?: string | null;
  documentation?: string;
  fields: ParsedField[];
}

interface ParsedEnum {
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: Array<{ name: string }>;
}

interface ParsedDatamodel {
  models: ParsedModel[];
  enums: ParsedEnum[];
}

function parseDefault(defaultStr: string): any {
  // Handle function calls like cuid(), now(), etc.
  const funcMatch = defaultStr.match(/^(\w+)\((.*)\)$/);
  if (funcMatch) {
    return { name: funcMatch[1], args: funcMatch[2] ? [funcMatch[2]] : [] };
  }

  // Handle string literals
  if (defaultStr.startsWith('"') && defaultStr.endsWith('"')) {
    return defaultStr.slice(1, -1);
  }

  // Handle boolean
  if (defaultStr === "true") return true;
  if (defaultStr === "false") return false;

  // Handle numbers
  if (!isNaN(Number(defaultStr))) {
    return Number(defaultStr);
  }

  // Return as-is for enum values, etc.
  return defaultStr;
}

function parsePrismaSchemaManually(schema: string): ParsedDatamodel {
  const models: ParsedModel[] = [];
  const enums: ParsedEnum[] = [];
  const modelNames = new Set<string>();
  const enumNames = new Set<string>();

  // First pass: collect all model and enum names
  const modelNameRegex = /model\s+(\w+)\s*\{/g;
  const enumNameRegex = /enum\s+(\w+)\s*\{/g;

  let match;
  while ((match = modelNameRegex.exec(schema)) !== null) {
    modelNames.add(match[1]);
  }
  while ((match = enumNameRegex.exec(schema)) !== null) {
    enumNames.add(match[1]);
  }

  // Parse enums
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  while ((match = enumRegex.exec(schema)) !== null) {
    const enumName = match[1];
    const enumContent = match[2];

    const values = enumContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'))
      .map(value => ({ name: value }));

    enums.push({
      name: enumName,
      values,
    });
  }

  // Parse models
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1];
    const modelContent = match[2];

    const fields: ParsedField[] = [];
    const lines = modelContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines, comments, and index/unique declarations
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;

      // Match field pattern: fieldName Type? modifiers
      const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)?$/);
      if (!fieldMatch) continue;

      const [, fieldName, rawType, arrayMarker, optionalMarker, rest = ''] = fieldMatch;

      const isList = !!arrayMarker;
      const isRequired = !optionalMarker && !isList;

      // Determine field kind
      let kind: string;
      if (modelNames.has(rawType)) {
        kind = "object";
      } else if (enumNames.has(rawType)) {
        kind = "enum";
      } else {
        kind = "scalar";
      }

      // Parse default value - handle nested parentheses
      let defaultValue: any = undefined;
      let hasDefaultValue = false;
      const defaultStart = rest.indexOf('@default(');
      if (defaultStart !== -1) {
        hasDefaultValue = true;
        let parenCount = 0;
        let defaultEnd = defaultStart + 9; // length of '@default('
        for (let i = defaultEnd; i < rest.length; i++) {
          if (rest[i] === '(') parenCount++;
          else if (rest[i] === ')') {
            if (parenCount === 0) {
              defaultEnd = i;
              break;
            }
            parenCount--;
          }
        }
        const defaultStr = rest.slice(defaultStart + 9, defaultEnd);
        defaultValue = parseDefault(defaultStr);
      }

      // Parse relation
      const relationMatch = rest.match(/@relation\("([^"]+)"(?:,\s*fields:\s*\[([^\]]+)\],\s*references:\s*\[([^\]]+)\])?/);
      let relationName: string | undefined;
      let relationFromFields: string[] | undefined;
      let relationToFields: string[] | undefined;

      if (relationMatch) {
        relationName = relationMatch[1];
        if (relationMatch[2]) {
          relationFromFields = relationMatch[2].split(',').map(s => s.trim());
        }
        if (relationMatch[3]) {
          relationToFields = relationMatch[3].split(',').map(s => s.trim());
        }
      }

      fields.push({
        name: fieldName,
        kind,
        type: rawType,
        isList,
        isRequired,
        hasDefaultValue,
        default: defaultValue,
        relationName,
        relationFromFields,
        relationToFields,
      });
    }

    models.push({
      name: modelName,
      fields,
    });
  }

  return { models, enums };
}

export async function POST(req: NextRequest) {
  try {
    const { schema } = await req.json();

    if (!schema || typeof schema !== "string") {
      return NextResponse.json(
        { error: "Schema is required and must be a string" },
        { status: 400 }
      );
    }

    const datamodel = parsePrismaSchemaManually(schema);
    return NextResponse.json(datamodel);
  } catch (err) {
    const message = (err as Error).message;
    console.error("Schema parsing error:", message);

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

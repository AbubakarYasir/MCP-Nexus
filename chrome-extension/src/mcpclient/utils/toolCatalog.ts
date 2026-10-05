import type { NormalizedTool } from '../types/primitives.js';

export interface ToolRejection {
  index: number;
  name?: string;
  reason: string;
}

export interface ToolNormalizationResult {
  tools: NormalizedTool[];
  rejections: ToolRejection[];
}

export interface ToolListPage {
  tools: unknown[];
  nextCursor?: string;
}

export interface PaginatedToolCollection {
  tools: unknown[];
  pageCount: number;
}

export async function collectPaginatedTools(
  requestPage: (cursor?: string) => Promise<ToolListPage>,
  maxPages = 1000,
): Promise<PaginatedToolCollection> {
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new Error('maxPages must be a positive integer');
  }

  const tools: unknown[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  let pageCount = 0;

  do {
    if (pageCount >= maxPages) {
      throw new Error(
        `tools/list exceeded ${maxPages} pages; aborting to prevent an infinite pagination loop`,
      );
    }

    if (cursor) {
      if (seenCursors.has(cursor)) {
        throw new Error(`tools/list repeated cursor "${cursor}"`);
      }

      seenCursors.add(cursor);
    }

    const page = await requestPage(cursor);

    if (!page || !Array.isArray(page.tools)) {
      throw new Error('tools/list returned an invalid page: expected a tools array');
    }

    if (page.nextCursor !== undefined && typeof page.nextCursor !== 'string') {
      throw new Error('tools/list returned an invalid nextCursor');
    }

    tools.push(...page.tools);
    cursor = page.nextCursor;
    pageCount += 1;
  } while (cursor);

  return { tools, pageCount };
}

export function normalizeToolValues(rawTools: unknown[]): ToolNormalizationResult {
  const tools: NormalizedTool[] = [];
  const rejections: ToolRejection[] = [];

  rawTools.forEach((rawTool, index) => {
    if (!rawTool || typeof rawTool !== 'object' || Array.isArray(rawTool)) {
      rejections.push({
        index,
        reason: 'tool is not an object',
      });
      return;
    }

    const tool = rawTool as Record<string, any>;
    const name = tool.name;

    if (typeof name !== 'string' || name.trim().length === 0) {
      rejections.push({
        index,
        reason: 'missing valid tool name',
      });
      return;
    }

    const rawInputSchema = tool.inputSchema ?? tool.input_schema ?? {};
    const inputSchema =
      rawInputSchema && typeof rawInputSchema === 'object' && !Array.isArray(rawInputSchema)
        ? rawInputSchema
        : {};

    let schema = typeof tool.schema === 'string' ? tool.schema : '{}';

    if (typeof tool.schema !== 'string') {
      try {
        schema = JSON.stringify(inputSchema) ?? '{}';
      } catch {
        schema = '{}';
      }
    }

    const normalized: NormalizedTool = {
      name,
      description: typeof tool.description === 'string' ? tool.description : '',
      input_schema: inputSchema,
      schema,
    };

    if (tool.outputSchema !== undefined) {
      normalized.output_schema = tool.outputSchema;
    } else if (tool.output_schema !== undefined) {
      normalized.output_schema = tool.output_schema;
    }

    if (tool.annotations !== undefined) {
      normalized.annotations = tool.annotations;
    }

    if (tool._meta !== undefined) {
      normalized.meta = tool._meta;
    } else if (tool.meta !== undefined) {
      normalized.meta = tool.meta;
    }

    if (tool.icons !== undefined) {
      normalized.icons = tool.icons;
    }

    if (typeof tool.uri === 'string') {
      normalized.uri = tool.uri;
    }

    if (Array.isArray(tool.arguments)) {
      normalized.arguments = tool.arguments;
    }

    tools.push(normalized);
  });

  return { tools, rejections };
}

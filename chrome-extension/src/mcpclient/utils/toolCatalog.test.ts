import assert from 'node:assert/strict';
import { collectPaginatedTools, normalizeToolValues } from './toolCatalog.js';

async function run(): Promise<void> {
  const mixed = normalizeToolValues([
    {
      name: 'alpha',
      description: 'valid tool',
      inputSchema: { type: 'object', properties: { q: { type: 'string' } } },
      outputSchema: { type: 'array' },
      annotations: { readOnlyHint: true },
    },
    null,
    {
      name: '',
      inputSchema: { type: 'object' },
    },
    {
      name: 'beta',
      input_schema: { type: 'object' },
      _meta: { sourceServer: 'demo' },
    },
  ]);

  assert.equal(mixed.tools.length, 2);
  assert.equal(mixed.rejections.length, 2);
  assert.equal(mixed.tools[0]?.name, 'alpha');
  assert.deepEqual(mixed.tools[0]?.output_schema, { type: 'array' });
  assert.deepEqual(mixed.tools[1]?.meta, { sourceServer: 'demo' });

  const circularSchema: Record<string, any> = { type: 'object' };
  circularSchema.self = circularSchema;

  const circular = normalizeToolValues([
    {
      name: 'circular',
      inputSchema: circularSchema,
    },
  ]);

  assert.equal(circular.tools.length, 1);
  assert.equal(circular.tools[0]?.schema, '{}');

  const pages = new Map<string | undefined, { tools: unknown[]; nextCursor?: string }>([
    [undefined, { tools: [{ name: 'a' }], nextCursor: 'page-2' }],
    ['page-2', { tools: [{ name: 'b' }], nextCursor: 'page-3' }],
    ['page-3', { tools: [{ name: 'c' }] }],
  ]);

  const paginated = await collectPaginatedTools(async cursor => {
    const page = pages.get(cursor);
    assert.ok(page);
    return page;
  });

  assert.equal(paginated.pageCount, 3);
  assert.deepEqual(
    paginated.tools.map(tool => (tool as any).name),
    ['a', 'b', 'c'],
  );

  await assert.rejects(
    () =>
      collectPaginatedTools(async cursor => {
        if (!cursor) {
          return { tools: [], nextCursor: 'loop' };
        }

        return { tools: [], nextCursor: 'loop' };
      }),
    /repeated cursor/,
  );

  console.log('MCP Nexus tool discovery regression tests passed');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

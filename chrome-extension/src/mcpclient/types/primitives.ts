export type PrimitiveType = 'resource' | 'tool' | 'prompt';

export interface PrimitiveValue {
  name: string;
  description?: string;
  uri?: string;
  inputSchema?: any;
  input_schema?: any;
  outputSchema?: any;
  output_schema?: any;
  annotations?: any;
  _meta?: any;
  meta?: any;
  icons?: any;
  arguments?: any[];
  schema?: string;
}

export interface Primitive {
  type: PrimitiveType;
  value: PrimitiveValue;
}

export interface NormalizedTool {
  name: string;
  description: string;
  input_schema: any;
  schema: string;
  output_schema?: any;
  annotations?: any;
  meta?: any;
  icons?: any;
  uri?: string;
  arguments?: any[];
}

export interface ToolCallRequest {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolCallResult {
  content: any[];
  isError?: boolean;
}

export interface PrimitivesResponse {
  tools: NormalizedTool[];
  resources: any[];
  prompts: any[];
  timestamp: number;
}

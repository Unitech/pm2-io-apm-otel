import { ExportResult } from '@opentelemetry/core';
export interface ExporterConfig {
    headers?: Record<string, string>;
    serviceName?: string;
    url?: string;
    statusCodeTagName?: string;
    statusDescriptionTagName?: string;
    getExportRequestHeaders?: () => Record<string, string> | undefined;
}
export interface Span {
    traceId: string;
    name: string;
    parentId?: string;
    id: string;
    kind?: SpanKind;
    timestamp: number;
    duration: number;
    debug?: boolean;
    shared?: boolean;
    localEndpoint: Endpoint;
    annotations?: Annotation[];
    tags: Tags;
}
export interface Annotation {
    timestamp: number;
    value: string;
}
export interface Endpoint {
    serviceName?: string;
    ipv4?: string;
    port?: number;
}
export interface Tags {
    [tagKey: string]: unknown;
}
export declare enum SpanKind {
    CLIENT = "CLIENT",
    SERVER = "SERVER",
    CONSUMER = "CONSUMER",
    PRODUCER = "PRODUCER"
}
export type SendFunction = (zipkinSpans: Span[], done: (result: ExportResult) => void) => void;
export type GetHeaders = () => Record<string, string> | undefined;
export type SendFn = (zipkinSpans: Span[], done: (result: ExportResult) => void) => void;

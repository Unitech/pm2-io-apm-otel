import { ReadableSpan, TimedEvent } from '@opentelemetry/sdk-trace-base';
import * as zipkinTypes from './types';
export declare const defaultStatusCodeTagName = "otel.status_code";
export declare const defaultStatusErrorTagName = "error";
export declare function toZipkinSpan(span: ReadableSpan, serviceName: string, statusCodeTagName: string, statusErrorTagName: string): zipkinTypes.Span;
export declare function _toZipkinTags({ attributes, resource, status, droppedAttributesCount, droppedEventsCount, droppedLinksCount, }: ReadableSpan, statusCodeTagName: string, statusErrorTagName: string): zipkinTypes.Tags;
export declare function _toZipkinAnnotations(events: TimedEvent[]): zipkinTypes.Annotation[];

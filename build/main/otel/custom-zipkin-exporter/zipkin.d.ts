import { ExportResult } from '@opentelemetry/core';
import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import * as zipkinTypes from './types';
export declare class CustomZipkinExporter implements SpanExporter {
    private readonly DEFAULT_SERVICE_NAME;
    private readonly _statusCodeTagName;
    private readonly _statusDescriptionTagName;
    private _urlStr;
    private _send;
    private _getHeaders;
    private _serviceName?;
    private _isShutdown;
    private _sendingPromises;
    private transport;
    constructor(config?: zipkinTypes.ExporterConfig);
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    shutdown(): Promise<void>;
    forceFlush(): Promise<void>;
    private _beforeSend;
    private _sendSpans;
}

import { Feature } from '../featureManager';
import { IOConfig } from '../pmx';
import { Tracer } from "@opentelemetry/api";
import * as httpModule from 'http';
export type IgnoreMatcher<T> = string | RegExp | ((url: string, request: T) => boolean);
export type HttpPluginConfig = {
    ignoreIncomingPaths: Array<IgnoreMatcher<httpModule.IncomingMessage>>;
    ignoreOutgoingUrls: Array<IgnoreMatcher<httpModule.ClientRequest>>;
    createSpanWithNet: boolean;
};
export type HttpModule = typeof httpModule;
export type RequestFunction = typeof httpModule.request;
export interface TracingConfig {
    enabled: boolean;
    serviceName?: string;
    outbound?: boolean;
    samplingRate?: number;
    ignoreIncomingPaths?: Array<IgnoreMatcher<httpModule.IncomingMessage>>;
    ignoreOutgoingUrls?: Array<IgnoreMatcher<httpModule.ClientRequest>>;
    createSpanWithNet?: boolean;
}
export declare class TracingFeature implements Feature {
    private options;
    private logger;
    private otel;
    init(config: IOConfig): void;
    getTracer(): Tracer;
    destroy(): void;
}

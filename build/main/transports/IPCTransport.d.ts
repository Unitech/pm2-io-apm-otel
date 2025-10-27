import { EventEmitter2 } from 'eventemitter2';
import type { Action } from '../services/actions';
import type { InternalMetric } from '../services/metrics';
import type { Transport, TransportConfig } from '../services/transport';
export declare class IPCTransport extends EventEmitter2 implements Transport {
    private initiated;
    private logger;
    private onMessage;
    private autoExitHandle;
    init(config?: TransportConfig): Transport;
    private autoExitHook;
    setMetrics(metrics: InternalMetric[]): void;
    addAction(action: Action): void;
    setOptions(options: any): -1 | undefined;
    send(channel: any, payload: any): -1 | undefined;
    destroy(): void;
}

import * as zipkinTypes from '../../types';
import { Transport } from '../../../../services/transport';
export interface PrepareSendConfig {
    outbound?: boolean;
}
export declare function prepareSend(transport: Transport, headers?: Record<string, string>, config?: PrepareSendConfig): zipkinTypes.SendFn;

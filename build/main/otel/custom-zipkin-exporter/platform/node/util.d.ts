import * as zipkinTypes from '../../types';
import { Transport } from '../../../../services/transport';
export declare function prepareSend(transport: Transport, headers?: Record<string, string>): zipkinTypes.SendFn;

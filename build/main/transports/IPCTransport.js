"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCTransport = void 0;
const cluster = require("cluster");
const Debug = require("debug");
const eventemitter2_1 = require("eventemitter2");
class IPCTransport extends eventemitter2_1.EventEmitter2 {
    initiated = false;
    logger = Debug('axm:transport:ipc');
    onMessage;
    autoExitHandle;
    init(config) {
        this.logger('Init new transport service');
        if (this.initiated === true) {
            console.error(`Trying to re-init the transport, please avoid`);
            return this;
        }
        this.initiated = true;
        this.logger('Agent launched');
        this.onMessage = (data) => {
            this.logger(`Received reverse message from IPC`);
            this.emit('data', data);
        };
        process.on('message', this.onMessage);
        if (cluster.isWorker === false) {
            this.autoExitHook();
        }
        return this;
    }
    autoExitHook() {
        this.autoExitHandle = setInterval(() => {
            const currentProcess = (cluster.isWorker) ? cluster.worker.process : process;
            if (currentProcess._getActiveHandles().length === 3) {
                const handlers = currentProcess._getActiveHandles().map(h => h.constructor.name);
                if (handlers.includes('Pipe') === true &&
                    handlers.includes('Socket') === true) {
                    process.removeListener('message', this.onMessage);
                    const tmp = setTimeout(_ => {
                        this.logger(`Still alive, listen back to IPC`);
                        process.on('message', this.onMessage);
                    }, 200);
                    tmp.unref();
                }
            }
        }, 3000);
        this.autoExitHandle.unref();
    }
    setMetrics(metrics) {
        const serializedMetric = metrics.reduce((object, metric) => {
            if (typeof metric.name !== 'string')
                return object;
            object[metric.name] = {
                historic: metric.historic,
                unit: metric.unit,
                type: metric.id,
                value: metric.value
            };
            return object;
        }, {});
        this.send('axm:monitor', serializedMetric);
    }
    addAction(action) {
        this.logger(`Add action: ${action.name}:${action.type}`);
        this.send('axm:action', {
            action_name: action.name,
            action_type: action.type,
            arity: action.arity,
            opts: action.opts
        });
    }
    setOptions(options) {
        this.logger(`Set options: [${Object.keys(options).join(',')}]`);
        return this.send('axm:option:configuration', options);
    }
    send(channel, payload) {
        if (typeof process.send !== 'function')
            return -1;
        if (process.connected === false) {
            console.error('Process disconnected from parent! (not connected)');
            return process.exit(1);
        }
        try {
            this.logger(`Send on channel ${channel}`);
            process.send({ type: channel, data: payload });
        }
        catch (err) {
            this.logger('Process disconnected from parent !');
            this.logger(err);
            return process.exit(1);
        }
    }
    destroy() {
        if (this.onMessage !== undefined) {
            process.removeListener('message', this.onMessage);
        }
        if (this.autoExitHandle !== undefined) {
            clearInterval(this.autoExitHandle);
        }
        this.logger('destroy');
    }
}
exports.IPCTransport = IPCTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSVBDVHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3RyYW5zcG9ydHMvSVBDVHJhbnNwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFrQztBQUNsQywrQkFBOEI7QUFDOUIsaURBQTZDO0FBSzdDLE1BQWEsWUFBYSxTQUFRLDZCQUFhO0lBRXJDLFNBQVMsR0FBRyxLQUFLLENBQUE7SUFDakIsTUFBTSxHQUFhLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0lBQzdDLFNBQVMsQ0FBaUI7SUFDMUIsY0FBYyxDQUE0QjtJQUVsRCxJQUFJLENBQUUsTUFBd0I7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO1FBQ3pDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUE7WUFDOUQsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDekIsQ0FBQyxDQUFBO1FBQ0QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBS3JDLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDckIsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFBO0lBQ2IsQ0FBQztJ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
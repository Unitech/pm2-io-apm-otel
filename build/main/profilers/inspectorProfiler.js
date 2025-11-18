"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const miscellaneous_1 = require("../utils/miscellaneous");
const Debug = require("debug");
const semver = require("semver");
class CurrentProfile {
    uuid;
    startTime;
    initiated;
}
class InspectorProfiler {
    profiler = undefined;
    actionService;
    transport;
    currentProfile = null;
    logger = Debug('axm:features:profiling:inspector');
    isNode11 = semver.satisfies(semver.clean(process.version), '>11.x');
    init() {
        this.profiler = serviceManager_1.ServiceManager.get('inspector');
        if (this.profiler === undefined) {
            configuration_1.default.configureModule({
                heapdump: false,
                'feature.profiler.heap_snapshot': false,
                'feature.profiler.heap_sampling': false,
                'feature.profiler.cpu_js': false
            });
            return console.error(`Failed to require the profiler via inspector, disabling profiling ...`);
        }
        this.profiler.getSession().post('Profiler.enable');
        this.profiler.getSession().post('HeapProfiler.enable');
        this.logger('init');
        this.actionService = serviceManager_1.ServiceManager.get('actions');
        if (this.actionService === undefined) {
            return this.logger(`Fail to get action service`);
        }
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === undefined) {
            return this.logger(`Fail to get transport service`);
        }
        configuration_1.default.configureModule({
            heapdump: true,
            'feature.profiler.heapsnapshot': !this.isNode11,
            'feature.profiler.heapsampling': true,
            'feature.profiler.cpu_js': true
        });
        this.register();
    }
    register() {
        if (this.actionService === undefined) {
            return this.logger(`Fail to get action service`);
        }
        this.logger('register');
        this.actionService.registerAction('km:heapdump', this.onHeapdump.bind(this));
        this.actionService.registerAction('km:cpu:profiling:start', this.onCPUProfileStart.bind(this));
        this.actionService.registerAction('km:cpu:profiling:stop', this.onCPUProfileStop.bind(this));
        this.actionService.registerAction('km:heap:sampling:start', this.onHeapProfileStart.bind(this));
        this.actionService.registerAction('km:heap:sampling:stop', this.onHeapProfileStop.bind(this));
    }
    destroy() {
        this.logger('Inspector Profiler destroyed !');
        if (this.profiler === undefined)
            return;
        this.profiler.getSession().post('Profiler.disable');
        this.profiler.getSession().post('HeapProfiler.disable');
    }
    onHeapProfileStart(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        if (this.currentProfile !== null) {
            return cb({
                err: 'A profiling is already running',
                success: false
            });
        }
        this.currentProfile = new CurrentProfile();
        this.currentProfile.uuid = miscellaneous_1.default.generateUUID();
        this.currentProfile.startTime = Date.now();
        this.currentProfile.initiated = typeof opts.initiated === 'string'
            ? opts.initiated : 'manual';
        cb({ success: true, uuid: this.currentProfile.uuid });
        const defaultSamplingInterval = 16384;
        this.profiler.getSession().post('HeapProfiler.startSampling', {
            samplingInterval: typeof opts.samplingInterval === 'number'
                ? opts.samplingInterval : defaultSamplingInterval
        });
        if (isNaN(parseInt(opts.timeout, 10)))
            return;
        const duration = parseInt(opts.timeout, 10);
        setTimeout(_ => {
            this.onHeapProfileStop(_ => {
                return;
            });
        }, duration);
    }
    onHeapProfileStop(cb) {
        if (this.currentProfile === null) {
            return cb({
                err: 'No profiling are already running',
                success: false
            });
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true, uuid: this.currentProfile.uuid });
        this.profiler.getSession().post('HeapProfiler.stopSampling', (_, { profile }) => {
            if (this.currentProfile === null)
                return;
            if (this.transport === undefined)
                return;
            const data = JSON.stringify(profile);
            this.transport.send('profilings', {
                uuid: this.currentProfile.uuid,
                duration: Date.now() - this.currentProfile.startTime,
                at: this.currentProfile.startTime,
                data,
                success: true,
                initiated: this.currentProfile.initiated,
                type: 'heapprofile',
                heapprofile: true
            });
            this.currentProfile = null;
        });
    }
    onCPUProfileStart(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        if (this.currentProfile !== null) {
            return cb({
                err: 'A profiling is already running',
                success: false
            });
        }
        this.currentProfile = new CurrentProfile();
        this.currentProfile.uuid = miscellaneous_1.default.generateUUID();
        this.currentProfile.startTime = Date.now();
        this.currentProfile.initiated = typeof opts.initiated === 'string'
            ? opts.initiated : 'manual';
        cb({ success: true, uuid: this.currentProfile.uuid });
        if (process.hasOwnProperty('_startProfilerIdleNotifier') === true) {
            process._startProfilerIdleNotifier();
        }
        this.profiler.getSession().post('Profiler.start');
        if (isNaN(parseInt(opts.timeout, 10)))
            return;
        const duration = parseInt(opts.timeout, 10);
        setTimeout(_ => {
            this.onCPUProfileStop(_ => {
                return;
            });
        }, duration);
    }
    onCPUProfileStop(cb) {
        if (this.currentProfile === null) {
            return cb({
                err: 'No profiling are already running',
                success: false
            });
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true, uuid: this.currentProfile.uuid });
        if (process.hasOwnProperty('_stopProfilerIdleNotifier') === true) {
            process._stopProfilerIdleNotifier();
        }
        this.profiler.getSession().post('Profiler.stop', (_, res) => {
            if (this.currentProfile === null)
                return;
            if (this.transport === undefined)
                return;
            const profile = res.profile;
            const data = JSON.stringify(profile);
            this.transport.send('profilings', {
                uuid: this.currentProfile.uuid,
                duration: Date.now() - this.currentProfile.startTime,
                at: this.currentProfile.startTime,
                data,
                success: true,
                initiated: this.currentProfile.initiated,
                type: 'cpuprofile',
                cpuprofile: true
            });
            this.currentProfile = null;
        });
    }
    onHeapdump(opts, cb) {
        if (typeof cb !== 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }
        if (this.profiler === undefined) {
            return cb({
                err: 'Profiler not available',
                success: false
            });
        }
        cb({ success: true });
        setTimeout(() => {
            const startTime = Date.now();
            this.takeSnapshot()
                .then(data => {
                return this.transport.send('profilings', {
                    data,
                    at: startTime,
                    initiated: typeof opts.initiated === 'string' ? opts.initiated : 'manual',
                    duration: Date.now() - startTime,
                    type: 'heapdump'
                });
            }).catch(err => {
                return cb({
                    success: err.message,
                    err: err
                });
            });
        }, 200);
    }
    takeSnapshot() {
        return new Promise(async (resolve, reject) => {
            if (this.profiler === undefined)
                return reject(new Error(`Profiler not available`));
            const chunks = [];
            const chunkHandler = (raw) => {
                const data = raw.params;
                chunks.push(data.chunk);
            };
            this.profiler.getSession().on('HeapProfiler.addHeapSnapshotChunk', chunkHandler);
            await this.profiler.getSession().post('HeapProfiler.takeHeapSnapshot', {
                reportProgress: false
            });
            this.profiler.getSession().removeListener('HeapProfiler.addHeapSnapshotChunk', chunkHandler);
            return resolve(chunks.join(''));
        });
    }
}
exports.default = InspectorProfiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yUHJvZmlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvZmlsZXJzL2luc3BlY3RvclByb2ZpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsb0RBQTRDO0FBQzVDLHNEQUFrRDtBQUdsRCwwREFBOEM7QUFHOUMsK0JBQThCO0FBQzlCLGlDQUFnQztBQUVoQyxNQUFNLGNBQWM7SUFDbEIsSUFBSSxDQUFRO0lBQ1osU0FBUyxDQUFRO0lBQ2pCLFNBQVMsQ0FBUTtDQUNsQjtBQUVELE1BQXFCLGlCQUFpQjtJQUU1QixRQUFRLEdBQWlDLFNBQVMsQ0FBQTtJQUNsRCxhQUFhLENBQTJCO0lBQ3hDLFNBQVMsQ0FBdUI7SUFDaEMsY0FBYyxHQUEwQixJQUFJLENBQUE7SUFDNUMsTUFBTSxHQUFhLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0lBQzVELFFBQVEsR0FBWSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBRXBGLElBQUk7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQy9DLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNoQyx1QkFBYSxDQUFDLGVBQWUsQ0FBQztnQkFDNUIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsZ0NBQWdDLEVBQUUsS0FBSztnQkFDdkMsZ0NBQWdDLEVBQUUsS0FBSztnQkFDdkMseUJBQXlCLEVBQUUsS0FBSzthQUNqQyxDQUFDLENBQUE7WUFDRixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUVBQXVFLENBQUMsQ0FBQTtRQUMvRixDQUFDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtR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
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeMetricsOptions = void 0;
const metrics_1 = require("../services/metrics");
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const histogram_1 = require("../utils/metrics/histogram");
class RuntimeMetricsOptions {
    gcOldPause;
    gcNewPause;
    pageFaults;
    contextSwitchs;
}
exports.RuntimeMetricsOptions = RuntimeMetricsOptions;
const defaultOptions = {
    gcNewPause: true,
    gcOldPause: true,
    pageFaults: true,
    contextSwitchs: true
};
class RuntimeMetrics {
    metricService;
    logger = Debug('axm:features:metrics:runtime');
    runtimeStatsService;
    handle;
    metrics = new Map();
    init(config) {
        if (config === false)
            return;
        if (config === undefined) {
            config = defaultOptions;
        }
        if (config === true) {
            config = defaultOptions;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined)
            return this.logger('Failed to load metric service');
        this.runtimeStatsService = serviceManager_1.ServiceManager.get('runtimeStats');
        if (this.runtimeStatsService === undefined)
            return this.logger('Failed to load runtime stats service');
        this.logger('init');
        const newHistogram = new histogram_1.default();
        if (config.gcNewPause === true) {
            this.metricService.registerMetric({
                name: 'GC New Space Pause',
                id: 'internal/v8/gc/new/pause/p50',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: newHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.5]);
                    return percentiles[0.5];
                }
            });
            this.metricService.registerMetric({
                name: 'GC New Space Pause p95',
                id: 'internal/v8/gc/new/pause/p95',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: newHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.95]);
                    return percentiles[0.95];
                }
            });
        }
        const oldHistogram = new histogram_1.default();
        if (config.gcOldPause === true) {
            this.metricService.registerMetric({
                name: 'GC Old Space Pause',
                id: 'internal/v8/gc/old/pause/p50',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: oldHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.5]);
                    return percentiles[0.5];
                }
            });
            this.metricService.registerMetric({
                name: 'GC Old Space Pause p95',
                id: 'internal/v8/gc/old/pause/p95',
                type: metrics_1.MetricType.histogram,
                historic: true,
                implementation: oldHistogram,
                unit: 'ms',
                handler: function () {
                    const percentiles = this.implementation.percentiles([0.95]);
                    return percentiles[0.95];
                }
            });
        }
        if (config.contextSwitchs === true) {
            const volontarySwitchs = this.metricService.histogram({
                name: 'Volontary CPU Context Switch',
                id: 'internal/uv/cpu/contextswitch/volontary',
                measurement: metrics_1.MetricMeasurements.mean
            });
            const inVolontarySwitchs = this.metricService.histogram({
                name: 'Involuntary CPU Context Switch',
                id: 'internal/uv/cpu/contextswitch/involontary',
                measurement: metrics_1.MetricMeasurements.mean
            });
            this.metrics.set('inVolontarySwitchs', inVolontarySwitchs);
            this.metrics.set('volontarySwitchs', volontarySwitchs);
        }
        if (config.pageFaults === true) {
            const softPageFault = this.metricService.histogram({
                name: 'Minor Page Fault',
                id: 'internal/uv/memory/pagefault/minor',
                measurement: metrics_1.MetricMeasurements.mean
            });
            const hardPageFault = this.metricService.histogram({
                name: 'Major Page Fault',
                id: 'internal/uv/memory/pagefault/major',
                measurement: metrics_1.MetricMeasurements.mean
            });
            this.metrics.set('softPageFault', softPageFault);
            this.metrics.set('hardPageFault', hardPageFault);
        }
        this.handle = (stats) => {
            if (typeof stats !== 'object' || typeof stats.gc !== 'object')
                return;
            newHistogram.update(stats.gc.newPause);
            oldHistogram.update(stats.gc.oldPause);
            if (typeof stats.usage !== 'object')
                return;
            const volontarySwitchs = this.metrics.get('volontarySwitchs');
            if (volontarySwitchs !== undefined) {
                volontarySwitchs.update(stats.usage.ru_nvcsw);
            }
            const inVolontarySwitchs = this.metrics.get('inVolontarySwitchs');
            if (inVolontarySwitchs !== undefined) {
                inVolontarySwitchs.update(stats.usage.ru_nivcsw);
            }
            const softPageFault = this.metrics.get('softPageFault');
            if (softPageFault !== undefined) {
                softPageFault.update(stats.usage.ru_minflt);
            }
            const hardPageFault = this.metrics.get('hardPageFault');
            if (hardPageFault !== undefined) {
                hardPageFault.update(stats.usage.ru_majflt);
            }
        };
        this.runtimeStatsService.on('data', this.handle);
    }
    destroy() {
        if (this.runtimeStatsService !== undefined) {
            this.runtimeStatsService.removeListener('data', this.handle);
        }
        this.logger('destroy');
    }
}
exports.default = RuntimeMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL3J1bnRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7QUFFWixpREFBbUY7QUFDbkYsc0RBQWtEO0FBQ2xELCtCQUE4QjtBQUU5QiwwREFBa0Q7QUFHbEQsTUFBYSxxQkFBcUI7SUFDaEMsVUFBVSxDQUFTO0lBQ25CLFVBQVUsQ0FBUztJQUtuQixVQUFVLENBQVM7SUFLbkIsY0FBYyxDQUFTO0NBQ3hCO0FBYkQsc0RBYUM7QUFFRCxNQUFNLGNBQWMsR0FBMEI7SUFDNUMsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFLElBQUk7SUFDaEIsY0FBYyxFQUFFLElBQUk7Q0FDckIsQ0FBQTtBQUVELE1BQXFCLGNBQWM7SUFFekIsYUFBYSxDQUEyQjtJQUN4QyxNQUFNLEdBQVEsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDbkQsbUJBQW1CLENBQWlDO0lBQ3BELE1BQU0sQ0FBb0M7SUFDMUMsT0FBTyxHQUEyQixJQUFJLEdBQUcsRUFBcUIsQ0FBQTtJQUV0RSxJQUFJLENBQUUsTUFBd0M7UUFDNUMsSUFBSSxNQUFNLEtBQUssS0FBSztZQUFFLE9BQU07UUFDNUIsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDekIsTUFBTSxHQUFHLGNBQWMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsTUFBTSxHQUFHLGNBQWMsQ0FBQTtRQUN6QixDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUztZQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FB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
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoopMetricOption = void 0;
const metrics_1 = require("../services/metrics");
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const histogram_1 = require("../utils/metrics/histogram");
class EventLoopMetricOption {
    eventLoopActive;
    eventLoopDelay;
}
exports.EventLoopMetricOption = EventLoopMetricOption;
const defaultOptions = {
    eventLoopActive: true,
    eventLoopDelay: true
};
class EventLoopHandlesRequestsMetric {
    metricService;
    logger = Debug('axm:features:metrics:eventloop');
    requestTimer;
    handleTimer;
    delayTimer;
    delayLoopInterval = 1000;
    runtimeStatsService;
    handle;
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
        this.logger('init');
        if (typeof process._getActiveRequests === 'function' && config.eventLoopActive === true) {
            const requestMetric = this.metricService.metric({
                name: 'Active requests',
                id: 'internal/libuv/requests',
                historic: true
            });
            this.requestTimer = setInterval(_ => {
                requestMetric.set(process._getActiveRequests().length);
            }, 1000);
            this.requestTimer.unref();
        }
        if (typeof process._getActiveHandles === 'function' && config.eventLoopActive === true) {
            const handleMetric = this.metricService.metric({
                name: 'Active handles',
                id: 'internal/libuv/handles',
                historic: true
            });
            this.handleTimer = setInterval(_ => {
                handleMetric.set(process._getActiveHandles().length);
            }, 1000);
            this.handleTimer.unref();
        }
        if (config.eventLoopDelay === false)
            return;
        const histogram = new histogram_1.default();
        const uvLatencyp50 = {
            name: 'Event Loop Latency',
            id: 'internal/libuv/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.5]);
                if (percentiles[0.5] === null)
                    return null;
                return percentiles[0.5].toFixed(2);
            },
            unit: 'ms'
        };
        const uvLatencyp95 = {
            name: 'Event Loop Latency p95',
            id: 'internal/libuv/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: function () {
                const percentiles = this.implementation.percentiles([0.95]);
                if (percentiles[0.95] === null)
                    return null;
                return percentiles[0.95].toFixed(2);
            },
            unit: 'ms'
        };
        this.metricService.registerMetric(uvLatencyp50);
        this.metricService.registerMetric(uvLatencyp95);
        this.runtimeStatsService = serviceManager_1.ServiceManager.get('runtimeStats');
        if (this.runtimeStatsService === undefined) {
            this.logger('runtimeStats module not found, fallbacking into pure js method');
            let oldTime = process.hrtime();
            this.delayTimer = setInterval(() => {
                const newTime = process.hrtime();
                const delay = (newTime[0] - oldTime[0]) * 1e3 + (newTime[1] - oldTime[1]) / 1e6 - this.delayLoopInterval;
                oldTime = newTime;
                histogram.update(delay);
            }, this.delayLoopInterval);
            this.delayTimer.unref();
        }
        else {
            this.logger('using runtimeStats module as data source for event loop latency');
            this.handle = (stats) => {
                if (typeof stats !== 'object' || !Array.isArray(stats.ticks))
                    return;
                stats.ticks.forEach((tick) => {
                    histogram.update(tick);
                });
            };
            this.runtimeStatsService.on('data', this.handle);
        }
    }
    destroy() {
        if (this.requestTimer !== undefined) {
            clearInterval(this.requestTimer);
        }
        if (this.handleTimer !== undefined) {
            clearInterval(this.handleTimer);
        }
        if (this.delayTimer !== undefined) {
            clearInterval(this.delayTimer);
        }
        if (this.runtimeStatsService !== undefined) {
            this.runtimeStatsService.removeListener('data', this.handle);
        }
        this.logger('destroy');
    }
}
exports.default = EventLoopHandlesRequestsMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRMb29wTWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL2V2ZW50TG9vcE1ldHJpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7QUFFWixpREFBK0U7QUFDL0Usc0RBQWtEO0FBQ2xELCtCQUE4QjtBQUU5QiwwREFBa0Q7QUFHbEQsTUFBYSxxQkFBcUI7SUFLaEMsZUFBZSxDQUFTO0lBS3hCLGNBQWMsQ0FBUztDQUN4QjtBQVhELHNEQVdDO0FBRUQsTUFBTSxjQUFjLEdBQTBCO0lBQzVDLGVBQWUsRUFBRSxJQUFJO0lBQ3JCLGNBQWMsRUFBRSxJQUFJO0NBQ3JCLENBQUE7QUFFRCxNQUFxQiw4QkFBOEI7SUFFekMsYUFBYSxDQUEyQjtJQUN4QyxNQUFNLEdBQVEsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDckQsWUFBWSxDQUEwQjtJQUN0QyxXQUFXLENBQTBCO0lBQ3JDLFVBQVUsQ0FBMEI7SUFDcEMsaUJBQWlCLEdBQVcsSUFBSSxDQUFBO0lBQ2hDLG1CQUFtQixDQUFpQztJQUNwRCxNQUFNLENBQWlDO0lBRS9DLElBQUksQ0FBRSxNQUF3QztRQUM1QyxJQUFJLE1BQU0sS0FBSyxLQUFLO1lBQUUsT0FBTTtRQUM1QixJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6QixNQUFNLEdBQUcsY0FBYyxDQUFBO1FBQ3pCLENBQUM7UUFDRCxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUNwQixNQUFNLEdBQUcsY0FBYyxDQUFBO1FBQ3pCLENBQUM7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLCtCQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2xELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFFekYsSUFBSSxDQUFD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
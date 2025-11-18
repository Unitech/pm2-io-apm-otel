'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMetricsConfig = void 0;
const shimmer = require("shimmer");
const debug_1 = require("debug");
const configuration_1 = require("../configuration");
const serviceManager_1 = require("../serviceManager");
const histogram_1 = require("../utils/metrics/histogram");
const requireMiddle = require("require-in-the-middle");
const metrics_1 = require("../services/metrics");
class HttpMetricsConfig {
    http;
}
exports.HttpMetricsConfig = HttpMetricsConfig;
class HttpMetrics {
    defaultConf = {
        http: true
    };
    metrics = new Map();
    logger = (0, debug_1.default)('axm:features:metrics:http');
    metricService;
    modules = {};
    hooks;
    init(config) {
        if (config === false)
            return;
        if (config === undefined) {
            config = this.defaultConf;
        }
        if (typeof config !== 'object') {
            config = this.defaultConf;
        }
        this.logger('init');
        configuration_1.default.configureModule({
            latency: true
        });
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        this.logger('hooking to require');
        this.hookRequire();
    }
    registerHttpMetric() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const histogram = new histogram_1.default();
        const p50 = {
            name: `HTTP Mean Latency`,
            id: 'internal/http/builtin/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            unit: 'ms',
            handler: () => {
                const percentiles = histogram.percentiles([0.5]);
                return percentiles[0.5];
            }
        };
        const p95 = {
            name: `HTTP P95 Latency`,
            id: 'internal/http/builtin/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: () => {
                const percentiles = histogram.percentiles([0.95]);
                return percentiles[0.95];
            },
            unit: 'ms'
        };
        const meter = {
            name: 'HTTP',
            historic: true,
            id: 'internal/http/builtin/reqs',
            unit: 'req/min'
        };
        this.metricService.registerMetric(p50);
        this.metricService.registerMetric(p95);
        this.metrics.set('http.latency', histogram);
        this.metrics.set('http.meter', this.metricService.meter(meter));
    }
    registerHttpsMetric() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const histogram = new histogram_1.default();
        const p50 = {
            name: `HTTPS Mean Latency`,
            id: 'internal/https/builtin/latency/p50',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            unit: 'ms',
            handler: () => {
                const percentiles = histogram.percentiles([0.5]);
                return percentiles[0.5];
            }
        };
        const p95 = {
            name: `HTTPS P95 Latency`,
            id: 'internal/https/builtin/latency/p95',
            type: metrics_1.MetricType.histogram,
            historic: true,
            implementation: histogram,
            handler: () => {
                const percentiles = histogram.percentiles([0.95]);
                return percentiles[0.95];
            },
            unit: 'ms'
        };
        const meter = {
            name: 'HTTPS',
            historic: true,
            id: 'internal/https/builtin/reqs',
            unit: 'req/min'
        };
        this.metricService.registerMetric(p50);
        this.metricService.registerMetric(p95);
        this.metrics.set('https.latency', histogram);
        this.metrics.set('https.meter', this.metricService.meter(meter));
    }
    destroy() {
        if (this.modules.http !== undefined) {
            this.logger('unwraping http module');
            shimmer.unwrap(this.modules.http, 'emit');
            this.modules.http = undefined;
        }
        if (this.modules.https !== undefined) {
            this.logger('unwraping https module');
            shimmer.unwrap(this.modules.https, 'emit');
            this.modules.https = undefined;
        }
        if (this.hooks) {
            this.hooks.unhook();
        }
        this.logger('destroy');
    }
    hookHttp(nodule, name) {
        if (nodule.Server === undefined || nodule.Server.prototype === undefined)
            return;
        if (this.modules[name] !== undefined)
            return this.logger(`Module ${name} already hooked`);
        this.logger(`Hooking to ${name} module`);
        this.modules[name] = nodule.Server.prototype;
        if (name === 'http') {
            this.registerHttpMetric();
        }
        else if (name === 'https') {
            this.registerHttpsMetric();
        }
        const self = this;
        shimmer.wrap(nodule.Server.prototype, 'emit', (original) => {
            return function (event, req, res) {
                if (event !== 'request')
                    return original.apply(this, arguments);
                const meter = self.metrics.get(`${name}.meter`);
                if (meter !== undefined) {
                    meter.mark();
                }
                const latency = self.metrics.get(`${name}.latency`);
                if (latency === undefined)
                    return original.apply(this, arguments);
                if (res === undefined || res === null)
                    return original.apply(this, arguments);
                const startTime = Date.now();
                res.once('finish', _ => {
                    latency.update(Date.now() - startTime);
                });
                return original.apply(this, arguments);
            };
        });
    }
    hookRequire() {
        this.hooks = requireMiddle(['http', 'https'], (exports, name) => {
            this.hookHttp(exports, name);
            return exports;
        });
    }
}
exports.default = HttpMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cE1ldHJpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWV0cmljcy9odHRwTWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7OztBQUVaLG1DQUFrQztBQUNsQyxpQ0FBeUI7QUFDekIsb0RBQTRDO0FBRTVDLHNEQUFrRDtBQUVsRCwwREFBa0Q7QUFDbEQsdURBQXNEO0FBRXRELGlEQUs0QjtBQUU1QixNQUFhLGlCQUFpQjtJQUM1QixJQUFJLENBQVM7Q0FDZDtBQUZELDhDQUVDO0FBRUQsTUFBcUIsV0FBVztJQUV0QixXQUFXLEdBQXNCO1FBQ3ZDLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQTtJQUNPLE9BQU8sR0FBcUIsSUFBSSxHQUFHLEVBQWUsQ0FBQTtJQUNsRCxNQUFNLEdBQVEsSUFBQSxlQUFLLEVBQUMsMkJBQTJCLENBQUMsQ0FBQTtJQUNoRCxhQUFhLENBQTJCO0lBQ3hDLE9BQU8sR0FBUSxFQUFFLENBQUE7SUFDakIsS0FBSyxDQUFBO0lBRWIsSUFBSSxDQUFFLE1BQW9DO1FBQ3hDLElBQUksTUFBTSxLQUFLLEtBQUs7WUFBRSxPQUFNO1FBQzVCLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBQzNCLENBQUM7UUFDRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQy9CLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1FBQzNCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25CLHVCQUFhLENBQUMsZUFBZSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxJQUFJLElBQUksQ0FB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
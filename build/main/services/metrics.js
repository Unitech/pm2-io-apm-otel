'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricService = exports.HistogramOptions = exports.MetricBulk = exports.Metric = exports.MetricMeasurements = exports.MetricType = void 0;
const meter_1 = require("../utils/metrics/meter");
const counter_1 = require("../utils/metrics/counter");
const histogram_1 = require("../utils/metrics/histogram");
const serviceManager_1 = require("../serviceManager");
const constants_1 = require("../constants");
const Debug = require("debug");
const gauge_1 = require("../utils/metrics/gauge");
exports.MetricType = {
    'meter': 'meter',
    'histogram': 'histogram',
    'counter': 'counter',
    'gauge': 'gauge',
    'metric': 'metric'
};
exports.MetricMeasurements = {
    'min': 'min',
    'max': 'max',
    'sum': 'sum',
    'count': 'count',
    'variance': 'variance',
    'mean': 'mean',
    'stddev': 'stddev',
    'median': 'median',
    'p75': 'p75',
    'p95': 'p95',
    'p99': 'p99',
    'p999': 'p999'
};
class Metric {
    name;
    id;
    historic;
    unit;
    value;
}
exports.Metric = Metric;
class MetricBulk extends Metric {
    type;
}
exports.MetricBulk = MetricBulk;
class HistogramOptions extends Metric {
    measurement;
}
exports.HistogramOptions = HistogramOptions;
class MetricService {
    metrics = new Map();
    timer = null;
    transport = null;
    logger = Debug('axm:services:metrics');
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        if (this.transport === null)
            return this.logger('Failed to init metrics service cause no transporter');
        this.logger('init');
        this.timer = setInterval(() => {
            if (this.transport === null)
                return this.logger('Abort metrics update since transport is not available');
            this.logger('refreshing metrics value');
            for (let metric of this.metrics.values()) {
                metric.value = metric.handler();
            }
            this.logger('sending update metrics value to transporter');
            const metricsToSend = Array.from(this.metrics.values())
                .filter(metric => {
                if (metric === null || metric === undefined)
                    return false;
                if (metric.value === undefined || metric.value === null)
                    return false;
                const isNumber = typeof metric.value === 'number';
                const isString = typeof metric.value === 'string';
                const isBoolean = typeof metric.value === 'boolean';
                const isValidNumber = !isNaN(metric.value);
                return isString || isBoolean || (isNumber && isValidNumber);
            });
            this.transport.setMetrics(metricsToSend);
        }, constants_1.default.METRIC_INTERVAL);
        this.timer.unref();
    }
    registerMetric(metric) {
        if (typeof metric.name !== 'string') {
            console.error(`Invalid metric name declared: ${metric.name}`);
            return console.trace();
        }
        else if (typeof metric.type !== 'string') {
            console.error(`Invalid metric type declared: ${metric.type}`);
            return console.trace();
        }
        else if (typeof metric.handler !== 'function') {
            console.error(`Invalid metric handler declared: ${metric.handler}`);
            return console.trace();
        }
        if (typeof metric.historic !== 'boolean') {
            metric.historic = true;
        }
        this.logger(`Registering new metric: ${metric.name}`);
        this.metrics.set(metric.name, metric);
    }
    meter(opts) {
        const metric = {
            name: opts.name,
            type: exports.MetricType.meter,
            id: opts.id,
            historic: opts.historic,
            implementation: new meter_1.default(opts),
            unit: opts.unit,
            handler: function () {
                return this.implementation.isUsed() ? this.implementation.val() : NaN;
            }
        };
        this.registerMetric(metric);
        return metric.implementation;
    }
    counter(opts) {
        const metric = {
            name: opts.name,
            type: exports.MetricType.counter,
            id: opts.id,
            historic: opts.historic,
            implementation: new counter_1.default(opts),
            unit: opts.unit,
            handler: function () {
                return this.implementation.isUsed() ? this.implementation.val() : NaN;
            }
        };
        this.registerMetric(metric);
        return metric.implementation;
    }
    histogram(opts) {
        if (opts.measurement === undefined || opts.measurement === null) {
            opts.measurement = exports.MetricMeasurements.mean;
        }
        const metric = {
            name: opts.name,
            type: exports.MetricType.histogram,
            id: opts.id,
            historic: opts.historic,
            implementation: new histogram_1.default(opts),
            unit: opts.unit,
            handler: function () {
                return this.implementation.isUsed() ?
                    (Math.round(this.implementation.val() * 100) / 100) : NaN;
            }
        };
        this.registerMetric(metric);
        return metric.implementation;
    }
    metric(opts) {
        let metric;
        if (typeof opts.value === 'function') {
            metric = {
                name: opts.name,
                type: exports.MetricType.gauge,
                id: opts.id,
                implementation: undefined,
                historic: opts.historic,
                unit: opts.unit,
                handler: opts.value
            };
        }
        else {
            metric = {
                name: opts.name,
                type: exports.MetricType.gauge,
                id: opts.id,
                historic: opts.historic,
                implementation: new gauge_1.default(),
                unit: opts.unit,
                handler: function () {
                    return this.implementation.isUsed() ? this.implementation.val() : NaN;
                }
            };
        }
        this.registerMetric(metric);
        return metric.implementation;
    }
    deleteMetric(name) {
        return this.metrics.delete(name);
    }
    destroy() {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.metrics.clear();
    }
}
exports.MetricService = MetricService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9tZXRyaWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7O0FBRVosa0RBQTBDO0FBQzFDLHNEQUE4QztBQUM5QywwREFBa0Q7QUFDbEQsc0RBQTJEO0FBQzNELDRDQUFvQztBQUVwQywrQkFBOEI7QUFDOUIsa0RBQTBDO0FBRTdCLFFBQUEsVUFBVSxHQUFHO0lBQ3hCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFdBQVcsRUFBRSxXQUFXO0lBQ3hCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLFFBQVEsRUFBRSxRQUFRO0NBQ1YsQ0FBQTtBQUdHLFFBQUEsa0JBQWtCLEdBQUc7SUFDaEMsS0FBSyxFQUFFLEtBQUs7SUFDWixLQUFLLEVBQUUsS0FBSztJQUNaLEtBQUssRUFBRSxLQUFLO0lBQ1osT0FBTyxFQUFFLE9BQU87SUFDaEIsVUFBVSxFQUFFLFVBQVU7SUFDdEIsTUFBTSxFQUFFLE1BQU07SUFDZCxRQUFRLEVBQUUsUUFBUTtJQUNsQixRQUFRLEVBQUUsUUFBUTtJQUNsQixLQUFLLEVBQUUsS0FBSztJQUNaLEtBQUssRUFBRSxLQUFLO0lBQ1osS0FBSyxFQUFFLEtBQUs7SUFDWixNQUFNLEVBQUUsTUFBTTtDQUNOLENBQUE7QUF3Q1YsTUFBYSxNQUFNO0lBSWpCLElBQUksQ0FBUztJQU9iLEVBQUUsQ0FBUztJQUlYLFFBQVEsQ0FBVTtJQUlsQixJQUFJLENBQVM7SUFNYixLQUFLLENBQWU7Q0FDckI7QUExQkQsd0JBMEJDO0FBRUQsTUFBYSxVQUFXLFNBQVEsTUFBTTtJQUNwQyxJQUFJLENBQVk7Q0FDakI7QUFGRCxnQ0FFQztBQUVELE1BQWEsZ0JBQWlCLFNBQVEsTUFBTTtJQUMxQyxXQUFXLENBQW9CO0NBQ2hDO0FBRkQsNENBRUM7QUFFRCxNQUFhLGFBQWE7SUFFaEIsT0FBTyxHQUFn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
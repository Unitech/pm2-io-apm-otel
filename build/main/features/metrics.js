"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsFeature = exports.MetricConfig = exports.defaultMetricConf = void 0;
const debug_1 = require("debug");
const featureManager_1 = require("../featureManager");
const eventLoopMetrics_1 = require("../metrics/eventLoopMetrics");
const network_1 = require("../metrics/network");
const httpMetrics_1 = require("../metrics/httpMetrics");
const v8_1 = require("../metrics/v8");
const runtime_1 = require("../metrics/runtime");
exports.defaultMetricConf = {
    eventLoop: true,
    network: false,
    http: true,
    runtime: true,
    v8: true
};
class MetricConfig {
    v8;
    runtime;
    http;
    network;
    eventLoop;
}
exports.MetricConfig = MetricConfig;
class AvailableMetric {
    name;
    module;
    optionsPath;
    instance;
}
const availableMetrics = [
    {
        name: 'eventloop',
        module: eventLoopMetrics_1.default,
        optionsPath: 'eventLoop'
    },
    {
        name: 'http',
        module: httpMetrics_1.default,
        optionsPath: 'http'
    },
    {
        name: 'network',
        module: network_1.default,
        optionsPath: 'network'
    },
    {
        name: 'v8',
        module: v8_1.default,
        optionsPath: 'v8'
    },
    {
        name: 'runtime',
        module: runtime_1.default,
        optionsPath: 'runtime'
    }
];
class MetricsFeature {
    logger = (0, debug_1.default)('axm:features:metrics');
    init(options) {
        if (typeof options !== 'object')
            options = {};
        this.logger('init');
        for (let availableMetric of availableMetrics) {
            const metric = new availableMetric.module();
            let config = undefined;
            if (typeof availableMetric.optionsPath !== 'string') {
                config = {};
            }
            else if (availableMetric.optionsPath === '.') {
                config = options;
            }
            else {
                config = (0, featureManager_1.getObjectAtPath)(options, availableMetric.optionsPath);
            }
            metric.init(config);
            availableMetric.instance = metric;
        }
    }
    get(name) {
        const metric = availableMetrics.find(metric => metric.name === name);
        if (metric === undefined)
            return undefined;
        return metric.instance;
    }
    destroy() {
        this.logger('destroy');
        for (let availableMetric of availableMetrics) {
            if (availableMetric.instance === undefined)
                continue;
            availableMetric.instance.destroy();
        }
    }
}
exports.MetricsFeature = MetricsFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy9tZXRyaWNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUF5QjtBQUN6QixzREFBNEQ7QUFDNUQsa0VBQW1HO0FBQ25HLGdEQUF3RTtBQUN4RSx3REFBdUU7QUFDdkUsc0NBQXlEO0FBQ3pELGdEQUEwRTtBQUU3RCxRQUFBLGlCQUFpQixHQUFpQjtJQUM3QyxTQUFTLEVBQUUsSUFBSTtJQUNmLE9BQU8sRUFBRSxLQUFLO0lBQ2QsSUFBSSxFQUFFLElBQUk7SUFDVixPQUFPLEVBQUUsSUFBSTtJQUNiLEVBQUUsRUFBRSxJQUFJO0NBQ1QsQ0FBQTtBQUVELE1BQWEsWUFBWTtJQUl2QixFQUFFLENBQTRCO0lBTTlCLE9BQU8sQ0FBa0M7SUFJekMsSUFBSSxDQUE4QjtJQUlsQyxPQUFPLENBQWlDO0lBSXhDLFNBQVMsQ0FBa0M7Q0FDNUM7QUF2QkQsb0NBdUJDO0FBRUQsTUFBTSxlQUFlO0lBSW5CLElBQUksQ0FBUTtJQUlaLE1BQU0sQ0FBNEI7SUFRbEMsV0FBVyxDQUFTO0lBSXBCLFFBQVEsQ0FBa0I7Q0FDM0I7QUFFRCxNQUFNLGdCQUFnQixHQUFzQjtJQUMxQztRQUNFLElBQUksRUFBRSxXQUFXO1FBQ2pCLE1BQU0sRUFBRSwwQkFBOEI7UUFDdEMsV0FBVyxFQUFFLFdBQVc7S0FDekI7SUFDRDtRQUNFLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLHFCQUFXO1FBQ25CLFdBQVcsRUFBRSxNQUFNO0tBQ3BCO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsU0FBUztRQUNmLE1BQU0sRUFBRSxpQkFBYTtRQUNyQixXQUFXLEVBQUUsU0FBUztLQUN2QjtJQUNEO1FBQ0UsSUFBSSxFQUFFLElBQUk7UUFDVixNQUFNLEVBQUUsWUFBUTtRQUNoQixXQUFXLEVBQUUsSUFBSTtLQUNsQjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixNQUFNLEVBQUUsaUJBQWM7UUFDdEIsV0FBVyxFQUFFLFNBQVM7S0FDdkI7Q0FDRixDQUFBO0FBT0QsTUFBYSxjQUFjO0lBRWpCLE1BQU0sR0FBYSxJQUFBLGVBQUssRUFBQyxzQkFBc0IsQ0FBQyxDQUFBO0lBRXhELElBQUksQ0FBRSxPQUFnQjtRQUNwQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7WUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFBO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFbkIsS0FBSyxJQUFJLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQzNDLElBQUksTUFBTSxHQUFRLFNBQVMsQ0FBQTtZQUMzQixJQUFJLE9BQU8sZUFBZSxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDcEQsTUFBTSxHQUFHLEVBQUUsQ0FBQTtZQUNiLENBQUM7aUJBQU0sSUFBSSxlQUFlLENBQUMsV0FBVyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUMvQyxNQUFNLEdBQUcsT0FBTyxDQUFBO1lBQ2xCLENBQUM7aUJBQU0sQ0FBQztnQkFDTixNQUFNLEdBQUcsSUFBQSxnQ0FBZSxFQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDaEUsQ0FBQztZQUlELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDbkIsZUFBZSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7UUFDbkMsQ0FBQztJQUNILENBQUM7SUFFRCxHQUFHLENBQUUsSUFBWTtRQUNmLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUE7UUFDcEUsSUFBSSxNQUFNLEtBQUssU0FBUztZQUFFLE9BQU8sU0FBUyxDQUFBO1FBQzFDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQTtJQUN4QixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDdEIsS0FBSyxJQUFJLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzdDLElBQUksZUFBZSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUFFLFNBQVE7WUFDcEQsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNwQyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBdkNELHdDQXVDQyJ9
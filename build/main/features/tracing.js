"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingFeature = void 0;
const Debug = require("debug");
const configuration_1 = require("../configuration");
const api_1 = require("@opentelemetry/api");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const zipkin_1 = require("../otel/custom-zipkin-exporter/zipkin");
const httpMethodToIgnore = [
    'options',
    'head'
];
const defaultTracingConfig = {
    enabled: true,
    outbound: false,
    samplingRate: 0,
    ignoreIncomingPaths: [],
    ignoreOutgoingUrls: [],
    createSpanWithNet: false
};
const enabledTracingConfig = {
    enabled: true,
    outbound: true,
    samplingRate: 0.5,
    ignoreIncomingPaths: [
        (_url, request) => {
            const method = (request.method || 'GET').toLowerCase();
            return httpMethodToIgnore.indexOf(method) > -1;
        },
        /(.*).js/,
        /(.*).css/,
        /(.*).png/,
        /(.*).ico/,
        /(.*).svg/,
        /webpack/
    ],
    ignoreOutgoingUrls: [],
    createSpanWithNet: false
};
class TracingFeature {
    options;
    logger = Debug('axm:tracing');
    otel;
    init(config) {
        this.logger('init tracing', config);
        if (config.tracing === undefined) {
            config.tracing = defaultTracingConfig;
        }
        else if (config.tracing === true) {
            config.tracing = enabledTracingConfig;
        }
        else if (config.tracing === false) {
            config.tracing = defaultTracingConfig;
        }
        if (config.tracing.enabled === false) {
            this.logger('tracing disabled');
            return;
        }
        else {
            this.logger('tracing enabled');
        }
        this.options = enabledTracingConfig;
        if (typeof config.apmOptions === 'object' && typeof config.apmOptions.appName === 'string') {
            this.options.serviceName = config.apmOptions.appName;
        }
        else if (typeof process.env.name === 'string') {
            this.options.serviceName = process.env.name;
        }
        if (config.tracing.ignoreOutgoingUrls === undefined) {
            config.tracing.ignoreOutgoingUrls = enabledTracingConfig.ignoreOutgoingUrls;
        }
        if (config.tracing.ignoreIncomingPaths === undefined) {
            config.tracing.ignoreIncomingPaths = enabledTracingConfig.ignoreIncomingPaths;
        }
        const traceExporter = new zipkin_1.CustomZipkinExporter();
        const serviceName = process.env.OTEL_SERVICE_NAME ||
            this.options.serviceName;
        this.otel = new sdk_node_1.NodeSDK({
            traceExporter,
            serviceName,
            instrumentations: [
                (0, auto_instrumentations_node_1.getNodeAutoInstrumentations)({
                    "@opentelemetry/instrumentation-dns": {
                        enabled: false,
                    },
                    "@opentelemetry/instrumentation-fs": {
                        enabled: false,
                    },
                    "@opentelemetry/instrumentation-net": {
                        enabled: this.options.createSpanWithNet,
                    },
                    "@opentelemetry/instrumentation-http": {
                        ignoreIncomingRequestHook: (request) => {
                            if (!this.options.ignoreIncomingPaths) {
                                return false;
                            }
                            return this.options.ignoreIncomingPaths.some((matcher) => applyMatcher(matcher, request));
                        },
                        ignoreOutgoingRequestHook: (request) => {
                            if (!this.options.ignoreOutgoingUrls) {
                                return false;
                            }
                            return this.options.ignoreOutgoingUrls.some((matcher) => applyMatcher(matcher, request));
                        },
                    },
                }),
            ],
        });
        this.otel.start();
        configuration_1.default.configureModule({
            otel_tracing: true
        });
    }
    getTracer() {
        if (!this.options.serviceName) {
            throw new Error('serviceName is required');
        }
        return api_1.trace.getTracer(this.options.serviceName);
    }
    destroy() {
        if (!this.otel)
            return;
        this.logger('stop otel tracer');
        this.otel.shutdown();
        configuration_1.default.configureModule({
            otel_tracing: false
        });
    }
}
exports.TracingFeature = TracingFeature;
function applyMatcher(matcher, request) {
    this.logger('applyMatcher', { matcher, request: request.url });
    if (!matcher) {
        return false;
    }
    if (!request.url) {
        return false;
    }
    if (typeof matcher === 'string') {
        return request.url.includes(matcher);
    }
    if (matcher instanceof RegExp) {
        return matcher.test(request.url);
    }
    return matcher(request.url, request);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy90cmFjaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUE4QjtBQUM5QixvREFBNEM7QUFHNUMsNENBRzRCO0FBRTVCLHNEQUFpRDtBQUNqRCwwRkFBd0Y7QUFDeEYsa0VBQTZFO0FBOEQ3RSxNQUFNLGtCQUFrQixHQUFHO0lBQ3pCLFNBQVM7SUFDVCxNQUFNO0NBQ1AsQ0FBQTtBQUNELE1BQU0sb0JBQW9CLEdBQWtCO0lBQzFDLE9BQU8sRUFBRSxJQUFJO0lBQ2IsUUFBUSxFQUFFLEtBQUs7SUFDZixZQUFZLEVBQUUsQ0FBQztJQUNmLG1CQUFtQixFQUFFLEVBQUU7SUFDdkIsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QixpQkFBaUIsRUFBRSxLQUFLO0NBQ3pCLENBQUE7QUFFRCxNQUFNLG9CQUFvQixHQUFrQjtJQUMxQyxPQUFPLEVBQUUsSUFBSTtJQUNiLFFBQVEsRUFBRSxJQUFJO0lBQ2QsWUFBWSxFQUFFLEdBQUc7SUFDakIsbUJBQW1CLEVBQUU7UUFDbkIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQ3RELE9BQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFDRCxTQUFTO1FBQ1QsVUFBVTtRQUNWLFVBQVU7UUFDVixVQUFVO1FBQ1YsVUFBVTtRQUNWLFNBQVM7S0FDVjtJQUNELGtCQUFrQixFQUFFLEVBQUU7SUFDdEIsaUJBQWlCLEVBQUUsS0FBSztDQUN6QixDQUFBO0FBRUQsTUFBYSxjQUFjO0lBQ2pCLE9BQU8sQ0FBZTtJQUN0QixNQUFNLEdBQWEsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3ZDLElBQUksQ0FBc0I7SUFFbEMsSUFBSSxDQUFFLE1BQWdCO1FBRXBCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRW5DLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFBO1FBQ3ZDLENBQUM7YUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQTtRQUN2QyxDQUFDO2FBQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUE7UUFDdkMsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1lBQy9CLE9BQU07UUFDUixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUNoQyxDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQTtRQUduQyxJQUFJLE9BQU8sTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMzRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQTtRQUN0RCxDQUFDO2FBQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQzdDLENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQTtRQUM3RSxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsb0JBQW9CLENBQUMsbUJBQW1CLENBQUE7UUFDL0UsQ0FBQztRQUVELE1BQU0sYUFBYSxHQUFHLElBQUksNkJBQW9CLEVBQUUsQ0FBQztRQUVuRCxNQUFNLFdBQVcsR0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFFNUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGtCQUFPLENBQUM7WUFDcEIsYUFBYTtZQUNoQixXQUFXO1lBQ1gsZ0JBQWdCLEVBQUU7Z0JBQ2pCLElBQUEsd0RBQTJCLEVBQUM7b0JBQzNCLG9DQUFvQyxFQUFFO3dCQUNyQyxPQUFPLEVBQUUsS0FBSztxQkFDZDtvQkFDRCxtQ0FBbUMsRUFBRTt3QkFDcEMsT0FBTyxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0Qsb0NBQW9DLEVBQUU7d0JBQ3JDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQjtxQkFDdkM7b0JBQ0QscUNBQXFDLEVBQUU7d0JBQ2hDLHlCQUF5QixFQUFFLENBQUMsT0FBd0IsRUFBRSxFQUFFOzRCQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dDQUN0QyxPQUFPLEtBQUssQ0FBQTs0QkFDZCxDQUFDOzRCQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTt3QkFDM0YsQ0FBQzt3QkFDRCx5QkFBeUIsRUFBRSxDQUFDLE9BQXdCLEVBQUUsRUFBRTs0QkFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQ0FDckMsT0FBTyxLQUFLLENBQUE7NEJBQ2QsQ0FBQzs0QkFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7d0JBQzFGLENBQUM7cUJBQ1A7aUJBQ0QsQ0FBQzthQUNGO1NBQ0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQix1QkFBYSxDQUFDLGVBQWUsQ0FBQztZQUM1QixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtRQUM1QyxDQUFDO1FBQ0QsT0FBTyxXQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFNO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUUvQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXJCLHVCQUFhLENBQUMsZUFBZSxDQUFDO1lBQzVCLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXZHRCx3Q0F1R0M7QUFFRCxTQUFTLFlBQVksQ0FBQyxPQUErQixFQUFFLE9BQXdCO0lBQzdFLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQTtJQUU1RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBQ0QsSUFBSSxPQUFPLFlBQVksTUFBTSxFQUFFLENBQUM7UUFDOUIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN0QyxDQUFDIn0=
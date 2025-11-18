"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingFeature = void 0;
const Debug = require("debug");
const configuration_1 = require("../configuration");
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
    async init(config) {
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
        const { NodeSDK } = await Promise.resolve().then(() => require('@opentelemetry/sdk-node'));
        const { getNodeAutoInstrumentations } = await Promise.resolve().then(() => require('@opentelemetry/auto-instrumentations-node'));
        const { CustomZipkinExporter } = await Promise.resolve().then(() => require('../otel/custom-zipkin-exporter/zipkin'));
        const traceExporter = new CustomZipkinExporter();
        const serviceName = process.env.OTEL_SERVICE_NAME ||
            this.options.serviceName;
        this.otel = new NodeSDK({
            traceExporter,
            serviceName,
            instrumentations: [
                getNodeAutoInstrumentations({
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
    async getTracer() {
        if (!this.options.serviceName) {
            throw new Error('serviceName is required');
        }
        const { trace } = await Promise.resolve().then(() => require('@opentelemetry/api'));
        return trace.getTracer(this.options.serviceName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy90cmFjaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLCtCQUE4QjtBQUM5QixvREFBNEM7QUFrRTVDLE1BQU0sa0JBQWtCLEdBQUc7SUFDekIsU0FBUztJQUNULE1BQU07Q0FDUCxDQUFBO0FBQ0QsTUFBTSxvQkFBb0IsR0FBa0I7SUFDMUMsT0FBTyxFQUFFLElBQUk7SUFDYixRQUFRLEVBQUUsS0FBSztJQUNmLFlBQVksRUFBRSxDQUFDO0lBQ2YsbUJBQW1CLEVBQUUsRUFBRTtJQUN2QixrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLGlCQUFpQixFQUFFLEtBQUs7Q0FDekIsQ0FBQTtBQUVELE1BQU0sb0JBQW9CLEdBQWtCO0lBQzFDLE9BQU8sRUFBRSxJQUFJO0lBQ2IsUUFBUSxFQUFFLElBQUk7SUFDZCxZQUFZLEVBQUUsR0FBRztJQUNqQixtQkFBbUIsRUFBRTtRQUNuQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNoQixNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDdEQsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDaEQsQ0FBQztRQUNELFNBQVM7UUFDVCxVQUFVO1FBQ1YsVUFBVTtRQUNWLFVBQVU7UUFDVixVQUFVO1FBQ1YsU0FBUztLQUNWO0lBQ0Qsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QixpQkFBaUIsRUFBRSxLQUFLO0NBQ3pCLENBQUE7QUFFRCxNQUFhLGNBQWM7SUFDakIsT0FBTyxDQUFlO0lBQ3RCLE1BQU0sR0FBYSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDdkMsSUFBSSxDQUFrQjtJQUU5QixLQUFLLENBQUMsSUFBSSxDQUFFLE1BQWdCO1FBRTFCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRW5DLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFBO1FBQ3ZDLENBQUM7YUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDbkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQTtRQUN2QyxDQUFDO2FBQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUE7UUFDdkMsQ0FBQztRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1lBQy9CLE9BQU07UUFDUixDQUFDO2FBQU0sQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUNoQyxDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQTtRQUduQyxJQUFJLE9BQU8sTUFBTSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUMzRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQTtRQUN0RCxDQUFDO2FBQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBQzdDLENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQTtRQUM3RSxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsb0JBQW9CLENBQUMsbUJBQW1CLENBQUE7UUFDL0UsQ0FBQztRQUdELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRywyQ0FBYSx5QkFBeUIsRUFBQyxDQUFBO1FBQzNELE1BQU0sRUFBRSwyQkFBMkIsRUFBRSxHQUFHLDJDQUFhLDJDQUEyQyxFQUFDLENBQUE7UUFDakcsTUFBTSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsMkNBQWEsdUNBQXVDLEVBQUMsQ0FBQTtRQUV0RixNQUFNLGFBQWEsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFFbkQsTUFBTSxXQUFXLEdBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBRTVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUM7WUFDcEIsYUFBYTtZQUNoQixXQUFXO1lBQ1gsZ0JBQWdCLEVBQUU7Z0JBQ2pCLDJCQUEyQixDQUFDO29CQUMzQixvQ0FBb0MsRUFBRTt3QkFDckMsT0FBTyxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0QsbUNBQW1DLEVBQUU7d0JBQ3BDLE9BQU8sRUFBRSxLQUFLO3FCQUNkO29CQUNELG9DQUFvQyxFQUFFO3dCQUNyQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7cUJBQ3ZDO29CQUNELHFDQUFxQyxFQUFFO3dCQUNoQyx5QkFBeUIsRUFBRSxDQUFDLE9BQXdCLEVBQUUsRUFBRTs0QkFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQ0FDdEMsT0FBTyxLQUFLLENBQUE7NEJBQ2QsQ0FBQzs0QkFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7d0JBQzNGLENBQUM7d0JBQ0QseUJBQXlCLEVBQUUsQ0FBQyxPQUF3QixFQUFFLEVBQUU7NEJBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0NBQ3JDLE9BQU8sS0FBSyxDQUFBOzRCQUNkLENBQUM7NEJBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO3dCQUMxRixDQUFDO3FCQUNQO2lCQUNELENBQUM7YUFDRjtTQUNELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEIsdUJBQWEsQ0FBQyxlQUFlLENBQUM7WUFDNUIsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxTQUFTO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBQzVDLENBQUM7UUFDRCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsMkNBQWEsb0JBQW9CLEVBQUMsQ0FBQTtRQUNwRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU07UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBRS9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFckIsdUJBQWEsQ0FBQyxlQUFlLENBQUM7WUFDNUIsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBN0dELHdDQTZHQztBQUVELFNBQVMsWUFBWSxDQUFDLE9BQStCLEVBQUUsT0FBd0I7SUFDN0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFBO0lBRTVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFDRCxJQUFJLE9BQU8sWUFBWSxNQUFNLEVBQUUsQ0FBQztRQUM5QixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3RDLENBQUMifQ==
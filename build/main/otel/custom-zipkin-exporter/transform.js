"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultStatusErrorTagName = exports.defaultStatusCodeTagName = void 0;
exports.toZipkinSpan = toZipkinSpan;
exports._toZipkinTags = _toZipkinTags;
exports._toZipkinAnnotations = _toZipkinAnnotations;
const api = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const zipkinTypes = require("./types");
const ZIPKIN_SPAN_KIND_MAPPING = {
    [api.SpanKind.CLIENT]: zipkinTypes.SpanKind.CLIENT,
    [api.SpanKind.SERVER]: zipkinTypes.SpanKind.SERVER,
    [api.SpanKind.CONSUMER]: zipkinTypes.SpanKind.CONSUMER,
    [api.SpanKind.PRODUCER]: zipkinTypes.SpanKind.PRODUCER,
    [api.SpanKind.INTERNAL]: undefined,
};
exports.defaultStatusCodeTagName = 'otel.status_code';
exports.defaultStatusErrorTagName = 'error';
function toZipkinSpan(span, serviceName, statusCodeTagName, statusErrorTagName) {
    const zipkinSpan = {
        traceId: span.spanContext().traceId,
        parentId: span.parentSpanId,
        name: span.name,
        id: span.spanContext().spanId,
        kind: ZIPKIN_SPAN_KIND_MAPPING[span.kind],
        timestamp: (0, core_1.hrTimeToMicroseconds)(span.startTime),
        duration: Math.round((0, core_1.hrTimeToMicroseconds)(span.duration)),
        localEndpoint: { serviceName },
        tags: _toZipkinTags(span, statusCodeTagName, statusErrorTagName),
        annotations: span.events.length
            ? _toZipkinAnnotations(span.events)
            : undefined,
    };
    return zipkinSpan;
}
function _toZipkinTags({ attributes, resource, status, droppedAttributesCount, droppedEventsCount, droppedLinksCount, }, statusCodeTagName, statusErrorTagName) {
    const tags = {};
    for (const key of Object.keys(attributes)) {
        tags[key] = String(attributes[key]);
    }
    if (status.code !== api.SpanStatusCode.UNSET) {
        tags[statusCodeTagName] = String(api.SpanStatusCode[status.code]);
    }
    if (status.code === api.SpanStatusCode.ERROR && status.message) {
        tags[statusErrorTagName] = status.message;
    }
    if (droppedAttributesCount) {
        tags['otel.dropped_attributes_count'] = String(droppedAttributesCount);
    }
    if (droppedEventsCount) {
        tags['otel.dropped_events_count'] = String(droppedEventsCount);
    }
    if (droppedLinksCount) {
        tags['otel.dropped_links_count'] = String(droppedLinksCount);
    }
    Object.keys(resource.attributes).forEach(name => (tags[name] = String(resource.attributes[name])));
    return tags;
}
function _toZipkinAnnotations(events) {
    return events.map(event => ({
        timestamp: Math.round((0, core_1.hrTimeToMicroseconds)(event.time)),
        value: event.name,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL290ZWwvY3VzdG9tLXppcGtpbi1leHBvcnRlci90cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBcUNBLG9DQXNCQztBQUdELHNDQTBDQztBQUtELG9EQU9DO0FBcEdELDBDQUEwQztBQUUxQyw4Q0FBMkQ7QUFDM0QsdUNBQXVDO0FBRXZDLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTTtJQUNsRCxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNO0lBQ2xELENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVE7SUFDdEQsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUTtJQUV0RCxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUztDQUNuQyxDQUFDO0FBRVcsUUFBQSx3QkFBd0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM5QyxRQUFBLHlCQUF5QixHQUFHLE9BQU8sQ0FBQztBQU1qRCxTQUFnQixZQUFZLENBQzFCLElBQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLGlCQUF5QixFQUN6QixrQkFBMEI7SUFFMUIsTUFBTSxVQUFVLEdBQXFCO1FBQ25DLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTztRQUNuQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVk7UUFDM0IsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFN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
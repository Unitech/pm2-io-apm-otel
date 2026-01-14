"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomZipkinExporter = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const index_1 = require("./platform/index");
const transform_1 = require("./transform");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const utils_1 = require("./utils");
const serviceManager_1 = require("../../serviceManager");
class CustomZipkinExporter {
    DEFAULT_SERVICE_NAME = 'OpenTelemetry Service';
    _statusCodeTagName;
    _statusDescriptionTagName;
    _urlStr;
    _send;
    _getHeaders;
    _serviceName;
    _isShutdown;
    _sendingPromises = [];
    _outbound;
    transport = serviceManager_1.ServiceManager.get('transport');
    constructor(config = {}) {
        this._urlStr = config.url || (0, core_1.getEnv)().OTEL_EXPORTER_ZIPKIN_ENDPOINT;
        this._outbound = config.outbound ?? false;
        this._send = (0, index_1.prepareSend)(this.transport, config.headers, { outbound: this._outbound });
        this._serviceName = config.serviceName;
        this._statusCodeTagName =
            config.statusCodeTagName || transform_1.defaultStatusCodeTagName;
        this._statusDescriptionTagName =
            config.statusDescriptionTagName || transform_1.defaultStatusErrorTagName;
        this._isShutdown = false;
        if (typeof config.getExportRequestHeaders === 'function') {
            this._getHeaders = (0, utils_1.prepareGetHeaders)(config.getExportRequestHeaders);
        }
        else {
            this._beforeSend = function () { };
        }
    }
    export(spans, resultCallback) {
        const serviceName = String(this._serviceName ||
            spans[0].resource.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            this.DEFAULT_SERVICE_NAME);
        api_1.diag.debug('Zipkin exporter export');
        if (this._isShutdown) {
            setTimeout(() => resultCallback({
                code: core_1.ExportResultCode.FAILED,
                error: new Error('Exporter has been shutdown'),
            }), 0);
            return;
        }
        const promise = new Promise(resolve => {
            this._sendSpans(spans, serviceName, result => {
                resolve();
                resultCallback(result);
            });
        });
        this._sendingPromises.push(promise);
        const popPromise = () => {
            const index = this._sendingPromises.indexOf(promise);
            this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
    shutdown() {
        api_1.diag.debug('Zipkin exporter shutdown');
        this._isShutdown = true;
        return this.forceFlush();
    }
    forceFlush() {
        return new Promise((resolve, reject) => {
            Promise.all(this._sendingPromises).then(() => {
                resolve();
            }, reject);
        });
    }
    _beforeSend() {
        if (this._getHeaders) {
            this._send = (0, index_1.prepareSend)(this.transport, this._getHeaders(), { outbound: this._outbound });
        }
    }
    _sendSpans(spans, serviceName, done) {
        const zipkinSpans = spans.map(span => (0, transform_1.toZipkinSpan)(span, String(span.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            span.resource.attributes[semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME] ||
            serviceName), this._statusCodeTagName, this._statusDescriptionTagName));
        this._beforeSend();
        return this._send(zipkinSpans, (result) => {
            if (done) {
                return done(result);
            }
        });
    }
}
exports.CustomZipkinExporter = CustomZipkinExporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwa2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL290ZWwvY3VzdG9tLXppcGtpbi1leHBvcnRlci96aXBraW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ0JBLDRDQUEwQztBQUMxQyw4Q0FBNkU7QUFFN0UsNENBQStDO0FBRS9DLDJDQUlxQjtBQUVyQiw4RUFBaUY7QUFDakYsbUNBQTRDO0FBRTVDLHlEQUFzRDtBQUt0RCxNQUFhLG9CQUFvQjtJQUNkLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDO0lBQy9DLGtCQUFrQixDQUFTO0lBQzNCLHlCQUF5QixDQUFTO0lBQzNDLE9BQU8sQ0FBUztJQUNoQixLQUFLLENBQTJCO0lBQ2hDLFdBQVcsQ0FBcUM7SUFDaEQsWUFBWSxDQUFVO0lBQ3RCLFdBQVcsQ0FBVTtJQUNyQixnQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO0lBQzFDLFNBQVMsQ0FBVTtJQUVuQixTQUFTLEdBQWMsK0JBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFOUQsWUFBWSxTQUFxQyxFQUFFO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFBLGFBQU0sR0FBRSxDQUFDLDZCQUE2QixDQUFDO1FBQ3BFLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFBLG1CQUFXLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN2QyxJQUFJLENBQUMsa0JBQWtCO1lBQ3JCLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxvQ0FBd0IsQ0FBQztRQUN2RCxJQUFJLENB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
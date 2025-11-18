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
    transport = serviceManager_1.ServiceManager.get('transport');
    constructor(config = {}) {
        this._urlStr = config.url || (0, core_1.getEnv)().OTEL_EXPORTER_ZIPKIN_ENDPOINT;
        this._send = (0, index_1.prepareSend)(this.transport, config.headers);
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
            this._send = (0, index_1.prepareSend)(this.transport, this._getHeaders());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwa2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL290ZWwvY3VzdG9tLXppcGtpbi1leHBvcnRlci96aXBraW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ0JBLDRDQUEwQztBQUMxQyw4Q0FBNkU7QUFFN0UsNENBQStDO0FBRS9DLDJDQUlxQjtBQUVyQiw4RUFBaUY7QUFDakYsbUNBQTRDO0FBRTVDLHlEQUFzRDtBQUt0RCxNQUFhLG9CQUFvQjtJQUNkLG9CQUFvQixHQUFHLHVCQUF1QixDQUFDO0lBQy9DLGtCQUFrQixDQUFTO0lBQzNCLHlCQUF5QixDQUFTO0lBQzNDLE9BQU8sQ0FBUztJQUNoQixLQUFLLENBQTJCO0lBQ2hDLFdBQVcsQ0FBcUM7SUFDaEQsWUFBWSxDQUFVO0lBQ3RCLFdBQVcsQ0FBVTtJQUNyQixnQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO0lBRTFDLFNBQVMsR0FBYywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUU5RCxZQUFZLFNBQXFDLEVBQUU7UUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUEsYUFBTSxHQUFFLENBQUMsNkJBQTZCLENBQUM7UUFDcEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFBLG1CQUFXLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxrQkFBa0I7WUFDckIsTUFBTSxDQUFDLGlCQUFpQixJQUFJLG9DQUF3QixDQUFDO1FBQ3ZELElBQUksQ0FBQyx5QkFBeUI7WUFDNUIsTUFBTSxDQUFDLHdCQUF3QixJQUFJLHFDQUF5QixDQUFDO1FBQy9ELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksT0FBTyxNQUFNLENBQUMs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
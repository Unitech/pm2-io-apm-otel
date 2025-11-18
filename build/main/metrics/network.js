"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTrafficConfig = void 0;
const netModule = require("net");
const metrics_1 = require("../services/metrics");
const Debug = require("debug");
const meter_1 = require("../utils/metrics/meter");
const shimmer = require("shimmer");
const serviceManager_1 = require("../serviceManager");
class NetworkTrafficConfig {
    upload;
    download;
}
exports.NetworkTrafficConfig = NetworkTrafficConfig;
const defaultConfig = {
    upload: false,
    download: false
};
const allEnabled = {
    upload: true,
    download: true
};
class NetworkMetric {
    metricService;
    timer;
    logger = Debug('axm:features:metrics:network');
    socketProto;
    init(config) {
        if (config === false)
            return;
        if (config === true) {
            config = allEnabled;
        }
        if (config === undefined) {
            config = defaultConfig;
        }
        this.metricService = serviceManager_1.ServiceManager.get('metrics');
        if (this.metricService === undefined) {
            return this.logger(`Failed to load metric service`);
        }
        if (config.download === true) {
            this.catchDownload();
        }
        if (config.upload === true) {
            this.catchUpload();
        }
        this.logger('init');
    }
    destroy() {
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
        if (this.socketProto !== undefined && this.socketProto !== null) {
            shimmer.unwrap(this.socketProto, 'read');
            shimmer.unwrap(this.socketProto, 'write');
        }
        this.logger('destroy');
    }
    catchDownload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const downloadMeter = new meter_1.default({});
        this.metricService.registerMetric({
            name: 'Network In',
            id: 'internal/network/in',
            historic: true,
            type: metrics_1.MetricType.meter,
            implementation: downloadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.read;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket read, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'read', function (original) {
                return function () {
                    this.on('data', (data) => {
                        if (typeof data.length === 'number') {
                            downloadMeter.mark(data.length);
                        }
                    });
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
    catchUpload() {
        if (this.metricService === undefined)
            return this.logger(`Failed to load metric service`);
        const uploadMeter = new meter_1.default();
        this.metricService.registerMetric({
            name: 'Network Out',
            id: 'internal/network/out',
            type: metrics_1.MetricType.meter,
            historic: true,
            implementation: uploadMeter,
            unit: 'kb/s',
            handler: function () {
                return Math.floor(this.implementation.val() / 1024 * 1000) / 1000;
            }
        });
        setTimeout(() => {
            const property = netModule.Socket.prototype.write;
            const isWrapped = property && property.__wrapped === true;
            if (isWrapped) {
                return this.logger(`Already patched socket write, canceling`);
            }
            shimmer.wrap(netModule.Socket.prototype, 'write', function (original) {
                return function (data) {
                    if (typeof data.length === 'number') {
                        uploadMeter.mark(data.length);
                    }
                    return original.apply(this, arguments);
                };
            });
        }, 500);
    }
}
exports.default = NetworkMetric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tZXRyaWNzL25ldHdvcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWdDO0FBQ2hDLGlEQUErRDtBQUUvRCwrQkFBOEI7QUFDOUIsa0RBQTBDO0FBQzFDLG1DQUFrQztBQUNsQyxzREFBa0Q7QUFFbEQsTUFBYSxvQkFBb0I7SUFDL0IsTUFBTSxDQUFTO0lBQ2YsUUFBUSxDQUFTO0NBQ2xCO0FBSEQsb0RBR0M7QUFFRCxNQUFNLGFBQWEsR0FBeUI7SUFDMUMsTUFBTSxFQUFFLEtBQUs7SUFDYixRQUFRLEVBQUUsS0FBSztDQUNoQixDQUFBO0FBRUQsTUFBTSxVQUFVLEdBQXlCO0lBQ3ZDLE1BQU0sRUFBRSxJQUFJO0lBQ1osUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFBO0FBRUQsTUFBcUIsYUFBYTtJQUN4QixhQUFhLENBQTJCO0lBQ3hDLEtBQUssQ0FBMEI7SUFDL0IsTUFBTSxHQUFhLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0lBQ3hELFdBQVcsQ0FBSztJQUV4QixJQUFJLENBQUUsTUFBdUM7UUFDM0MsSUFBSSxNQUFNLEtBQUssS0FBSztZQUFFLE9BQU07UUFDNUIsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsTUFBTSxHQUFHLFVBQVUsQ0FBQTtRQUNyQixDQUFDO1FBQ0QsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDekIsTUFBTSxHQUFHLGFBQWEsQ0FBQTtRQUN4QixDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNsRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDckMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFDckQsQ0FBQztRQUVELElBQUksTUFB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
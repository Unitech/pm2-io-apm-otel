"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EWMA_1 = require("../EWMA");
const units_1 = require("../units");
class Meter {
    _tickInterval;
    _samples;
    _timeframe;
    _rate;
    _interval;
    used = false;
    constructor(opts) {
        const self = this;
        if (typeof opts !== 'object') {
            opts = {};
        }
        this._samples = opts.samples || opts.seconds || 1;
        this._timeframe = opts.timeframe || 60;
        this._tickInterval = opts.tickInterval || 5 * units_1.default.SECONDS;
        this._rate = new EWMA_1.default(this._timeframe * units_1.default.SECONDS, this._tickInterval);
        if (opts.debug && opts.debug === true) {
            return;
        }
        this._interval = setInterval(function () {
            self._rate.tick();
        }, this._tickInterval);
        this._interval.unref();
    }
    mark = function (n = 1) {
        this.used = true;
        this._rate.update(n);
    };
    val = function () {
        return Math.round(this._rate.rate(this._samples * units_1.default.SECONDS) * 100) / 100;
    };
    isUsed() {
        return this.used;
    }
}
exports.default = Meter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbHMvbWV0cmljcy9tZXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtDQUEwQjtBQUMxQixvQ0FBNEI7QUFFNUIsTUFBcUIsS0FBSztJQUVoQixhQUFhLENBQVE7SUFDckIsUUFBUSxDQUFRO0lBQ2hCLFVBQVUsQ0FBUTtJQUNsQixLQUFLLENBQUE7SUFDTCxTQUFTLENBQUE7SUFDVCxJQUFJLEdBQVksS0FBSyxDQUFBO0lBRTdCLFlBQWEsSUFBVTtRQUNyQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUE7UUFFakIsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM3QixJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQTtRQUNqRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFBO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQTtRQUUzRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFMUUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDdEMsT0FBTTtRQUNSLENBQUM7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO1FBQ25CLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN4QixDQUFDO0lBRUQsSUFBSSxHQUFHLFVBQVUsSUFBWSxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsQ0FBQTtJQUVELEdBQUcsR0FBRztRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDL0UsQ0FBQyxDQUFBO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQTtJQUNsQixDQUFDO0NBQ0Y7QUE3Q0Qsd0JBNkNDIn0=
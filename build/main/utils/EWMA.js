"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const units_1 = require("./units");
class ExponentiallyWeightedMovingAverage {
    _timePeriod;
    _tickInterval;
    _alpha;
    _count = 0;
    _rate = 0;
    TICK_INTERVAL = 5 * units_1.default.SECONDS;
    constructor(timePeriod, tickInterval) {
        this._timePeriod = timePeriod || 1 * units_1.default.MINUTES;
        this._tickInterval = tickInterval || this.TICK_INTERVAL;
        this._alpha = 1 - Math.exp(-this._tickInterval / this._timePeriod);
    }
    update(n) {
        this._count += n;
    }
    tick() {
        const instantRate = this._count / this._tickInterval;
        this._count = 0;
        this._rate += (this._alpha * (instantRate - this._rate));
    }
    rate(timeUnit) {
        return (this._rate || 0) * timeUnit;
    }
}
exports.default = ExponentiallyWeightedMovingAverage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRVdNQS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9FV01BLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTJCO0FBRTNCLE1BQXFCLGtDQUFrQztJQUM3QyxXQUFXLENBQVE7SUFDbkIsYUFBYSxDQUFRO0lBQ3JCLE1BQU0sQ0FBUTtJQUNkLE1BQU0sR0FBVyxDQUFDLENBQUE7SUFDbEIsS0FBSyxHQUFXLENBQUMsQ0FBQTtJQUVqQixhQUFhLEdBQVcsQ0FBQyxHQUFHLGVBQUssQ0FBQyxPQUFPLENBQUE7SUFFakQsWUFBYSxVQUFtQixFQUFFLFlBQXFCO1FBQ3JELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFJLENBQUMsR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFBO1FBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUE7UUFDdkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFBO0lBQ2xCLENBQUM7SUFFRCxJQUFJO1FBQ0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQ3BELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBRWYsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQUVELElBQUksQ0FBRSxRQUFRO1FBQ1osT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFBO0lBQ3JDLENBQUM7Q0FDRjtBQTdCRCxxREE2QkMifQ==
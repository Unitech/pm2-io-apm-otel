"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Counter {
    _count;
    used = false;
    constructor(opts) {
        opts = opts || {};
        this._count = opts.count || 0;
    }
    val() {
        return this._count;
    }
    inc(n) {
        this.used = true;
        this._count += (n || 1);
    }
    dec(n) {
        this.used = true;
        this._count -= (n || 1);
    }
    reset(count) {
        this._count = count || 0;
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Counter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy9tZXRyaWNzL2NvdW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFxQixPQUFPO0lBQ2xCLE1BQU0sQ0FBUTtJQUNkLElBQUksR0FBWSxLQUFLLENBQUE7SUFFN0IsWUFBYSxJQUFLO1FBQ2hCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUE7SUFDL0IsQ0FBQztJQUVELEdBQUc7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDcEIsQ0FBQztJQUVELEdBQUcsQ0FBRSxDQUFVO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN6QixDQUFDO0lBRUQsR0FBRyxDQUFFLENBQVU7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUUsS0FBYztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztDQUNGO0FBOUJELDBCQThCQyJ9
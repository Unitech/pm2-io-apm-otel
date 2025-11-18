"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorService = void 0;
const inspector = require("inspector");
const debug_1 = require("debug");
class InspectorService {
    session = null;
    logger = (0, debug_1.default)('axm:services:inspector');
    init() {
        this.logger(`Creating new inspector session`);
        this.session = new inspector.Session();
        this.session.connect();
        this.logger('Connected to inspector');
        this.session.post('Profiler.enable');
        this.session.post('HeapProfiler.enable');
        return this.session;
    }
    getSession() {
        if (this.session === null) {
            this.session = this.init();
            return this.session;
        }
        else {
            return this.session;
        }
    }
    destroy() {
        if (this.session !== null) {
            this.session.post('Profiler.disable');
            this.session.post('HeapProfiler.disable');
            this.session.disconnect();
            this.session = null;
        }
        else {
            this.logger('No open session');
        }
    }
}
exports.InspectorService = InspectorService;
module.exports = InspectorService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zcGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2luc3BlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBc0M7QUFDdEMsaUNBQXlCO0FBRXpCLE1BQWEsZ0JBQWdCO0lBRW5CLE9BQU8sR0FBNkIsSUFBSSxDQUFBO0lBQ3hDLE1BQU0sR0FBYSxJQUFBLGVBQUssRUFBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBRTFELElBQUk7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUNyQixDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtZQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFDckIsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDaEMsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWxDRCw0Q0FrQ0M7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFBIn0=
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSend = prepareSend;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const constants_1 = require("../../../constants");
function prepareSend(transport, headers) {
    return function send(zipkinSpans, done) {
        if (zipkinSpans.length === 0) {
            api_1.diag.debug('Zipkin send with empty spans');
            return done({ code: core_1.ExportResultCode.SUCCESS });
        }
        zipkinSpans.forEach(span => {
            const isRootClient = span.kind === 'CLIENT' && !span.parentId;
            if (isRootClient && this.config.outbound === false)
                return;
            if ((span.duration > constants_1.Constants.MINIMUM_TRACE_DURATION)) {
                this.transport.send('trace-span', span);
            }
        });
        return done({ code: core_1.ExportResultCode.SUCCESS });
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9vdGVsL2N1c3RvbS16aXBraW4tZXhwb3J0ZXIvcGxhdGZvcm0vbm9kZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBNEJBLGtDQTZCQztBQXpDRCw0Q0FBMEM7QUFDMUMsOENBQXFFO0FBR3JFLGtEQUErQztBQVEvQyxTQUFnQixXQUFXLENBQ3pCLFNBQW9CLEVBQ3BCLE9BQWdDO0lBS2hDLE9BQU8sU0FBUyxJQUFJLENBQ2xCLFdBQStCLEVBQy9CLElBQW9DO1FBRXBDLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixVQUFJLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFFM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsdUJBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUE7WUFDN0QsSUFBSSxZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssS0FBSztnQkFBRSxPQUFNO1lBRzFELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFTLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDekMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsdUJBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUM7QUFDSixDQUFDIn0=
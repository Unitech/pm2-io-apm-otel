"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSend = prepareSend;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const constants_1 = require("../../../constants");
function prepareSend(transport, headers, config) {
    const outbound = config?.outbound ?? false;
    return function send(zipkinSpans, done) {
        if (zipkinSpans.length === 0) {
            api_1.diag.debug('Zipkin send with empty spans');
            return done({ code: core_1.ExportResultCode.SUCCESS });
        }
        zipkinSpans.forEach(span => {
            const isRootClient = span.kind === 'CLIENT' && !span.parentId;
            if (isRootClient && outbound === false)
                return;
            if (span.duration > constants_1.Constants.MINIMUM_TRACE_DURATION) {
                transport.send('trace-span', span);
            }
        });
        return done({ code: core_1.ExportResultCode.SUCCESS });
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9vdGVsL2N1c3RvbS16aXBraW4tZXhwb3J0ZXIvcGxhdGZvcm0vbm9kZS91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBZ0NBLGtDQWdDQztBQWhERCw0Q0FBMEM7QUFDMUMsOENBQXFFO0FBR3JFLGtEQUErQztBQVkvQyxTQUFnQixXQUFXLENBQ3pCLFNBQW9CLEVBQ3BCLE9BQWdDLEVBQ2hDLE1BQTBCO0lBRTFCLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxRQUFRLElBQUksS0FBSyxDQUFDO0lBSzNDLE9BQU8sU0FBUyxJQUFJLENBQ2xCLFdBQStCLEVBQy9CLElBQW9DO1FBRXBDLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixVQUFJLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsdUJBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBRUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUE7WUFFN0QsSUFBSSxZQUFZLElBQUksUUFBUSxLQUFLLEtBQUs7Z0JBQUUsT0FBTTtZQUc5QyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQVMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUNyRCxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNwQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixPQUFPLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSx1QkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQztBQUNKLENBQUMifQ==
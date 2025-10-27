"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportConfig = void 0;
exports.createTransport = createTransport;
const IPCTransport_1 = require("../transports/IPCTransport");
class TransportConfig {
    publicKey;
    secretKey;
    appName;
    serverName;
    sendLogs;
    logFilter;
    disableLogs;
    proxy;
}
exports.TransportConfig = TransportConfig;
function createTransport(name, config) {
    const transport = new IPCTransport_1.IPCTransport();
    transport.init(config);
    return transport;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3RyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFpRkEsMENBa0JDO0FBaEdELDZEQUF5RDtBQUl6RCxNQUFhLGVBQWU7SUFJMUIsU0FBUyxDQUFRO0lBSWpCLFNBQVMsQ0FBUTtJQUlqQixPQUFPLENBQVE7SUFNZixVQUFVLENBQVM7SUFJbkIsUUFBUSxDQUFVO0lBS2xCLFNBQVMsQ0FBa0I7SUFNM0IsV0FBVyxDQUFVO0lBUXJCLEtBQUssQ0FBUztDQUNmO0FBMUNELDBDQTBDQztBQWdDRCxTQUFnQixlQUFlLENBQUUsSUFBWSxFQUFFLE1BQXVCO0lBQ3BFLE1BQU0sU0FBUyxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFBO0lBQ3BDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdEIsT0FBTyxTQUFTLENBQUE7QUFlbEIsQ0FBQyJ9
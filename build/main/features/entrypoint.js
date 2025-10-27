"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entrypoint = void 0;
const IO_KEY = Symbol.for('@pm2/io');
class Entrypoint {
    io;
    constructor() {
        try {
            this.io = global[IO_KEY].init(this.conf());
            this.onStart(err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                this.sensors();
                this.events();
                this.actuators();
                this.io.onExit((code, signal) => {
                    this.onStop(err, () => {
                        this.io.destroy();
                    }, code, signal);
                });
                if (process && process.send)
                    process.send('ready');
            });
        }
        catch (e) {
            if (this.io) {
                this.io.destroy();
            }
            throw (e);
        }
    }
    events() {
        return;
    }
    sensors() {
        return;
    }
    actuators() {
        return;
    }
    onStart(cb) {
        throw new Error('Entrypoint onStart() not specified');
    }
    onStop(err, cb, code, signal) {
        return cb();
    }
    conf() {
        return undefined;
    }
}
exports.Entrypoint = Entrypoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mZWF0dXJlcy9lbnRyeXBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFFcEMsTUFBYSxVQUFVO0lBQ2IsRUFBRSxDQUFJO0lBRWQ7UUFDRSxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7WUFFMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDakIsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNqQixDQUFDO2dCQUVELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtnQkFDZCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQ2IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUVoQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO3dCQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO29CQUNuQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUNsQixDQUFDLENBQUMsQ0FBQTtnQkFFRixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSTtvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3BELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFFWCxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ25CLENBQUM7WUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDWCxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixPQUFNO0lBQ1IsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFNO0lBQ1IsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFNO0lBQ1IsQ0FBQztJQUVELE9BQU8sQ0FBRSxFQUFZO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBRUQsTUFBTSxDQUFFLEdBQVUsRUFBRSxFQUFZLEVBQUUsSUFBWSxFQUFFLE1BQWM7UUFDNUQsT0FBTyxFQUFFLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxJQUFJO1FBQ0YsT0FBTyxTQUFTLENBQUE7SUFDbEIsQ0FBQztDQUNGO0FBMURELGdDQTBEQyJ9
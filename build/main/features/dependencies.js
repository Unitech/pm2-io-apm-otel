"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependenciesFeature = void 0;
const serviceManager_1 = require("../serviceManager");
const Debug = require("debug");
const configuration_1 = require("../configuration");
const fs_1 = require("fs");
class DependenciesFeature {
    transport;
    logger = Debug('axm:features:dependencies');
    init() {
        this.transport = serviceManager_1.ServiceManager.get('transport');
        this.logger('init');
        const pkgPath = configuration_1.default.findPackageJson();
        if (typeof pkgPath !== 'string')
            return this.logger('failed to found pkg.json path');
        this.logger(`found pkg.json in ${pkgPath}`);
        (0, fs_1.readFile)(pkgPath, (err, data) => {
            if (err)
                return this.logger(`failed to read pkg.json`, err);
            try {
                const pkg = JSON.parse(data.toString());
                if (typeof pkg.dependencies !== 'object') {
                    return this.logger(`failed to find deps in pkg.json`);
                }
                const dependencies = Object.keys(pkg.dependencies)
                    .reduce((list, name) => {
                    list[name] = { version: pkg.dependencies[name] };
                    return list;
                }, {});
                this.logger(`collected ${Object.keys(dependencies).length} dependencies`);
                this.transport.send('application:dependencies', dependencies);
                this.logger('sent dependencies list');
            }
            catch (err) {
                return this.logger(`failed to parse pkg.json`, err);
            }
        });
    }
    destroy() {
        this.logger('destroy');
    }
}
exports.DependenciesFeature = DependenciesFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZlYXR1cmVzL2RlcGVuZGVuY2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFDbEQsK0JBQThCO0FBRzlCLG9EQUE0QztBQUM1QywyQkFBNkI7QUFLN0IsTUFBYSxtQkFBbUI7SUFFdEIsU0FBUyxDQUFXO0lBQ3BCLE1BQU0sR0FBYSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtJQUU3RCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRywrQkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRW5CLE1BQU0sT0FBTyxHQUFHLHVCQUFhLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDL0MsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFFcEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUMzQyxJQUFBLGFBQVEsRUFBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDOUIsSUFBSSxHQUFHO2dCQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUMzRCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtnQkFDdkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxZQUFZLEtBQUssUUFBUSxFQUFFLENBQUM7b0JBQ3pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO2dCQUN2RCxDQUFDO2dCQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQStCLENBQUM7cUJBQ2xFLE1BQU0sQ0FBQyxDQUFDLElBQW9CLEVBQUUsSUFBWSxFQUFFLEVBQUU7b0JBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7b0JBQ2hELE9BQU8sSUFBSSxDQUFBO2dCQUNiLENBQUMsRUFBRSxFQUFvQixDQUFDLENBQUE7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sZUFBZSxDQUFDLENBQUE7Z0JBQ3pFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLFlBQVksQ0FBQyxDQUFBO2dCQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUE7WUFDdkMsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3JELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN4QixDQUFDO0NBQ0Y7QUFyQ0Qsa0RBcUNDIn0=
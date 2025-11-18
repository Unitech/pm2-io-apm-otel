"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureConfig = exports.FeatureManager = void 0;
exports.getObjectAtPath = getObjectAtPath;
const notify_1 = require("./features/notify");
const profiling_1 = require("./features/profiling");
const events_1 = require("./features/events");
const metrics_1 = require("./features/metrics");
const tracing_1 = require("./features/tracing");
const dependencies_1 = require("./features/dependencies");
const Debug = require("debug");
function getObjectAtPath(context, path) {
    if (path.indexOf('.') === -1 && path.indexOf('[') === -1) {
        return context[path];
    }
    let crumbs = path.split(/\.|\[|\]/g);
    let i = -1;
    let len = crumbs.length;
    let result;
    while (++i < len) {
        if (i === 0)
            result = context;
        if (!crumbs[i])
            continue;
        if (result === undefined)
            break;
        result = result[crumbs[i]];
    }
    return result;
}
class AvailableFeature {
    name;
    module;
    optionsPath;
    instance;
}
const availablesFeatures = [
    {
        name: 'notify',
        optionsPath: '.',
        module: notify_1.NotifyFeature
    },
    {
        name: 'profiler',
        optionsPath: 'profiling',
        module: profiling_1.ProfilingFeature
    },
    {
        name: 'events',
        module: events_1.EventsFeature
    },
    {
        name: 'metrics',
        optionsPath: 'metrics',
        module: metrics_1.MetricsFeature
    },
    {
        name: 'tracing',
        optionsPath: '.',
        module: tracing_1.TracingFeature
    },
    {
        name: 'dependencies',
        module: dependencies_1.DependenciesFeature
    }
];
class FeatureManager {
    logger = Debug('axm:features');
    init(options) {
        for (let availableFeature of availablesFeatures) {
            this.logger(`Creating feature ${availableFeature.name}`);
            const feature = new availableFeature.module();
            let config = undefined;
            if (typeof availableFeature.optionsPath !== 'string') {
                config = {};
            }
            else if (availableFeature.optionsPath === '.') {
                config = options;
            }
            else {
                config = getObjectAtPath(options, availableFeature.optionsPath);
            }
            this.logger(`Init feature ${availableFeature.name}`);
            feature.init(config);
            availableFeature.instance = feature;
        }
    }
    get(name) {
        const feature = availablesFeatures.find(feature => feature.name === name);
        if (feature === undefined || feature.instance === undefined) {
            throw new Error(`Tried to call feature ${name} which doesn't exist or wasn't initiated`);
        }
        return feature.instance;
    }
    destroy() {
        for (let availableFeature of availablesFeatures) {
            if (availableFeature.instance === undefined)
                continue;
            this.logger(`Destroy feature ${availableFeature.name}`);
            availableFeature.instance.destroy();
        }
    }
}
exports.FeatureManager = FeatureManager;
class FeatureConfig {
}
exports.FeatureConfig = FeatureConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmVhdHVyZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsMENBa0JDO0FBM0JELDhDQUFpRDtBQUNqRCxvREFBdUQ7QUFDdkQsOENBQWlEO0FBRWpELGdEQUFtRDtBQUNuRCxnREFBbUQ7QUFDbkQsMERBQTZEO0FBQzdELCtCQUE4QjtBQUU5QixTQUFnQixlQUFlLENBQUUsT0FBZSxFQUFFLElBQVk7SUFDNUQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNWLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUE7SUFDdkIsSUFBSSxNQUFNLENBQUE7SUFFVixPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUM7WUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFBO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQUUsU0FBUTtRQUN4QixJQUFJLE1BQU0sS0FBSyxTQUFTO1lBQUUsTUFBSztRQUMvQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUM7QUFFRCxNQUFNLGdCQUFnQjtJQUlwQixJQUFJLENBQVE7SUFJWixNQUFNLENBQW9CO0lB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
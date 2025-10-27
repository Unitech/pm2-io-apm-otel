import Meter from '../utils/metrics/meter';
import Counter from '../utils/metrics/counter';
import Histogram from '../utils/metrics/histogram';
import { Service } from '../serviceManager';
import Gauge from '../utils/metrics/gauge';
export declare const MetricType: {
    readonly meter: "meter";
    readonly histogram: "histogram";
    readonly counter: "counter";
    readonly gauge: "gauge";
    readonly metric: "metric";
};
export type MetricType = (typeof MetricType)[keyof typeof MetricType];
export declare const MetricMeasurements: {
    readonly min: "min";
    readonly max: "max";
    readonly sum: "sum";
    readonly count: "count";
    readonly variance: "variance";
    readonly mean: "mean";
    readonly stddev: "stddev";
    readonly median: "median";
    readonly p75: "p75";
    readonly p95: "p95";
    readonly p99: "p99";
    readonly p999: "p999";
};
export type MetricMeasurements = (typeof MetricMeasurements)[keyof typeof MetricMeasurements];
export interface InternalMetric {
    name?: string;
    type?: MetricType;
    id?: string;
    historic?: boolean;
    unit?: string;
    handler: Function;
    implementation: any;
    value?: number;
}
export declare class Metric {
    name?: string;
    id?: string;
    historic?: boolean;
    unit?: string;
    value?: () => number;
}
export declare class MetricBulk extends Metric {
    type: MetricType;
}
export declare class HistogramOptions extends Metric {
    measurement: MetricMeasurements;
}
export declare class MetricService implements Service {
    private metrics;
    private timer;
    private transport;
    private logger;
    init(): void;
    registerMetric(metric: InternalMetric): void;
    meter(opts: Metric): Meter;
    counter(opts: Metric): Counter;
    histogram(opts: HistogramOptions): Histogram;
    metric(opts: Metric): Gauge;
    deleteMetric(name: string): boolean;
    destroy(): void;
}

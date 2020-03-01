import { Deserializable } from './deserializable.model';

export class ThresholdingModel implements Deserializable {
    public lowerHue: number;
    public lowerSaturation: number;
    public lowerValue: number;
    public upperHue: number;
    public upperSaturation: number;
    public upperValue: number;
    public erosion: number;
    public dilation: number;

    deserialize(data: any): this {
        return Object.assign(this, data);
    }
}
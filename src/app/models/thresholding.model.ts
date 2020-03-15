import { Deserializable } from './deserializable.model';

export class ThresholdingModel implements Deserializable {
    public hue = {lower: 0, upper: 179};
    public saturation = {lower: 0, upper: 255};
    public value = {lower: 0, upper: 255};
    public erosion: number;
    public dilation: number;

    deserialize(data: any): this {
        return Object.assign(this, data);
    }
}
import { Deserializable } from './deserializable.model';

export class ContourFilteringModel implements Deserializable {
    public sortMode: string;
    public area = {lower: 0, upper: 100}
    public fullness = {lower: 0, upper: 100}
    public ratio = {lower: 0, upper: 100}
    public directionFilter: string;
    public smartSpeckle: number;
    public intersectionFilter: string;

    deserialize(data: any): this {
        return Object.assign(this, data);
    }
}
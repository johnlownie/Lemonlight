import { Deserializable } from './deserializable.model';

export class OutputModel implements Deserializable {
    public targetingRegion: string;
    public targetGrouping: string;
    public crosshairMode: string;

    deserialize(data: any): this {
        return Object.assign(this, data);
    }
}
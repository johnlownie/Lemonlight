import { Deserializable } from './deserializable.model';

export class InputModel implements Deserializable {
    public pipelineType: string;
    public sourceImage: string;
    public resolution: string;
    public ledState: string;
    public orientation: string;
    public exposure: number;
    public blackLevel: number;
    public redBalance: number;
    public blueBalance: number;

    deserialize(data: any): this {
        return Object.assign(this, data);
    }
}
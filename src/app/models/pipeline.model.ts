import { Deserializable } from './deserializable.model';

import { InputModel } from './input.model';
import { ThresholdingModel } from './thresholding.model';
import { OutputModel } from './output.model';

export class PipelineModel implements Deserializable {
    id: number;
    name: string;
    feed: string;
    input: InputModel;
    thresholding: ThresholdingModel;
    output: OutputModel;

    deserialize(data: any): this {
        Object.assign(this, data);

        this.input = new InputModel().deserialize(data.input);
        this.thresholding = new ThresholdingModel().deserialize(data.thresholding);
        this.output = new OutputModel().deserialize(data.output);

        return this;
    }
}

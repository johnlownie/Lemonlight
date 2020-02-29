import { Deserializable } from './deserializable.model';

import { Input } from './input.model';
import { Thresholding } from './thresholding.model';

export class Pipeline implements Deserializable {
    id: number;
    name: string;
    feed: string;
    input: Input;
    thresholding: Thresholding;

    deserialize(data: any): this {
        Object.assign(this, data);

        this.input = new Input().deserialize(data.input);
        this.thresholding = new Thresholding().deserialize(data.thresholding);

        return this;
    }
}

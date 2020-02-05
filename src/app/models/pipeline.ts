export interface Pipeline {
    id: number;
    name: string;
    pipelineType: string;
    sourceImage: string;
    leds: string;
    orientation: string;
    exposure: number;
    redBalance: number;
    blueBalance: number;
    hue_lower: number;
    hue_upper: number;
    saturation_lower: number;
    saturation_upper: number;
    value_lower: number;
    value_upper: number;
    erosion: number;
    dilation: number;
}

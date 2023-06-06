export interface TruthTable {
    firstVariable: number;
    secondVariable: number;
    thirdVariable?: number;
    result: boolean;
}

export interface KarnaughCell {
    top: string;
    left: string;
    right: string;
    bottom: string;
    value: number;
}

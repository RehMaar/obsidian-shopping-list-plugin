export enum ParseErrorType {
    WrongFormat = "WrongFormat",
    AlternativeWithoutMainItem = "AlternativeWithoutMainItem",
    WrongPortionsFormat = "WrongPortionsFormat",
}

export class ParseError {
    line: number;
    type: ParseErrorType;

    constructor(line: number, type: ParseErrorType) {
        this.line = line;
        this.type = type;
    }
}  

export class ParseRecordError {
    type: ParseErrorType;

    constructor(type: ParseErrorType) {
        this.type = type;
    }
}
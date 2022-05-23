import { Schema } from "./schema";

export interface Row {
    objectId: number;
    readonly objectTableName: string;
    readonly record: Schema;
}

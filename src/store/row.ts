import { Schema } from "./schema";

export interface Row {
    objectTableName: string;
    objectId: number;
    record: Schema;
}

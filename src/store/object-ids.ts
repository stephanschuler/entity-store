import { Row } from "./row";
import { list } from "./list";

class ObjectIds {
    private last: number = 0;

    public constructor() {
        if (this.last === 0) {
            list.rows.forEach((row: Row) => {
                if (row.objectId >= this.last) {
                    this.last = row.objectId;
                }
            });
            this.last++;
        }
    }

    get next(): number {
        return this.last++;
    }
}

export const objectIds = new ObjectIds();

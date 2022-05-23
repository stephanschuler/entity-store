import { Row } from "./row";
import { store } from "./store";

class ObjectIds {
    private nextValue: number = 0;

    public constructor() {
        store.list$.subscribe((rows: Row[]) => {
            const allObjectIds = rows.map(row => row.objectId);
            this.nextValue = Math.max(0, ...allObjectIds) + 1;
        });
    }

    get next(): number {
        return this.nextValue++;
    }
}

export const objectIds = new ObjectIds();

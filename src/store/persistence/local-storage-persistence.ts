import { Persistence } from "./persistence";

export class LocalStoragePersistence implements Persistence {
    constructor(
        private readonly slotName: '@stephanschuler/entity-store'
    ) {
    }

    persist(rows) {
        localStorage.setItem(this.slotName, JSON.stringify(rows));
    }

    retrieve(resolve) {
        const rows = localStorage.getItem(this.slotName);
        resolve(
            rows ? JSON.parse(rows) as any : []
        );
    }
}

import { Persistence } from "./persistence";

/**
 * The LocalStoragePersistence dumps the current app state to the local store.
 *
 * For now there's only one slot but when the need arises, using different slots is an option.
 * This could be due to either performance issues, where partitioning by strategic keys would be the way to go, or due
 * to slot size limitations.
 */
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

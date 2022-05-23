import { Persistence } from "./persistence";

/**
 * The NoopPersistence is an stand-in for when no persistence should be used.
 */
export class NoopPersistence implements Persistence {
    persist(_) {
    }

    retrieve(_) {
    }
}

import { Persistence } from "./persistence";

export class NoopPersistence implements Persistence {
    persist(_) {
    }

    retrieve(_) {
    }
}

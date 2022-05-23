import { createStore, ObservableMap } from "@stencil/store";
import { BehaviorSubject } from "rxjs";
import { Row } from "./row";
import { Persistence } from "./persistence/persistence";
import { NoopPersistence } from "./persistence/noop-persistence";

interface State {
    data: Row[];
}

class Store {

    private readonly store: ObservableMap<State>;
    private subject: BehaviorSubject<Row[]>;
    private storage: Persistence = new NoopPersistence();

    set persistence(storage: Persistence) {
        this.storage = storage;
        this.storage.retrieve((rows) => {
            this.store.set('data', rows);
        });
    }

    constructor() {
        const defaultState: { data: Row[] } = {
            data: []
        };
        this.store = createStore(defaultState);
        this.subject = new BehaviorSubject<Row[]>(this.store.state.data);
        this.store.onChange('data', (data: Row[]) => {
            this.storage.persist(data);
            this.subject.next(data);
        });
    }

    public get list$() {
        return this.subject
            .asObservable();
    }

    get rows(): Row[] {
        const rows = this.store.get('data');
        Object.seal(rows);
        return rows;
    }

    set rows(rows: Row[]) {
        this.store.set('data', rows);
    }
}

export const store = new Store();

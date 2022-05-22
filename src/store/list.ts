import { createStore } from "@stencil/store";
import { BehaviorSubject } from "rxjs";
import { Row } from "./row";
import { Persistence } from "./persistence/persistence";
import { NoopPersistence } from "./persistence/noop-persistence";

interface State {
    data: Row[];
}

class List {

    private storage: Persistence = new NoopPersistence();
    private subject: BehaviorSubject<Row[]>;
    private state: State;

    set persistence(storage: Persistence) {
        this.storage = storage;
        this.storage.retrieve((rows) => {
            this.state.data = rows;
        });
    }

    constructor() {
        const defaultState: { data: Row[] } = {
            data: []
        };
        const {state, onChange} = createStore(defaultState);

        this.state = state;
        this.subject = new BehaviorSubject<Row[]>(state.data);

        onChange('data', (data: Row[]) => {
            this.storage.persist(data);
            this.subject.next(data);
        });
    }

    public get list$() {
        return this.subject
            .asObservable();
    }

    get rows(): Row[] {
        const rows = this.state.data;
        Object.seal(rows);
        return rows;
    }

    set rows(rows: Row[]) {
        this.state.data = rows;
    }
}

export const list = new List();

import { createStore } from "@stencil/store";
import { Row } from "./store/row";
import { Schema as SchemaBase } from "./store/schema";
import { store } from "./store/store";
import { objectIds } from "./store/object-ids";
import { registeredTables } from "./store/registered-tables";

export abstract class Entity<Schema extends SchemaBase> {
    private objectId: number = 0;
    private cleanOrDirtyOrNew: 'new' | 'clean' | 'dirty' = 'new';
    private readonly source: Schema;
    private readonly transient: Schema;

    get isEntityCleanOrDirtyOrNew() {
        return this.cleanOrDirtyOrNew;
    }

    constructor(source: Schema) {
        this.source = createStore(source).state;
        this.transient = createStore(source).state;

        this.resetEntity();
        this.cleanOrDirtyOrNew = 'new';
    }

    /** @internal  */
    public setState(source: Schema): void {
        Object.assign(this.source, {...source});
        if (this.cleanOrDirtyOrNew === 'clean') {
            this.resetEntity();
        }
    }

    /** @internal */
    public recognizeAsObject(objectId: number): void {
        this.objectId = objectId;
        this.cleanOrDirtyOrNew = 'clean';
    }

    protected getEntityValue<Key extends keyof Schema, Value extends Schema[Key]>(columName: Key, dataSource: 'original' | 'transient' = 'transient'): Value {
        if (dataSource === 'transient') {
            return this.transient[columName as any] as any;
        } else {
            return this.source[columName as any] as any;
        }
    }

    protected setEntityValue<Key extends keyof Schema, Value extends Schema[Key]>(columName: Key, value: Value): void {
        if (this.transient[columName] !== value) {
            this.transient[columName] = value;
            this.cleanOrDirtyOrNew = 'dirty';
        }
    }

    public saveEntity(): void {
        Object.assign(this.source, {...this.transient});
        this.cleanOrDirtyOrNew = 'clean';

        if (this.objectId !== 0) {
            return;
        }

        this.objectId = objectIds.next;
        const constructor = this.constructor;
        const objectTableName = Entity.findObjectTableNameForEntityConstructor(constructor);

        const newRow: Row = {
            objectTableName: objectTableName,
            record: {...this.transient},
            objectId: this.objectId
        };

        store.rows = [...store.rows, newRow];
    }

    public deleteEntity(): void {
        store.rows = store.rows.filter(row => {
            return row.objectId !== this.objectId;
        });
        this.objectId = 0;
        this.cleanOrDirtyOrNew = 'new';
    }

    public resetEntity(): void {
        Object.assign(this.transient, {...this.source});
        this.cleanOrDirtyOrNew = this.objectId === 0 ? 'new' : 'clean';
    }

    public static registerEntityType<ChildTable = typeof Entity>(entityConstructor: ChildTable, objectTableName: string): void {
        registeredTables.registerEntityType({
            entityConstructor: entityConstructor,
            objectTableName: objectTableName,
        });
    }

    private static findObjectTableNameForEntityConstructor<ChildTable = typeof Entity>(entityConstructor: ChildTable): string {
        return registeredTables.findObjectTableNameForEntityConstructor(entityConstructor);
    }
}

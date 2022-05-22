import { list } from "./store/list";
import { Row } from "./store/row";
import { registeredTables } from "./store/registered-tables";
import { distinctUntilChanged, map, Observable } from "rxjs";
import { Entity } from "./entity";

type Constructor = new (...args: any[]) => {};

export function Repository<OtherConstructor extends Constructor, ActualEntity = InstanceType<OtherConstructor>>(entityConstructor: OtherConstructor) {
    return new class Repository {

        public get objectTableName(): string {
            return registeredTables.findObjectTableNameForEntityConstructor(entityConstructor);
        }

        public get updates$(): Observable<ActualEntity[]> {

            const constructor: OtherConstructor = entityConstructor;
            const objectTableName: string = this.objectTableName;

            const removeOtherEntityTypesFromCollection = map(
                (rows: Row[]) => {
                    return rows.filter(row => row.objectTableName === objectTableName);
                }
            );

            const delayUntilRecordActuallyChange = distinctUntilChanged(
                (rowsBefore: Row[], rowsAfter: Row[]) => {
                    const recordsBefore = rowsBefore.map(row => row.record);
                    const recordsAfter = rowsAfter.map(row => row.record);
                    return JSON.stringify(recordsBefore) == JSON.stringify(recordsAfter);
                }
            );

            let cache: { [key: number]: Entity<any> } = {};
            const hydrateEntities = map(
                (rows: Row[]) => {
                    return rows.map(row => {
                        if (cache[row.objectId]) {
                            cache[row.objectId].setState(row.record);
                            return cache[row.objectId];
                        }
                        // @ts-ignore TS2511: Cannot create an instance of an abstract class.
                        cache[row.objectId] = new constructor(row.record);
                        cache[row.objectId].recognizeAsObject(row.objectId);
                        return cache[row.objectId];
                    });
                }
            );

            return list
                .list$
                .pipe(
                    removeOtherEntityTypesFromCollection,
                    delayUntilRecordActuallyChange,
                    hydrateEntities
                ) as any;
        }
    }
}

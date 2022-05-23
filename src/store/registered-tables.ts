export interface RegisteredTable {
    objectTableName: string,
    entityConstructor: any
}

class RegisteredTables {
    private readonly registeredTables: RegisteredTable[] = [];

    public registerEntityType(registeredTable: RegisteredTable) {
        this.registeredTables.push(registeredTable);
    }

    public findObjectTableNameForEntityConstructor(entityConstructor: any) {
        const remaining = this.registeredTables
            .filter(candidate => {
                return candidate.entityConstructor === entityConstructor;
            });
        const {objectTableName} = remaining[0];
        return objectTableName;
    }
}

export const registeredTables = new RegisteredTables();

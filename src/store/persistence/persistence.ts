import { Row } from "../row";

type Data = Row[];
type Resolver = (data: Data) => any;

export interface Persistence {
    persist(data: Data): void;

    retrieve(resolve: Resolver): void;
}

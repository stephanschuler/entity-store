import { Row } from "../row";

type Data = Row[];
type Resolver = (data: Data) => any;

/**
 * A Persistence is used to store the app state in a way where it can be retrieved on page reload.
 */
export interface Persistence {

    /**
     * Storing the current app state can be called directly because it's of no concern to the caller if storing
     * is done synchronously or asynchronously.
     *
     * @param data
     */
    persist(data: Data): void;

    /**
     * Retrieving data needs to be done via callback because there are persistence strategies that are inherently
     * asynchronous, such as e.g. RESTy storage on a remote server.
     *
     * @param resolve
     */
    retrieve(resolve: Resolver): void;
}

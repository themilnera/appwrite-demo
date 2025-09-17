import { Client, TablesDB} from "appwrite";

const projectId : string = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const endpoint : string = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

const tablesDB = new TablesDB(client);
const databaseId : string = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const tableId : string = process.env.NEXT_PUBLIC_APPWRITE_TABLE_ID!;

export { databaseId, tableId, client, tablesDB }
export abstract class DatabaseConnector<T> {
  abstract connect(): Promise<T> | T;
  abstract disconnect(): any;

  // either it will return the db instance or the result of query depending on type of implementation of database
  abstract query(...args: any[]): Promise<any> | T;
}

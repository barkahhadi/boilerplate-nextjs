export enum Permissions {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export interface Module {
  id: string;
  name: string;
  ability?: Permissions[]; // Update the type of ability to an array of Permissions
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  modules: Module[];
}

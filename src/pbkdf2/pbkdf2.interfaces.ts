import { ModuleMetadata, Type } from "@nestjs/common";

export type Pbkdf2ModuleOptions = {
  digest?: string;
  hashBytes?: number;
  saltBytes?: number;
  iterations?: number;
};

export interface Pbkdf2ModuleOptionsFactory {
  createPbkdf2ModuleOptions():
    | Promise<Pbkdf2ModuleOptions>
    | Pbkdf2ModuleOptions;
}

export interface Pbkdf2ModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (
    ...args: any[]
  ) => Promise<Pbkdf2ModuleOptions> | Pbkdf2ModuleOptions;
  inject?: any[];
  useClass?: Type<Pbkdf2ModuleOptionsFactory>;
}

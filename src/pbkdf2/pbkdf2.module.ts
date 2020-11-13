import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  Pbkdf2ModuleAsyncOptions,
  Pbkdf2ModuleOptions,
} from './pbkdf2.interfaces';
import { Pbkdf2Service } from './pbkdf2.service';

@Global()
@Module({})
export class Pbkdf2Module {
  static forRoot(options: Pbkdf2ModuleOptions): DynamicModule {
    return {
      module: Pbkdf2Module,
      providers: [
        {
          provide: 'PBKDF2_OPTIONS',
          useValue: options,
        },
        Pbkdf2Service,
      ],
      exports: ['PBKDF2_OPTIONS', Pbkdf2Service],
    };
  }

  static forRootAsync({
    imports,
    inject,
    useFactory,
    useClass,
  }: Pbkdf2ModuleAsyncOptions): DynamicModule {
    return {
      module: Pbkdf2Module,
      imports,
      providers: [
        useFactory
          ? {
              provide: 'PBKDF2_OPTIONS',
              useFactory,
              inject,
            }
          : {
              provide: 'PBKDF2_OPTIONS',
              useClass,
            },
        Pbkdf2Service,
      ],
      exports: ['PBKDF2_OPTIONS', Pbkdf2Service],
    };
  }
}

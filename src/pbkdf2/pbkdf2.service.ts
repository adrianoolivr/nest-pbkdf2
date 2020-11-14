import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Pbkdf2ModuleOptions } from './pbkdf2.interfaces';

@Injectable()
export class Pbkdf2Service {
  private readonly digest: string;
  private readonly hashBytes: number;
  private readonly saltBytes: number;
  private readonly iterations: number;
  private readonly encoding: BufferEncoding;

  constructor(
    @Inject('PBKDF2_OPTIONS') private readonly options: Pbkdf2ModuleOptions,
  ) {
    this.digest = options.digest || 'sha512';
    this.hashBytes = options.hashBytes || 32;
    this.saltBytes = options.saltBytes || 16;
    this.iterations = options.iterations || 65535;
    this.encoding = options.encoding || 'hex';
  }

  hash(
    password: string,
    saltBytes: number = this.saltBytes,
    iterations: number = this.iterations,
    hashBytes: number = this.hashBytes,
    digest: string = this.digest,
    encoding: BufferEncoding = this.encoding,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(saltBytes, function (err, salt) {
        if (err) return reject(err);

        crypto.pbkdf2(
          password,
          salt,
          iterations,
          hashBytes,
          digest,
          (err, hash) => {
            if (err) return reject(err);

            let combined = Buffer.alloc(hash.length + salt.length + 8);

            combined.writeUInt32BE(salt.length, 0);
            combined.writeUInt32BE(iterations, 4);

            salt.copy(combined, 8);
            hash.copy(combined, salt.length + 8);
            return resolve(combined.toString(encoding));
          },
        );
      });
    });
  }

  compare(
    password: string,
    combined: string,
    digest: string = this.digest,
    encoding: BufferEncoding = this.encoding,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let buffer = Buffer.from(combined, encoding);
      let saltBytes = buffer.readUInt32BE(0);
      let hashBytes = buffer.length - saltBytes - 8;
      let iterations = buffer.readUInt32BE(4);
      let salt = buffer.slice(8, saltBytes + 8);
      let hash = buffer.toString('binary', saltBytes + 8);

      crypto.pbkdf2(password, salt, iterations, hashBytes, digest, function (
        err,
        verify,
      ) {
        if (err) {
          return reject(err);
        }

        return resolve(verify.toString('binary') === hash);
      });
    });
  }

  hashSync(
    password: string,
    saltBytes: number = this.saltBytes,
    iterations: number = this.iterations,
    hashBytes: number = this.hashBytes,
    digest: string = this.digest,
    encoding: BufferEncoding = this.encoding,
  ): string {
    const salt = crypto.randomBytes(saltBytes);
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      hashBytes,
      digest,
    );
    const combined = Buffer.alloc(hash.length + salt.length + 8);

    combined.writeUInt32BE(salt.length, 0);
    combined.writeUInt32BE(iterations, 4);

    salt.copy(combined, 8);
    hash.copy(combined, salt.length + 8);
    return combined.toString(encoding);
  }

  compareSync(
    password: string,
    combined: string,
    digest: string = this.digest,
    encoding: BufferEncoding = this.encoding,
  ): boolean {
    const buffer = Buffer.from(combined, encoding);
    const saltBytes = buffer.readUInt32BE(0);
    const hashBytes = buffer.length - saltBytes - 8;
    const iterations = buffer.readUInt32BE(4);
    const salt = buffer.slice(8, saltBytes + 8);
    const hash = buffer.toString('binary', saltBytes + 8);

    const verify = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      hashBytes,
      digest,
    );
    return verify.toString('binary') === hash;
  }
}

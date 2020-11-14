# Nest PBKDF2

The PBKDF2 [NestJS](https://nestjs.com/) module for hash and compare passwords

## Installation

npm:

```bash
npm i nest-pbkdf2
```

yarn:

```bash
yarn add nest-pbkdf2
```

## Configure

app.module.ts

```ts
...
@Module({
	...
	imports: [
		...
		Pbkdf2Module.forRoot({
			// Default values
			hashBytes: 32, /* optional */
			saltBytes: 16, /* optional */
			digest: 'sha512', /* optional */
			iterations: 65535, /* optional */
		}),
		...
		// For asynchronous configuration
		...
		Pbkdf2Module.forRootAsync({
			import: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				hashBytes: config.get('HASH_BYTES')
			})
			inject: [ConfigService]
		}),
		...
		// OR
		AesGcmModule.forRootAsync({
			useClass: Pbkdf2ConfigClass
		}),
		...
	],
	...
})
...

```

your.service.ts

```ts
...
@Injectable()
export class YourService{
	constructor(private readonly pbkdf2Service: Pbkdf2Service){
	}

	async hash(text: string): Promise<string> {
		return await this.pbkdf2Service.hash(text);
	}

	hashSync(text: string): string {
    return this.pbkdf2Service.hash(text);
	}

  async compare(password: string, hash: string): Promise<boolean> {
    return await this.pbkdf2Service.compare(password, hash);
  }

	compareSync(password: string, hash: string): boolean {
		return this.pbkdf2Service.compare(password, hash);
	}
}
...
```

### Use Asynchronous methods for better performance

# notadd-addon-sms

[中文文档](./README_zh.md)

## Features

1. SMS plug-in management
2. SMS template management
3. SMS sending records management
4. Send SMS validation code using Tencent cloud SMS service
5. Verify validation code validity

## Installation

```bash
# install
yarn add @notadd/addon-sms
```

## Usage

```typescript
// application.module.ts
import { SmsModule } from "@notadd/addon-sms";

@Module({
    imports: [
        ...
        SmsModule,
        ...
    ],
    ...
})
...

// your service
import { SmsComponent } from "@notadd/addon-sms";

@Injectable()
export class ExampleService {
    constructor(
        @Inject("SmsComponentToken") private readonly smsComponentProvider: SmsComponent,
    ) { }

    // SmsRequest example：(2 , { appId: "1234567890", templateId: 123456, templateParam: ["xxxxx", "xxxxx"], "mobile": ["13512345678"] })
    async sendSms(type: number, smsRequest: SmsRequest) {
        // Send SMS, type is the type of message can only pass 0 or 1, 0 is a notification message, 1 is a verification code message
        // reuturn { code: number, message: string }
        await this.smsComponentProvider(type, smsRequest);
    }

    async smsValidator(mobile: string, validationCode: number) {
        // Judgment verification code validity
        // if success it return void，else return { code: number, message: string }
        await this.smsComponentProvider.smsValidator(mobile, validationCode);
    }
}
```
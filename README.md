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
        // SMS type 0 for notification SMS, 1 for verification code SMS, 2 for custom parameters SMS
        // on success reuturn {code: 200, message: "send message successful" }
        // on error:
        // HttpException (`specifies SMS plugin 'appId=xxxxx' does not exist`, 404)
        // HttpException (`specify message template 'templateId=xxxxx' does not exist`, 404)
        // HttpException (`send failed, reason: xxxxx`, xxxxx)
        await this.smsComponentProvider(type, smsRequest);
    }

    async smsValidator(mobile: string, validationCode: number) {
        // Judgment verification code validity
        // if success it return void，else return { code: number, message: string }
        await this.smsComponentProvider.smsValidator(mobile, validationCode);
    }
}
```
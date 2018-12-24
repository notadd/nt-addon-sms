# notadd 短信验证码插件

## 功能

1. 短信插件管理
2. 短信模板管理
3. 短信发送记录管理
4. 使用腾讯云短信服务发送短信验证码
5. 校验验证码合法性

## 安装

```bash
# install
yarn add @notadd/addon-sms
```

## 使用说明

> 第一步，导入短信插件

```typescript
import { SmsAddon } from "@notadd/addon-sms";

@Module({
    imports: [SmsAddon]
})
export class AppModule { }
```

> 第二步，创建短信插件

```typescript
import { SmsService } from "@notadd/addon-sms";

@Injectable()
export class ExampleService {
    constructor(
        @Inject(SmsService) private readonly smsService: SmsService
    ) { }

    // 创建/配置短信插件
    async test() {
        await this.smsService.createSms({
            appId: '123456789',
            appKey: 'zbcdefg123',
            signName: '签名',
            templates: [
                {
                    templateId: 122334,
                    name: '短信测试',
                    remark: '您的验证码是{1}，请于{2}分钟内填写。如非本人操作，请忽略本短信。'
                }
            ]
        });
    }
}
```

> 第三步，调用发送/验证短信方法

```typescript
import { SmsService } from "@notadd/addon-sms";

@Injectable()
export class ExampleService {
    constructor(
        @Inject(SmsService) private readonly smsService: SmsService
    ) { }

    // SmsRequest example：(2 , { appId: "1234567890", templateId: 123456, templateParam: ["xxxxx", "xxxxx"], "mobile": ["13512345678"] })
    async sendSms(type: number, smsRequest: SmsRequest) {
        // 短信类型 0为通知短信，1为验证码短信，2为自定义参数短信
        // 成功时返回 { code: 200, message: "发送短信成功" };
        //
        // 失败时会抛出以下几种异常：
        // HttpException (`指定短信插件'appId=xxxxx'不存在`, 404);
        // HttpException (`指定短信模板'templateId=xxxxx'不存在`, 404);
        // HttpException (`发送失败，原因：xxxxx`, xxxxx);
        await this.smsService.sendMessageByQCloud(type, smsRequest);
    }

    async smsValidator(mobile: string, validationCode: number) {
        // 校验验证码合法性，成功时没有返回值，失败时抛出 HttpException { code: number, message: string }
        //
        // 校验顺序：
        // step 1，判断手机号是否和接收短信手机号一致，失败时： HttpException ("输入的手机号码与接收短信的手机号码不一致", 404);
        // step 2，判断验证码是否正确，失败时： HttpException ("验证码错误", 406);
        // step 3，判断验证码是否超时，失败时： HttpException ("验证超时，请重新获取验证码", 408);
        await this.smsService.smsValidator(mobile, validationCode);
    }
}
```
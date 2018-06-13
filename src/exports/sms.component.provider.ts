import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";

export class SmsComponent {
    constructor(private readonly smsService: SmsService) { }

    /**
     * 通过腾讯云发送短信
     *
     * @param type 短信类型：0-通知短信，1-验证码短信，2-自定义参数短信
     * @param smsRequest 发送短信请求体 example: (2 , { appId: "1234567890", templateId: 123456, templateParam: ["xxxxx", "xxxxx"], "mobile": ["13512345678"] })
     */
    async sendSmsMessageByQCloud(type: 0 | 1 | 2, smsRequest: SmsRequest): Promise<{}> {
        return this.smsService.sendMessageByQCloud(type, smsRequest);
    }

    /**
     * 校验验证码合法性
     *
     * @param templateId 发送短信的模板ID
     * @param validationCode 验证码
     */
    async smsValidator(mobile: string, validationCode: number): Promise<void> {
        return this.smsService.validator(mobile, validationCode);
    }
}

export const SmsComponentToken = "SmsComponentToken";
export const SmsComponentProvider = {
    provide: SmsComponentToken,
    useFactory: (smsService: SmsService) => {
        return new SmsComponent(smsService);
    },
    inject: [SmsService]
};

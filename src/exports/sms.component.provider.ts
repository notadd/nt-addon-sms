import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";

export class SmsComponent {
    constructor(private readonly smsService: SmsService) { }

    /**
     * 通过腾讯云发送短信
     *
     * @param type 短信类型 0为通知类短信(模板无参数)，1为验证码类短信(模板有参数)
     * @param smsRequest 发送短信请求体 example: { "appId": "1234567890", "templateId": 123456, "mobile": ["13512345678"] }
     */
    async sendSmsMessageByQCloud(type: 0 | 1, smsRequest: SmsRequest): Promise<{}> {
        return this.smsService.sendMessageByQCloud(type, smsRequest);
    }

    /**
     * 校验验证码合法性
     *
     * @param templateId 发送短信的模板ID
     * @param validationCode 验证码
     */
    async smsValidator(templateId: number, validationCode: number): Promise<boolean> {
        return this.smsService.validator(templateId, validationCode);
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

import { Body, Controller, Inject, Post } from "@nestjs/common";

import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";

@Controller("sms")
export class SmsController {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) { }

    /**
     * 发送短信接口
     * @param body example: {"type": 0, smsRequest: { "appId": "1234567890", "templateId": 123456, "mobile": ["13512345678"] } }
     */
    @Post("sendMessage")
    async sendMessage(@Body() body: { type: number, smsRequest: SmsRequest }): Promise<{ code: number, message: string }> {
        if (body.type === 0 || body.type === 1) {
            return this.smsService.sendMessageByQCloud(body.type, body.smsRequest);
        }
        return { code: 406, message: "type参数有误，0为通知类短信(模板无参数)，1为验证码类短信(模板有参数)" };
    }

    /**
     * 校验验证码合法性
     *
     * @param body 发送短信的模板ID和验证码
     */
    @Post("smsValidator")
    async smsValidator(@Body() body: { templateId: number, validationCode: number }): Promise<{ code: number, message: string }> {
        const isSuccess = await this.smsService.validator(body.templateId, body.validationCode);
        const code = isSuccess ? 200 : 406;
        const message = isSuccess ? "验证通过" : "验证不通过";
        return { code, message };
    }
}

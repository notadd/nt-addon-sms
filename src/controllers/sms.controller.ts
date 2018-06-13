import { Body, Controller, HttpException, Inject, Post } from "@nestjs/common";

import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";

@Controller("sms")
export class SmsController {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) { }

    /**
     * 发送短信接口
     * @param body example: {"type": 2, smsRequest: { "appId": "1234567890", "templateId": 123456, "templateParam": ["xxxxx", "xxxxx"], "mobile": ["13512345678"] } }
     */
    @Post("sendMessage")
    async sendMessage(@Body() body: { type: number, smsRequest: SmsRequest }): Promise<{ code: number, message: string }> {
        const { type, smsRequest: { appId, templateId, mobile } } = body;

        if ([0, 1, 2].indexOf(type) === -1) {
            throw new HttpException("type参数错误：0-通知短信，1-验证码短信，2-自定义参数短信", 406);
        }

        if (!appId || !templateId || !mobile) {
            throw new HttpException("appId、templateId、mobile 参数不能为空", 406);
        }

        return this.smsService.sendMessageByQCloud(type, body.smsRequest);
    }

    /**
     * 校验验证码合法性
     *
     * @param body 发送短信的模板ID和验证码
     */
    @Post("smsValidator")
    async smsValidator(@Body() body: { mobile: string, validationCode: number }): Promise<{ code: number, message: string }> {
        const isSuccess = await this.smsService.validator(body.mobile, body.validationCode);
        const code = isSuccess ? 200 : 406;
        const message = isSuccess ? "验证通过" : "验证不通过";
        return { code, message };
    }
}

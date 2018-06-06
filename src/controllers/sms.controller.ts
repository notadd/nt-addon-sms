import { Body, Controller, Inject, Post } from "@nestjs/common";

import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { SmsService } from "../services/sms.service";

@Controller("sms")
export class SmsController {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) { }

    /**
     * 发送短信接口
     * @param body example: { "appId": "1234567890", "templateId": 123456, "mobile": ["13512345678"] }
     */
    @Post("sendMessage")
    async sendMessage(@Body() body: SmsRequest): Promise<SmsResponse> {
        return this.smsService.sendMessageByQCloud(body);
    }
}

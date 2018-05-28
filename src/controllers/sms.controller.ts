import { Body, Controller, Inject, Post } from "@nestjs/common";

import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { SmsService } from "../services/sms.service";

@Controller("sms")
export class SmsController {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) { }

    /**
     * 发送短信接口
     * @param body json: { "appId": "", "templateId": "", "mobile": [""] }
     */
    @Post("sendMessage")
    async sendMessage(@Body() body: SmsRequest): Promise<SmsResponse> {
        return this.smsService.sendMessageByQCloud(body);
    }
}

import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { SmsService } from "../services/sms.service";
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendMessage(body: SmsRequest): Promise<SmsResponse>;
}

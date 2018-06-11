import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendMessage(body: {
        type: number;
        smsRequest: SmsRequest;
    }): Promise<{
        code: number;
        message: string;
    }>;
    smsValidator(body: {
        mobile: string;
        validationCode: number;
    }): Promise<{
        code: number;
        message: string;
    }>;
}

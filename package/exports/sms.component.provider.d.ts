import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsService } from "../services/sms.service";
export declare class SmsComponent {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendSmsMessageByQCloud(type: 0 | 1 | 2, smsRequest: SmsRequest): Promise<{}>;
    smsValidator(mobile: string, validationCode: number): Promise<void>;
}
export declare const SmsComponentToken = "SmsComponentToken";
export declare const SmsComponentProvider: {
    provide: string;
    useFactory: (smsService: SmsService) => SmsComponent;
    inject: (typeof SmsService)[];
};

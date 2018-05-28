import { SmsTemplate } from "./sms-template.entity";
export declare class SmsLog {
    id: number;
    sendTime: string;
    targetMobile: string;
    smsTemplate: SmsTemplate;
    validationCode: number;
    validationTime: number;
    isSuccess: boolean;
    responseCode: string;
    responseMessage: string;
}

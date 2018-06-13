import { SmsTemplate } from "./sms-template.entity";
export declare class SmsLog {
    id: number;
    sendTime: Date;
    targetMobile: string;
    smsTemplate: SmsTemplate;
    templateParam: string;
    validationCode: number;
    validationTime: number;
    isSuccess: boolean;
    responseCode: string;
    responseMessage: string;
}

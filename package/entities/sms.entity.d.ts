import { SmsTemplate } from "./sms-template.entity";
export declare class Sms {
    appId: string;
    appKey: string;
    signName: string;
    templates: Array<SmsTemplate>;
    validationTime: number;
}

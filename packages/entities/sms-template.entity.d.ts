import { SmsLog } from "./sms-log.entity";
import { Sms } from "./sms.entity";
export declare class SmsTemplate {
    templateId: string;
    name: string;
    remark: string;
    sms: Sms;
    smsLogs: Array<SmsLog>;
}

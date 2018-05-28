import { Result } from "../interfaces/result.interface";
import { SmsInfo } from "../interfaces/sms-info.interface";
import { SmsLogInfo } from "../interfaces/sms-log-info.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { SmsService } from "../services/sms.service";
export declare class SmsResolver {
    private readonly smsService;
    constructor(smsService: SmsService);
    findAllSms(obj: any, args: any, context: any, info: any): Promise<SmsInfo>;
    findOneSms(obj: any, args: any, context: any, info: any): Promise<SmsInfo>;
    findAllSmsLog(obj: any, args: any, context: any, info: any): Promise<SmsLogInfo>;
    findOneSmsLog(obj: any, args: any, context: any, info: any): Promise<SmsLogInfo>;
    sendMessage(obj: any, args: any, context: any, info: any): Promise<SmsResponse>;
    createSms(obj: any, args: any, context: any, info: any): Promise<Result>;
    addTemplateToSms(obj: any, args: any, context: any, info: any): Promise<Result>;
    deleteSms(obj: any, args: any, context: any, info: any): Promise<Result>;
    deleteSmsTemplate(obj: any, args: any, context: any, info: any): Promise<Result>;
    updateSms(obj: any, args: any, context: any, info: any): Promise<Result>;
    updateSmsTemplate(obj: any, args: any, context: any, info: any): Promise<Result>;
}

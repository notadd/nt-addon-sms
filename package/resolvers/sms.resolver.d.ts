import { SmsTemplate } from "../entities/sms-template.entity";
import { Sms } from "../entities/sms.entity";
import { SmsInfo } from "../interfaces/sms-info.interface";
import { SmsLogInfo } from "../interfaces/sms-log-info.interface";
import { SmsService } from "../services/sms.service";
export declare class SmsResolver {
    private readonly smsService;
    constructor(smsService: SmsService);
    findAllSms(): Promise<SmsInfo>;
    findOneSms(req: any, body: {
        appId: string;
    }): Promise<SmsInfo>;
    findAllSmsLog(): Promise<SmsLogInfo>;
    findOneSmsLog(req: any, body: {
        templateId: number;
    }): Promise<SmsLogInfo>;
    sendMessage(req: any, body: any): Promise<{
        code: number;
        message: string;
    }>;
    smsValidator(req: any, body: {
        templateId: number;
        validationCode: number;
    }): Promise<{}>;
    createSms(req: any, body: {
        sms: Sms;
    }): Promise<{}>;
    addTemplateToSms(req: any, body: {
        appId: string;
        smsTemplate: Array<SmsTemplate>;
    }): Promise<{}>;
    deleteSms(req: any, body: {
        appId: string;
    }): Promise<{}>;
    deleteSmsTemplate(req: any, body: {
        templateId: string;
    }): Promise<{}>;
    updateSms(req: any, body: {
        appId: string;
        signName: string;
        validationTime: number;
    }): Promise<{}>;
    updateSmsTemplate(req: any, body: {
        templateId: number;
        name: string;
        remark: string;
    }): Promise<{}>;
}

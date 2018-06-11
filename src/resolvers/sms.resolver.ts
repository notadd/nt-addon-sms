import { Inject } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";

import { SmsTemplate } from "../entities/sms-template.entity";
import { Sms } from "../entities/sms.entity";
import { SmsInfo } from "../interfaces/sms-info.interface";
import { SmsLogInfo } from "../interfaces/sms-log-info.interface";
import { SmsService } from "../services/sms.service";

@Resolver()
export class SmsResolver {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) {
    }

    @Query("findAllSmsInfo")
    async findAllSms(): Promise<SmsInfo> {
        const sms = await this.smsService.findAllSms();
        return { code: 200, message: "获取所有短信插件信息成功", data: sms };
    }

    @Query("findSmsInfo")
    async findOneSms(req, body: { appId: string }): Promise<SmsInfo> {
        const sms = await this.smsService.findOneSms(body.appId);
        return { code: 200, message: "获取短信插件信息成功", data: [sms] };
    }

    @Query("findAllSmsLog")
    async findAllSmsLog(): Promise<SmsLogInfo> {
        const smsLog = await this.smsService.findAllSmsLog();
        return { code: 200, message: "获取所有短信发送记录成功", data: smsLog };
    }

    @Query("findSmsLog")
    async findOneSmsLog(req, body: { templateId: number }): Promise<SmsLogInfo> {
        const smsLog = await this.smsService.findOneSmsLog(body.templateId);
        return { code: 200, message: "获取短信发送记录成功", data: smsLog };
    }

    @Query("sendMessage")
    async sendMessage(req, body): Promise<{ code: number, message: string }> {
        return this.smsService.sendMessageByQCloud(body.type, body.smsRequest);
    }

    @Query("smsValidator")
    async smsValidator(req, body: { mobile: string, validationCode: number }): Promise<{}> {
        await this.smsService.validator(body.mobile, body.validationCode);
        return { code: 200, message: "验证通过" };
    }

    @Mutation("createSms")
    async createSms(req, body: { sms: Sms }): Promise<{}> {
        await this.smsService.createSms(body.sms);
        return { code: 200, message: "创建短信插件成功" };
    }

    @Mutation("addTemplateToSms")
    async addTemplateToSms(req, body: { appId: string, smsTemplate: Array<SmsTemplate> }): Promise<{}> {
        await this.smsService.addTemplateToSms(body.appId, body.smsTemplate);
        return { code: 200, message: "增加模板成功" };
    }

    @Mutation("deleteSms")
    async deleteSms(req, body: { appId: string }): Promise<{}> {
        await this.smsService.deleteSms(body.appId);
        return { code: 200, message: "删除短信插件成功" };
    }

    @Mutation("deleteSmsTemplate")
    async deleteSmsTemplate(req, body: { templateId: string }): Promise<{}> {
        await this.smsService.deleteSmsTemplate(body.templateId);
        return { code: 200, message: "删除模板成功" };
    }

    @Mutation("updateSms")
    async updateSms(req, body: { appId: string, signName: string, validationTime: number }): Promise<{}> {
        await this.smsService.updateSms(body.appId, body.signName, body.validationTime);
        return { code: 200, message: "更新短信插件成功" };
    }

    @Mutation("updateSmsTemplate")
    async updateSmsTemplate(req, body: { templateId: number, name: string, remark: string }): Promise<{}> {
        await this.smsService.updateSmsTemplate(body.templateId, body.name, body.remark);
        return { code: 200, message: "更新短信模板成功" };
    }
}

import { Inject } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";

import { Result } from "../interfaces/result.interface";
import { SmsInfo } from "../interfaces/sms-info.interface";
import { SmsLogInfo } from "../interfaces/sms-log-info.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { SmsService } from "../services/sms.service";

@Resolver()
export class SmsResolver {
    constructor(@Inject(SmsService) private readonly smsService: SmsService) {
    }

    @Query("smsInfos")
    async findAllSms(obj, args, context, info): Promise<SmsInfo> {
        const sms = await this.smsService.findAllSms();
        return { code: 200, message: "获取所有短信插件信息成功", data: sms };
    }

    @Query("smsInfo")
    async findOneSms(obj, args, context, info): Promise<SmsInfo> {
        const sms = await this.smsService.findOneSms(args.appId);
        return { code: 200, message: "获取短信插件信息成功", data: [sms] };
    }

    @Query("smsLogs")
    async findAllSmsLog(obj, args, context, info): Promise<SmsLogInfo> {
        const smsLog = await this.smsService.findAllSmsLog();
        return { code: 200, message: "获取所有短信发送记录成功", data: smsLog };
    }

    @Query("smsLog")
    async findOneSmsLog(obj, args, context, info): Promise<SmsLogInfo> {
        const smsLog = await this.smsService.findOneSmsLog(args.templateId);
        return { code: 200, message: "获取短信发送记录成功", data: smsLog };
    }

    @Query("sendMessage")
    async sendMessage(obj, args, context, info): Promise<SmsResponse> {
        return this.smsService.sendMessageByQCloud(args.smsRequest);
    }

    @Mutation("createSms")
    async createSms(obj, args, context, info): Promise<Result> {
        await this.smsService.createSms(args.sms);
        return { code: 200, message: "创建短信插件成功" };
    }

    @Mutation("addTemplateToSms")
    async addTemplateToSms(obj, args, context, info): Promise<Result> {
        await this.smsService.addTemplateToSms(args.appId, args.smsTemplate);
        return { code: 200, message: "增加模板成功" };
    }

    @Mutation("deleteSms")
    async deleteSms(obj, args, context, info): Promise<Result> {
        await this.smsService.deleteSms(args.appId);
        return { code: 200, message: "删除短信插件成功" };
    }

    @Mutation("deleteSmsTemplate")
    async deleteSmsTemplate(obj, args, context, info): Promise<Result> {
        await this.smsService.deleteSmsTemplate(args.templateId);
        return { code: 200, message: "删除模板成功" };
    }

    @Mutation("updateSms")
    async updateSms(obj, args, context, info): Promise<Result> {
        await this.smsService.updateSms(args.appId, args.signName, args.validationTime);
        return { code: 200, message: "更新短信插件成功" };
    }

    @Mutation("updateSmsTemplate")
    async updateSmsTemplate(obj, args, context, info): Promise<Result> {
        await this.smsService.updateSmsTemplate(args.templateId, args.name, args.remark);
        return { code: 200, message: "更新短信模板成功" };
    }
}

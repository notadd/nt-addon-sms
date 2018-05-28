import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { Repository } from "typeorm";

import { SmsLog } from "../entities/sms-log.entity";
import { SmsTemplate } from "../entities/sms-template.entity";
import { Sms } from "../entities/sms.entity";
import { SmsLogData } from "../interfaces/sms-log-info.interface";
import { SmsRequest } from "../interfaces/sms-request.interface";
import { SmsResponse } from "../interfaces/sms-response.interface";
import { ParamUtil } from "../utils/param.util";
import { QcloudService } from "./qcloud.service";

@Injectable()
export class SmsService {

    constructor(
        @Inject(QcloudService) private readonly qcloudService: QcloudService,
        @Inject(ParamUtil) private readonly paramUtil: ParamUtil,
        @InjectRepository(Sms) private readonly smsRepository: Repository<Sms>,
        @InjectRepository(SmsTemplate) private readonly smsTemplateRepository: Repository<SmsTemplate>,
        @InjectRepository(SmsLog) private readonly smsLogRepository: Repository<SmsLog>
    ) {
    }

    /**
     * 创建短信插件
     * @param sms 短信插件实体
     */
    async createSms(sms: Sms): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.createQueryBuilder("sms").where(`sms.app_id='${sms.appId}' OR sms.sign_name='${sms.signName}'`).getOne();
        if (existSms) {
            const existError = existSms.appId === sms.appId ? `appId=${sms.appId}` : `signName=${sms.signName}`;
            throw new HttpException(`短信插件'${existError}'已存在`, 400);
        }
        //  传入模板信息才会保存，不传入不保存
        if (sms.templates && sms.templates.length !== 0) {
            // 模板去重，返回相同模板的id
            const templates = (await this.smsTemplateRepository.findByIds(sms.templates.map(item => item.templateId))).concat(sms.templates);
            const sameTemplateId = await this.paramUtil.findSameTemplateId(templates);
            if (sameTemplateId.length !== 0) {
                throw new HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 400);
            }
        }
        try {
            // 加密 appKey
            sms.appKey = await this.paramUtil.encryptor(sms.appId, sms.appKey);
            await this.smsRepository.save(sms);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 增加短信模板
     * @param appId 短信插件id
     * @param smsTemplate 短信模板实体数组
     */
    async addTemplateToSms(appId: number, smsTemplate: Array<SmsTemplate>): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.findOne(appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
        }
        // 模板去重，返回相同模板的id
        const templates = (await this.smsTemplateRepository.findByIds(smsTemplate.map(item => item.templateId))).concat(smsTemplate);
        const sameTemplateId = await this.paramUtil.findSameTemplateId(templates);
        if (sameTemplateId.length !== 0) {
            throw new HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 400);
        }
        try {
            const newSmsTemplate = await this.smsTemplateRepository.save(smsTemplate);
            await this.smsRepository.createQueryBuilder().relation(Sms, "templates").of(existSms).add(newSmsTemplate);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 删除短信插件
     * @param appId 短信插件id
     */
    async deleteSms(appId: string): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.findOne(appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
        }
        try {
            await this.smsRepository.delete(appId);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 删除短信模板
     * @param templateId 短信模板id
     */
    async deleteSmsTemplate(templateId: string): Promise<void> {
        try {
            await this.smsTemplateRepository.delete(templateId);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 更新短信插件信息
     * @param appId 短信插件id
     * @param signName 短信签名
     * @param validationTime 验证码有效期
     */
    async updateSms(appId: string, newSignName: string, newValidationTime: number): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.findOne(appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
        } else if (await this.smsRepository.findOne({ signName: newSignName })) {
            throw new HttpException(`指定签名'signName=${newSignName}'已存在`, 400);
        }
        try {
            existSms.signName = newSignName;
            existSms.validationTime = newValidationTime;
            await this.smsRepository.save(existSms);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 更新短信模板信息
     * @param templateId 模板id
     * @param name 模板标示
     * @param remark 模板备注
     */
    async updateSmsTemplate(templateId: string, name: string, remark: string): Promise<void> {
        const existTemplate: SmsTemplate | undefined = await this.smsTemplateRepository.findOne(templateId);
        if (!existTemplate) {
            throw new HttpException(`指定短信模板'templateId=${templateId}'不存在`, 400);
        }
        try {
            existTemplate.name = name;
            existTemplate.remark = remark;
            await this.smsTemplateRepository.save(existTemplate);
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 查询指定 appId 的短信插件信息
     * @param appId 短信插件id
     */
    async findOneSms(appId: string): Promise<Sms> {
        return this.smsRepository.findOne(appId, { relations: ["templates"] });
    }

    /**
     * 查询所有短信插件信息
     */
    async findAllSms(): Promise<Array<Sms>> {
        return this.smsRepository.find({ relations: ["templates"] });
    }

    /**
     * 查询指定 templateId 的短信发送记录
     * @param templateId 短信模板id
     */
    async findOneSmsLog(templateId: string): Promise<Array<SmsLog>> {
        const existTemplate: SmsTemplate | undefined = await this.smsTemplateRepository.findOne(templateId);
        if (!existTemplate) {
            throw new HttpException(`指定短信模板'templateId=${templateId}'不存在`, 400);
        }
        return this.smsTemplateRepository.createQueryBuilder().relation(SmsTemplate, "smsLogs").of(templateId).loadMany();
    }

    /**
     * 查询所有短信发送记录
     */
    async findAllSmsLog(): Promise<Array<SmsLogData>> {
        return this.smsLogRepository.find();
    }

    /**
     * 发送短信，并保存短信发送记录
     * @param smsRequest 发送短信请求体
     */
    async sendMessageByQCloud(smsRequest: SmsRequest): Promise<SmsResponse> {
        const existSms = await this.smsRepository.findOne(smsRequest.appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${smsRequest.appId}'不存在`, 400);
        } else {
            const existTemplate = await this.smsTemplateRepository.findOne(smsRequest.templateId);
            if (!existTemplate) { throw new HttpException(`指定短信模板'templateId=${smsRequest.templateId}'不存在`, 400); }

            smsRequest.signName = existSms.signName;
            // 解密 appKey
            smsRequest.appKey = await this.paramUtil.decryptor(existSms.appId, existSms.appKey);
            // 生成验证码，传递有效时间
            const validationCode = await this.paramUtil.genValidationCode();
            const validationTime = existSms.validationTime;
            smsRequest.templateParam = [`${validationCode}`, `${validationTime}`];
            // 发送短信，调用腾讯云短信服务接口，保存 response 返回的消息和状态码
            await this.qcloudService.sendSms(smsRequest).then(resolve => {
                this.saveSmsLog(true, resolve.code, resolve.message, smsRequest, new SmsLog());
            }).catch(reject => {
                this.saveSmsLog(false, reject.code, reject.message, smsRequest, new SmsLog());
                throw new HttpException(`发送失败，原因：${reject.message}`, reject.code);
            });
            return { code: 200, message: "发送短信成功", validationCode, validationTime };
        }
    }

    /**
     * 保存短信发送记录
     * @param isSuccess 是否发送成功
     * @param responseCode 云服务api返回的状态码
     * @param responseMessage 云服务api返回的信息
     * @param smsRequest 短信发送数据实体
     * @param smsLog 短信发送记录
     */
    private async saveSmsLog(isSuccess: boolean, responseCode: string, responseMessage: string, smsRequest: SmsRequest, smsLog: SmsLog) {
        // 保存接收短信的手机号
        smsLog.targetMobile = smsRequest.mobile.join();
        // 短信验证码及有效期
        smsLog.validationCode = parseInt(smsRequest.templateParam[0]);
        smsLog.validationTime = parseInt(smsRequest.templateParam[1]);
        // 是否发送成功
        smsLog.isSuccess = isSuccess;
        smsLog.responseCode = responseCode;
        smsLog.responseMessage = responseMessage;
        // 发送时间
        smsLog.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const newLog = await this.smsLogRepository.save(smsLog);
        this.smsTemplateRepository.createQueryBuilder().relation(SmsTemplate, "smsLogs").of(smsRequest.templateId).add(newLog);
    }
}

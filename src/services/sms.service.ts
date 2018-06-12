import { HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { getConnection, Repository } from "typeorm";

import { SmsLog } from "../entities/sms-log.entity";
import { SmsTemplate } from "../entities/sms-template.entity";
import { Sms } from "../entities/sms.entity";
import { SmsLogData } from "../interfaces/sms-log-info.interface";
import { SmsRequest } from "../interfaces/sms-request.interface";
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
            await this.smsRepository.save(this.smsRepository.create(sms));
        } catch (error) {
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }

    /**
     * 增加短信模板
     * @param appId 短信插件id
     * @param smsTemplate 短信模板实体数组
     */
    async addTemplateToSms(appId: string, smsTemplate: Array<SmsTemplate>): Promise<void> {
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
        // 获取连接开启事务
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newSmsTemplate = await queryRunner.manager.save(smsTemplate);
            await queryRunner.manager.createQueryBuilder().relation(Sms, "templates").of(existSms).add(newSmsTemplate);
            // 提交事务
            await queryRunner.commitTransaction();
        } catch (error) {
            // 发生错误时，回滚
            await queryRunner.rollbackTransaction();
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
    async updateSmsTemplate(templateId: number, name: string, remark: string): Promise<void> {
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
    async findOneSmsLog(templateId: number): Promise<Array<SmsLog>> {
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
     *
     * @param type 短信类型 0为通知类短信，1为验证码类短信
     * @param smsRequest 发送短信请求体
     */
    async sendMessageByQCloud(type: 0 | 1, smsRequest: SmsRequest): Promise<{ code: number, message: string }> {
        const existSms = await this.smsRepository.findOne(smsRequest.appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${smsRequest.appId}'不存在`, 400);
        } else {
            const existTemplate = await this.smsTemplateRepository.findOne(smsRequest.templateId);
            if (!existTemplate) { throw new HttpException(`指定短信模板'templateId=${smsRequest.templateId}'不存在`, 400); }

            smsRequest.signName = existSms.signName;
            // 解密 appKey
            smsRequest.appKey = await this.paramUtil.decryptor(existSms.appId, existSms.appKey);

            let validationCode;
            let validationTime;
            // 有参数的短信模板，目前只能用于发送验证码类短信，即service会生成验证码和有效期！ TODO: 提供可变参数，参数类型为数组，参数顺序要和短信模板中定义的相对应
            smsRequest.templateParam = [];
            // 验证码类短信才有验证码和有效时间
            if (type === 1) {
                // 生成验证码，传递有效时间
                validationCode = await this.paramUtil.genValidationCode();
                validationTime = existSms.validationTime;
                smsRequest.templateParam = [`${validationCode}`, `${validationTime}`];
            }

            // 发送短信，调用腾讯云短信服务接口，保存 response 返回的消息和状态码
            await this.qcloudService.sendSms(smsRequest).then(resolve => {
                this.saveSmsLog(true, resolve.code, resolve.message, smsRequest, new SmsLog());
            }).catch(reject => {
                const rejectCode = reject.code ? reject.code : 500;
                this.saveSmsLog(false, rejectCode, reject.message, smsRequest, new SmsLog());
                throw new HttpException(`发送失败，原因：${reject.message}`, rejectCode);
            });

            return { code: 200, message: "发送短信成功" };
        }
    }

    /**
     * 校验验证码合法性
     *
     * @param mobile 手机号
     * @param validationCode 验证码
     */
    async validator(mobile: string, validationCode: number): Promise<void> {
        const exist = await this.smsLogRepository.findOne({ where: { targetMobile: mobile } });

        if (!exist) {
            throw new HttpException("输入的手机号码与接收短信的手机号码不一致", 406);
        }

        if (validationCode !== exist.validationCode) {
            throw new HttpException("验证码错误", 406);
        }

        // 如果当前时间大于有效时间(发送时间+有效期)
        if (moment().isAfter(moment(exist.sendTime, "YYYY-MM-DD HH:mm:ss").add(exist.validationTime, "m"))) {
            throw new HttpException("验证超时", 408);
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
        // 保存验证码类短信的验证码和有效期
        if (smsRequest.templateParam.length !== 0) {
            // 短信验证码及有效期
            smsLog.validationCode = parseInt(smsRequest.templateParam[0]);
            smsLog.validationTime = parseInt(smsRequest.templateParam[1]);
        }
        // 是否发送成功
        smsLog.isSuccess = isSuccess;
        smsLog.responseCode = responseCode;
        smsLog.responseMessage = responseMessage;
        // 发送时间
        smsLog.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
        // 获取连接开启事务
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newLog = await queryRunner.manager.save(smsLog);
            await queryRunner.manager.createQueryBuilder().relation(SmsTemplate, "smsLogs").of(smsRequest.templateId).add(newLog);
            // 提交事务
            await queryRunner.commitTransaction();
        } catch (error) {
            // 发生错误时，回滚
            await queryRunner.rollbackTransaction();
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        }
    }
}

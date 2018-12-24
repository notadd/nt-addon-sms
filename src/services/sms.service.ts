import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getConnection, Repository } from 'typeorm';

import { SmsLog } from '../entities/sms-log.entity';
import { SmsTemplate } from '../entities/sms-template.entity';
import { Sms } from '../entities/sms.entity';
import { SmsLogData } from '../interfaces/sms-log-info.interface';
import { SmsRequest } from '../interfaces/sms-request.interface';
import { ParamUtil } from '../utils/param.util';
import { QcloudService } from './qcloud.service';

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
        const existSms = await this.smsRepository.createQueryBuilder('sms')
            .where('sms.appId = :appId', { appId: sms.appId })
            .orWhere('sms.signName = :signName', { signName: sms.signName })
            .getOne();
        if (existSms) {
            const existError = existSms.appId === sms.appId ? `appId=${sms.appId}` : `signName=${sms.signName}`;
            throw new HttpException(`短信插件'${existError}'已存在`, 409);
        }
        //  传入模板信息才会保存，不传入不保存
        if (sms.templates && sms.templates.length !== 0) {
            // 模板去重，返回相同模板的id
            const templates = (await this.smsTemplateRepository.findByIds(sms.templates.map(item => item.templateId))).concat(sms.templates);
            const sameTemplateId = await this.paramUtil.findSameTemplateId(templates);
            if (sameTemplateId.length !== 0) {
                throw new HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 409);
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
    async addTemplateToSms(appId: string, smsTemplate: SmsTemplate[]): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.findOne(appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 404);
        }
        // 模板去重，返回相同模板的id
        const templates = (await this.smsTemplateRepository.findByIds(smsTemplate.map(item => item.templateId))).concat(smsTemplate);
        const sameTemplateId = await this.paramUtil.findSameTemplateId(templates);
        if (sameTemplateId.length !== 0) {
            throw new HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 409);
        }
        // 获取连接开启事务
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newSmsTemplate = await queryRunner.manager.save(SmsTemplate, smsTemplate);
            await queryRunner.manager.createQueryBuilder().relation(Sms, 'templates').of(existSms).add(newSmsTemplate.map(item => item.templateId));
            // 提交事务
            await queryRunner.commitTransaction();
        } catch (error) {
            // 发生错误时，回滚
            await queryRunner.rollbackTransaction();
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 删除短信插件
     * @param appId 短信插件id
     */
    async deleteSms(appId: string): Promise<void> {
        const existSms: Sms | undefined = await this.smsRepository.findOne(appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 404);
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
            throw new HttpException(`指定短信插件'appId=${appId}'不存在`, 404);
        } else if (await this.smsRepository.findOne({ signName: newSignName })) {
            throw new HttpException(`指定签名'signName=${newSignName}'已存在`, 409);
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
            throw new HttpException(`指定短信模板'templateId=${templateId}'不存在`, 404);
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
        return this.smsRepository.findOne(appId, { relations: ['templates'] });
    }

    /**
     * 查询所有短信插件信息
     */
    async findAllSms(): Promise<Sms[]> {
        return this.smsRepository.find({ relations: ['templates'] });
    }

    /**
     * 查询指定 templateId 的短信发送记录
     * @param templateId 短信模板id
     */
    async findOneSmsLog(templateId: number): Promise<SmsLogData[]> {
        const existTemplate: SmsTemplate | undefined = await this.smsTemplateRepository.findOne(templateId);
        if (!existTemplate) {
            throw new HttpException(`指定短信模板'templateId=${templateId}'不存在`, 404);
        }
        const smsLogList = await this.smsLogRepository.find({ relations: ['smsTemplate'], where: { smsTemplate: { templateId } } });
        return this.forMatSmsLogSendTime(smsLogList);
    }

    /**
     * 查询所有短信发送记录
     */
    async findAllSmsLog(): Promise<SmsLogData[]> {
        const smsLogList = await this.smsLogRepository.find();
        // 格式化日期
        return this.forMatSmsLogSendTime(smsLogList);
    }

    /**
     * 格式化短信发送记录中的发送时间
     *
     * @param smsLogList 短信发送记录日志列表
     */
    private async forMatSmsLogSendTime(smsLogList: SmsLog[]): Promise<SmsLogData[]> {
        const smsLogDataList: SmsLogData[] = smsLogList.map(item => {
            const smsLogData: SmsLogData = {
                id: item.id,
                sendTime: moment(item.sendTime).format('YYYY-MM-DD HH:mm:ss'),
                targetMobile: item.targetMobile,
                validationCode: item.validationCode,
                validationTime: item.validationTime,
                success: item.success,
                responseCode: item.responseCode,
                responseMessage: item.responseMessage
            };
            return smsLogData;
        });
        return smsLogDataList;
    }

    /**
     * 发送短信，并保存短信发送记录
     *
     * @param type 短信类型：0-通知短信，1-验证码短信，2-自定义参数短信
     * @param smsRequest 发送短信请求体
     */
    async sendMessageByQCloud(type: number, smsRequest: SmsRequest): Promise<{ code: number, message: string }> {
        const existSms = await this.smsRepository.findOne(smsRequest.appId);
        if (!existSms) {
            throw new HttpException(`指定短信插件'appId=${smsRequest.appId}'不存在`, 404);
        } else {
            const existTemplate = await this.smsTemplateRepository.findOne(smsRequest.templateId);
            if (!existTemplate) { throw new HttpException(`指定短信模板'templateId=${smsRequest.templateId}'不存在`, 404); }

            smsRequest.signName = existSms.signName;
            // 解密 appKey
            smsRequest.appKey = await this.paramUtil.decryptor(existSms.appId, existSms.appKey);

            // 判断短信类型，处理短信参数
            switch (type) {
                case 0:
                    smsRequest.templateParam = [];
                    break;
                case 1:
                    // 生成验证码，传递有效时间
                    const validationCode = await this.paramUtil.genValidationCode();
                    const validationTime = existSms.validationTime;
                    smsRequest.templateParam = [`${validationCode}`, `${validationTime}`];
                    break;
                case 2:
                    break;
                default:
                    throw new HttpException('type参数错误', 406);
            }

            // 发送短信，调用腾讯云短信服务接口，保存 response 返回的消息和状态码
            try {
                const result = await this.qcloudService.sendSms(smsRequest);
                await this.saveSmsLog(type, true, result.code, result.message, smsRequest, new SmsLog());
            } catch (error) {
                const rejectCode = error.code ? error.code : 500;
                await this.saveSmsLog(type, false, rejectCode, error.message, smsRequest, new SmsLog());
                throw new HttpException(`发送失败，原因：${error.message}`, rejectCode);
            }

            return { code: 200, message: '发送短信成功' };
        }
    }

    /**
     * 校验验证码合法性
     *
     * @param mobile 手机号
     * @param validationCode 验证码
     */
    async validator(mobile: string, validationCode: number): Promise<void> {
        const exist = await this.smsLogRepository.find({ where: { targetMobile: mobile }, order: { sendTime: 'DESC' }, take: 1 });

        if (exist.length === 0) {
            throw new HttpException('输入的手机号码与接收短信的手机号码不一致', 404);
        }

        if (validationCode !== exist[0].validationCode) {
            throw new HttpException('验证码错误', 406);
        }

        // 如果当前时间大于有效时间(发送时间+有效期)
        if (moment().isAfter(moment(exist[0].sendTime, 'YYYY-MM-DD HH:mm:ss').add(exist[0].validationTime, 'm'))) {
            throw new HttpException('验证超时，请重新获取验证码', 408);
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
    private async saveSmsLog(type: number, success: boolean, responseCode: string, responseMessage: string, smsRequest: SmsRequest, smsLog: SmsLog) {
        // 保存接收短信的手机号
        smsLog.targetMobile = smsRequest.mobile.join();
        // 保存验证码类短信的验证码和有效期
        if (type === 1) {
            // 短信验证码及有效期
            smsLog.validationCode = parseInt(smsRequest.templateParam[0]);
            smsLog.validationTime = parseInt(smsRequest.templateParam[1]);
        }
        // 保存自定义参数短信中输入的参数
        if (type === 2) {
            smsLog.templateParam = JSON.stringify(smsRequest.templateParam);
        }
        // 是否发送成功
        smsLog.success = success;
        smsLog.responseCode = responseCode;
        smsLog.responseMessage = responseMessage;
        // 发送时间
        smsLog.sendTime = moment().toDate();
        // 获取连接开启事务
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const newLog = await queryRunner.manager.save(smsLog);
            await queryRunner.manager.createQueryBuilder().relation(SmsTemplate, 'smsLogs').of(smsRequest.templateId).add(newLog);
            // 提交事务
            await queryRunner.commitTransaction();
        } catch (error) {
            // 发生错误时，回滚
            await queryRunner.rollbackTransaction();
            throw new HttpException(`数据库错误：${error.toString()}`, 501);
        } finally {
            await queryRunner.release();
        }
    }
}

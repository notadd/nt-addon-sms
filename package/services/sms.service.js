"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment = require("moment");
const typeorm_2 = require("typeorm");
const sms_log_entity_1 = require("../entities/sms-log.entity");
const sms_template_entity_1 = require("../entities/sms-template.entity");
const sms_entity_1 = require("../entities/sms.entity");
const param_util_1 = require("../utils/param.util");
const qcloud_service_1 = require("./qcloud.service");
let SmsService = class SmsService {
    constructor(qcloudService, paramUtil, smsRepository, smsTemplateRepository, smsLogRepository) {
        this.qcloudService = qcloudService;
        this.paramUtil = paramUtil;
        this.smsRepository = smsRepository;
        this.smsTemplateRepository = smsTemplateRepository;
        this.smsLogRepository = smsLogRepository;
    }
    createSms(sms) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSms = yield this.smsRepository.createQueryBuilder("sms").where(`sms.app_id='${sms.appId}' OR sms.sign_name='${sms.signName}'`).getOne();
            if (existSms) {
                const existError = existSms.appId === sms.appId ? `appId=${sms.appId}` : `signName=${sms.signName}`;
                throw new common_1.HttpException(`短信插件'${existError}'已存在`, 400);
            }
            if (sms.templates && sms.templates.length !== 0) {
                const templates = (yield this.smsTemplateRepository.findByIds(sms.templates.map(item => item.templateId))).concat(sms.templates);
                const sameTemplateId = yield this.paramUtil.findSameTemplateId(templates);
                if (sameTemplateId.length !== 0) {
                    throw new common_1.HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 400);
                }
            }
            try {
                sms.appKey = yield this.paramUtil.encryptor(sms.appId, sms.appKey);
                yield this.smsRepository.save(sms);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    addTemplateToSms(appId, smsTemplate) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSms = yield this.smsRepository.findOne(appId);
            if (!existSms) {
                throw new common_1.HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
            }
            const templates = (yield this.smsTemplateRepository.findByIds(smsTemplate.map(item => item.templateId))).concat(smsTemplate);
            const sameTemplateId = yield this.paramUtil.findSameTemplateId(templates);
            if (sameTemplateId.length !== 0) {
                throw new common_1.HttpException(`存在相同模板templateId='[${sameTemplateId.toString()}]'`, 400);
            }
            try {
                const newSmsTemplate = yield this.smsTemplateRepository.save(smsTemplate);
                yield this.smsRepository.createQueryBuilder().relation(sms_entity_1.Sms, "templates").of(existSms).add(newSmsTemplate);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    deleteSms(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSms = yield this.smsRepository.findOne(appId);
            if (!existSms) {
                throw new common_1.HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
            }
            try {
                yield this.smsRepository.delete(appId);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    deleteSmsTemplate(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.smsTemplateRepository.delete(templateId);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    updateSms(appId, newSignName, newValidationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSms = yield this.smsRepository.findOne(appId);
            if (!existSms) {
                throw new common_1.HttpException(`指定短信插件'appId=${appId}'不存在`, 400);
            }
            else if (yield this.smsRepository.findOne({ signName: newSignName })) {
                throw new common_1.HttpException(`指定签名'signName=${newSignName}'已存在`, 400);
            }
            try {
                existSms.signName = newSignName;
                existSms.validationTime = newValidationTime;
                yield this.smsRepository.save(existSms);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    updateSmsTemplate(templateId, name, remark) {
        return __awaiter(this, void 0, void 0, function* () {
            const existTemplate = yield this.smsTemplateRepository.findOne(templateId);
            if (!existTemplate) {
                throw new common_1.HttpException(`指定短信模板'templateId=${templateId}'不存在`, 400);
            }
            try {
                existTemplate.name = name;
                existTemplate.remark = remark;
                yield this.smsTemplateRepository.save(existTemplate);
            }
            catch (error) {
                throw new common_1.HttpException(`数据库错误：${error.toString()}`, 501);
            }
        });
    }
    findOneSms(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsRepository.findOne(appId, { relations: ["templates"] });
        });
    }
    findAllSms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsRepository.find({ relations: ["templates"] });
        });
    }
    findOneSmsLog(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existTemplate = yield this.smsTemplateRepository.findOne(templateId);
            if (!existTemplate) {
                throw new common_1.HttpException(`指定短信模板'templateId=${templateId}'不存在`, 400);
            }
            return this.smsTemplateRepository.createQueryBuilder().relation(sms_template_entity_1.SmsTemplate, "smsLogs").of(templateId).loadMany();
        });
    }
    findAllSmsLog() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsLogRepository.find();
        });
    }
    sendMessageByQCloud(smsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const existSms = yield this.smsRepository.findOne(smsRequest.appId);
            if (!existSms) {
                throw new common_1.HttpException(`指定短信插件'appId=${smsRequest.appId}'不存在`, 400);
            }
            else {
                const existTemplate = yield this.smsTemplateRepository.findOne(smsRequest.templateId);
                if (!existTemplate)
                    throw new common_1.HttpException(`指定短信模板'templateId=${smsRequest.templateId}'不存在`, 400);
                smsRequest.signName = existSms.signName;
                smsRequest.appKey = yield this.paramUtil.decryptor(existSms.appId, existSms.appKey);
                const validationCode = yield this.paramUtil.genValidationCode();
                const validationTime = existSms.validationTime;
                smsRequest.templateParam = [`${validationCode}`, `${validationTime}`];
                yield this.qcloudService.sendSms(smsRequest).then(resolve => {
                    this.saveSmsLog(true, resolve.code, resolve.message, smsRequest, new sms_log_entity_1.SmsLog());
                }).catch(reject => {
                    this.saveSmsLog(false, reject.code, reject.message, smsRequest, new sms_log_entity_1.SmsLog());
                    throw new common_1.HttpException(`发送失败，原因：${reject.message}`, reject.code);
                });
                return { code: 200, message: "发送短信成功", validationCode, validationTime };
            }
        });
    }
    saveSmsLog(isSuccess, responseCode, responseMessage, smsRequest, smsLog) {
        return __awaiter(this, void 0, void 0, function* () {
            smsLog.targetMobile = smsRequest.mobile.join();
            smsLog.validationCode = parseInt(smsRequest.templateParam[0]);
            smsLog.validationTime = parseInt(smsRequest.templateParam[1]);
            smsLog.isSuccess = isSuccess;
            smsLog.responseCode = responseCode;
            smsLog.responseMessage = responseMessage;
            smsLog.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
            const newLog = yield this.smsLogRepository.save(smsLog);
            this.smsTemplateRepository.createQueryBuilder().relation(sms_template_entity_1.SmsTemplate, "smsLogs").of(smsRequest.templateId).add(newLog);
        });
    }
};
SmsService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(qcloud_service_1.QcloudService)),
    __param(1, common_1.Inject(param_util_1.ParamUtil)),
    __param(2, typeorm_1.InjectRepository(sms_entity_1.Sms)),
    __param(3, typeorm_1.InjectRepository(sms_template_entity_1.SmsTemplate)),
    __param(4, typeorm_1.InjectRepository(sms_log_entity_1.SmsLog)),
    __metadata("design:paramtypes", [qcloud_service_1.QcloudService,
        param_util_1.ParamUtil,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SmsService);
exports.SmsService = SmsService;

//# sourceMappingURL=sms.service.js.map

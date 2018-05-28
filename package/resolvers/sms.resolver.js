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
const graphql_1 = require("@nestjs/graphql");
const sms_service_1 = require("../services/sms.service");
let SmsResolver = class SmsResolver {
    constructor(smsService) {
        this.smsService = smsService;
    }
    findAllSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const sms = yield this.smsService.findAllSms();
            return { code: 200, message: "获取所有短信插件信息成功", data: sms };
        });
    }
    findOneSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const sms = yield this.smsService.findOneSms(args.appId);
            return { code: 200, message: "获取短信插件信息成功", data: [sms] };
        });
    }
    findAllSmsLog(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const smsLog = yield this.smsService.findAllSmsLog();
            return { code: 200, message: "获取所有短信发送记录成功", data: smsLog };
        });
    }
    findOneSmsLog(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const smsLog = yield this.smsService.findOneSmsLog(args.templateId);
            return { code: 200, message: "获取短信发送记录成功", data: smsLog };
        });
    }
    sendMessage(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsService.sendMessageByQCloud(args.smsRequest);
        });
    }
    createSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.createSms(args.sms);
            return { code: 200, message: "创建短信插件成功" };
        });
    }
    addTemplateToSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.addTemplateToSms(args.appId, args.smsTemplate);
            return { code: 200, message: "增加模板成功" };
        });
    }
    deleteSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.deleteSms(args.appId);
            return { code: 200, message: "删除短信插件成功" };
        });
    }
    deleteSmsTemplate(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.deleteSmsTemplate(args.templateId);
            return { code: 200, message: "删除模板成功" };
        });
    }
    updateSms(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.updateSms(args.appId, args.signName, args.validationTime);
            return { code: 200, message: "更新短信插件成功" };
        });
    }
    updateSmsTemplate(obj, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.smsService.updateSmsTemplate(args.templateId, args.name, args.remark);
            return { code: 200, message: "更新短信模板成功" };
        });
    }
};
__decorate([
    graphql_1.Query("smsInfos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "findAllSms", null);
__decorate([
    graphql_1.Query("smsInfo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "findOneSms", null);
__decorate([
    graphql_1.Query("smsLogs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "findAllSmsLog", null);
__decorate([
    graphql_1.Query("smsLog"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "findOneSmsLog", null);
__decorate([
    graphql_1.Query("sendMessage"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "sendMessage", null);
__decorate([
    graphql_1.Mutation("createSms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "createSms", null);
__decorate([
    graphql_1.Mutation("addTemplateToSms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "addTemplateToSms", null);
__decorate([
    graphql_1.Mutation("deleteSms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "deleteSms", null);
__decorate([
    graphql_1.Mutation("deleteSmsTemplate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "deleteSmsTemplate", null);
__decorate([
    graphql_1.Mutation("updateSms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "updateSms", null);
__decorate([
    graphql_1.Mutation("updateSmsTemplate"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SmsResolver.prototype, "updateSmsTemplate", null);
SmsResolver = __decorate([
    graphql_1.Resolver(),
    __param(0, common_1.Inject(sms_service_1.SmsService)),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsResolver);
exports.SmsResolver = SmsResolver;

//# sourceMappingURL=sms.resolver.js.map

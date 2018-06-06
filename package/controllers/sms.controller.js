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
const sms_service_1 = require("../services/sms.service");
let SmsController = class SmsController {
    constructor(smsService) {
        this.smsService = smsService;
    }
    sendMessage(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.type === 0 || body.type === 1) {
                return this.smsService.sendMessageByQCloud(body.type, body.smsRequest);
            }
            return { code: 406, message: "type参数有误，0为通知类短信(模板无参数)，1为验证码类短信(模板有参数)" };
        });
    }
    smsValidator(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSuccess = yield this.smsService.validator(body.templateId, body.validationCode);
            const code = isSuccess ? 200 : 406;
            const message = isSuccess ? "验证通过" : "验证不通过";
            return { code, message };
        });
    }
};
__decorate([
    common_1.Post("sendMessage"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendMessage", null);
__decorate([
    common_1.Post("smsValidator"),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "smsValidator", null);
SmsController = __decorate([
    common_1.Controller("sms"),
    __param(0, common_1.Inject(sms_service_1.SmsService)),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsController);
exports.SmsController = SmsController;

//# sourceMappingURL=sms.controller.js.map

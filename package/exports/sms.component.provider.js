"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sms_service_1 = require("../services/sms.service");
class SmsComponent {
    constructor(smsService) {
        this.smsService = smsService;
    }
    sendSmsMessageByQCloud(type, smsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsService.sendMessageByQCloud(type, smsRequest);
        });
    }
    smsValidator(mobile, validationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.smsService.validator(mobile, validationCode);
        });
    }
}
exports.SmsComponent = SmsComponent;
exports.SmsComponentToken = "SmsComponentToken";
exports.SmsComponentProvider = {
    provide: exports.SmsComponentToken,
    useFactory: (smsService) => {
        return new SmsComponent(smsService);
    },
    inject: [sms_service_1.SmsService]
};

//# sourceMappingURL=sms.component.provider.js.map

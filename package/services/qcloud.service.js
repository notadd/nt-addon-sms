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
const Chance = require("chance");
const crypto = require("crypto");
const request_1 = require("request");
const param_util_1 = require("../utils/param.util");
let QcloudService = class QcloudService {
    constructor(paramUtil) {
        this.paramUtil = paramUtil;
        this.smsApiBase = "https://yun.tim.qq.com/v5/tlssmssvr/";
    }
    sendSms(smsRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = "";
            const random = new Chance().natural({ max: 100000 });
            const time = Math.floor(Date.now() / 1000);
            const sig = yield this.calculateSignature(smsRequest.appKey, random, time, smsRequest.mobile);
            let mobile;
            if (smsRequest.mobile.length === 1) {
                url = this.smsApiBase + "sendsms";
                mobile = { mobile: smsRequest.mobile[0], nationcode: "86" };
            }
            else {
                url = this.smsApiBase + "sendmultisms2";
                mobile = smsRequest.mobile.map(item => { return { mobile: item, nationcode: "86" }; });
            }
            url += `?sdkappid=${smsRequest.appId}&random=${random}`;
            const reqBody = JSON.stringify({
                sig,
                time,
                sign: smsRequest.signName,
                tpl_id: parseInt(smsRequest.templateId),
                params: smsRequest.templateParam,
                tel: mobile
            });
            return this.post(url, reqBody);
        });
    }
    calculateSignature(appKey, random, time, mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            return crypto.createHash("sha256")
                .update(`appkey=${appKey}&random=${random}&time=${time}&mobile=${mobile.join()}`, "utf8")
                .digest("hex");
        });
    }
    post(url, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(((resolve, reject) => {
                request_1.post(url, { body: reqBody, headers: { "Content-Type": "application/json" } }, (err, res, body) => {
                    const responseBody = JSON.parse(body);
                    if (responseBody.result === 0) {
                        resolve({ code: responseBody.result, message: "发送成功" });
                    }
                    else {
                        reject({ code: responseBody.result, message: responseBody.errmsg });
                    }
                });
            }));
        });
    }
};
QcloudService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(param_util_1.ParamUtil)),
    __metadata("design:paramtypes", [param_util_1.ParamUtil])
], QcloudService);
exports.QcloudService = QcloudService;

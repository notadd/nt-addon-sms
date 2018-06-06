import { Inject, Injectable } from "@nestjs/common";
import * as Chance from "chance";
import * as crypto from "crypto";
import { post } from "request";

import { SmsRequest } from "../interfaces/sms-request.interface";
import { ParamUtil } from "../utils/param.util";

@Injectable()
export class QcloudService {

    constructor(
        @Inject(ParamUtil) private readonly paramUtil: ParamUtil
    ) { }

    private smsApiBase = "https://yun.tim.qq.com/v5/tlssmssvr/";

    /**
     * 发送短信
     * @param smsRequest 短信参数
     * @returns Promise<any>
     */
    async sendSms(smsRequest: SmsRequest): Promise<any> {
        // api 请求地址
        let url = "";
        // 随机数
        const random = new Chance().natural({ max: 100000 });
        // 发送短信系统当前时间戳
        const time = Math.floor(Date.now() / 1000);
        // App 凭证
        const sig = await this.calculateSignature(smsRequest.appKey, random, time, smsRequest.mobile);
        // 根据 mobile 类型，改变 api 地址及 mobile 参数内容
        let mobile;
        if (smsRequest.mobile.length === 1) {
            url = this.smsApiBase + "sendsms";
            mobile = { mobile: smsRequest.mobile[0], nationcode: "86" };    // nationcode 为国家码，现只支持国内(86)
        } else {
            url = this.smsApiBase + "sendmultisms2";
            mobile = smsRequest.mobile.map(item => ({ mobile: item, nationcode: "86" }));
        }
        url += `?sdkappid=${smsRequest.appId}&random=${random}`;
        // api 调用参数
        const reqBody = JSON.stringify({
            sig,
            time,
            sign: smsRequest.signName,
            tpl_id: smsRequest.templateId,
            params: smsRequest.templateParam,
            tel: mobile
        });
        return this.post(url, reqBody);
    }

    /**
     * 计算腾讯云短信服务App凭证
     *
     * @param {string} appKey SDK AppID 对应的 App Key
     * @param {number} random 随机数
     * @param {number} time 发送短信验证码的时间
     * @param {Array<string>} mobile 用户手机号
     * @returns {string} App 凭证
     */
    private async calculateSignature(appKey: string, random: number, time: number, mobile: Array<string>): Promise<string> {
        return crypto.createHash("sha256")
            .update(`appkey=${appKey}&random=${random}&time=${time}&mobile=${mobile.join()}`, "utf8")
            .digest("hex");
    }

    /**
     * 向腾讯云发送 post 请求
     *
     * @param  url  请求地址
     * @param options 请求参数
     * @returns Promise<any>
     */
    private async post(url: string, reqBody: any): Promise<any> {
        return new Promise(((resolve, reject) => {
            post(url, { body: reqBody, headers: { "Content-Type": "application/json" } }, (err, res, body) => {
                const responseBody = JSON.parse(body);
                // 返回结果为0表示发送成功， 非0则返回错误码和错误信息
                if (responseBody.result === 0) {
                    resolve({ code: responseBody.result, message: "发送成功" });
                } else {
                    reject({ code: responseBody.result, message: responseBody.errmsg });
                }
            });
        }));
    }
}

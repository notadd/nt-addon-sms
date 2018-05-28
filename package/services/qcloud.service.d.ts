import { SmsRequest } from "../interfaces/sms-request.interface";
import { ParamUtil } from "../utils/param.util";
export declare class QcloudService {
    private readonly paramUtil;
    constructor(paramUtil: ParamUtil);
    private smsApiBase;
    sendSms(smsRequest: SmsRequest): Promise<any>;
    private calculateSignature(appKey, random, time, mobile);
    private post(url, reqBody);
}

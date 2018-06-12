export interface SmsRequest {
    appId: string;

    // appkey 是由service自动从数据库拉取的，发短信时不需要传入
    appKey?: string;

    // signName 是由service自动从数据库拉取的，发短信时不需要传入
    signName?: string;

    templateId: number;

    // templateParam 是由service生成的验证码和有效期，发短信时不需要传入
    templateParam?: Array<string>;

    mobile: Array<string>;
}

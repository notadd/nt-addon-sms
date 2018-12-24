export interface SmsRequest {
    appId: string;
    /** appkey 是由service自动从数据库拉取的，发短信时不需要传入 */
    appKey?: string;
    /** signName 是由service自动从数据库拉取的，发短信时不需要传入 */
    signName?: string;
    templateId: number;
    /** templateParam 只在发送自定义参数短信时传入 */
    templateParam?: string[];
    mobile: string[];
}

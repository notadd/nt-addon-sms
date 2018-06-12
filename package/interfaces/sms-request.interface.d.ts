export interface SmsRequest {
    appId: string;
    appKey?: string;
    signName?: string;
    templateId: number;
    templateParam?: Array<string>;
    mobile: Array<string>;
}

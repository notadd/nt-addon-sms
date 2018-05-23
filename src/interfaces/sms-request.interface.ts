export interface SmsRequest {
    appId: string;

    appKey: string;

    signName: string;

    templateId: string;

    templateParam: Array<string>;

    mobile: Array<string>;
}


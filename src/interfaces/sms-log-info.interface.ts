export interface SmsLogInfo {
    code: number;

    message: string;

    data: Array<SmsLogData>;
}

export interface SmsLogData {
    id: number;

    sendTime: string;

    targetMobile: string;

    validationCode: number;

    validationTime: number;

    isSuccess: boolean;

    responseCode: string;

    responseMessage: string;
}

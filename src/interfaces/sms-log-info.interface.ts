export interface SmsLogData {
    id: number;
    sendTime: string;
    targetMobile: string;
    validationCode: number;
    validationTime: number;
    success: boolean;
    responseCode: string;
    responseMessage: string;
}

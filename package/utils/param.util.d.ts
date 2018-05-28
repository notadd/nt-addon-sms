import { SmsTemplate } from "../entities/sms-template.entity";
export declare class ParamUtil {
    findSameTemplateId(template: Array<SmsTemplate>): Promise<Array<string>>;
    genValidationCode(): Promise<number>;
    encryptor(aesKey: string, original: string): Promise<string>;
    decryptor(aesKey: string, cipherText: string): Promise<string>;
}

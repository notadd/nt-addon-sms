import { Injectable } from "@nestjs/common";
import * as Chance from "chance";
import * as crypto from "crypto";

import { SmsTemplate } from "../entities/sms-template.entity";

/**
 * 短信验证码服务的各类参数工具
 */
@Injectable()
export class ParamUtil {

    /**
     * 查找相同的短信模板id
     * @param template 短信模板
     * @returns 相同的短信模板id
     */
    async findSameTemplateId(template: Array<SmsTemplate>): Promise<Array<string>> {
        const existTemplateId = [];
        const templateIds = template.map(item => item.templateId);
        templateIds.forEach(item => { (templateIds.indexOf(item) !== templateIds.lastIndexOf(item) && existTemplateId.indexOf(item) === -1) && existTemplateId.push(item); });
        return existTemplateId;
    }

    /**
     * 生成验证码
     */
    async genValidationCode(): Promise<number> {
        return new Chance().natural({ max: 100000 });
    }

    /**
     * 对称加密工具
     * @param aesKey 密匙
     * @param original 原文
     * @returns 密文
     */
    async encryptor(aesKey: string, original: string): Promise<string> {
        // 使用 aesKey 生成加密 key
        const key = crypto.createHash("sha256").update(aesKey).digest();
        // 初始化向量，截取key前16字节
        const iv = key.slice(0, 16);
        // 使用 aes-256-cbc 算法创建 cipher
        const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
        // 加密
        const cipherText = Buffer.concat([cipher.update(Buffer.from(original)), cipher.final()]);
        // 返回密文
        return cipherText.toString("base64");
    }

    /**
     * 解密工具
     * @param aesKey 密匙
     * @param cipherText 密文
     * @returns 原文
     */
    async decryptor(aesKey: string, cipherText: string): Promise<string> {
        // 使用 aesKey 生成解密 key
        const key = crypto.createHash("sha256").update(aesKey).digest();
        // 初始化向量，截取key前16字节
        const iv = key.slice(0, 16);
        // 使用 aes-256-cbc 算法创建 decipher
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        // 解密
        const original = Buffer.concat([decipher.update(cipherText, "base64"), decipher.final()]);
        // 返回原文
        return original.toString();
    }
}

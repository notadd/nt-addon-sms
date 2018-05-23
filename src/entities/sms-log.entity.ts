import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { SmsTemplate } from "./sms-template.entity";

@Entity("sms_log")
export class SmsLog {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 发送时间
     */
    @Column({
        name: "send_time"
    })
    sendTime: string;

    /**
     * 短信接收手机号
     */
    @Column({
        name: "target_mobile"
    })
    targetMobile: string;

    @ManyToOne(type => SmsTemplate, smsTemplate => smsTemplate.smsLogs, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "sms_templateId"
    })
    smsTemplate: SmsTemplate;

    /**
     * 短信验证码
     */
    @Column({
        name: "validation_code"
    })
    validationCode: number;

    /**
     * 验证码有效期
     */
    @Column({
        name: "validation_time"
    })
    validationTime: number;

    /**
     * 是否发送成功
     */
    @Column({
        name: "is_success"
    })
    isSuccess: boolean;

    /**
     * 云服务返回的状态码
     */
    @Column({
        name: "response_code"
    })
    responseCode: string;

    /**
     * 云服务返回的消息
     */
    @Column({
        name: "response_message"
    })
    responseMessage: string;
}
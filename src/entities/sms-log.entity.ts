import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SmsTemplate } from './sms-template.entity';

@Entity('sms_log')
export class SmsLog {
    @PrimaryGeneratedColumn({
        comment: '自增ID'
    })
    id: number;

    /**
     * 发送时间
     */
    @Column({
        comment: '发送时间'
    })
    sendTime: Date;

    /**
     * 短信接收手机号
     */
    @Column({
        comment: '短信接收手机号'
    })
    targetMobile: string;

    @ManyToOne(type => SmsTemplate, smsTemplate => smsTemplate.smsLogs, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    template: SmsTemplate;

    /**
     * 短信参数，保存自定义参数短信中输入的参数
     */
    @Column({
        nullable: true,
        comment: '短信参数'
    })
    templateParam: string;

    /**
     * 短信验证码
     */
    @Column({
        comment: '短信验证码',
        nullable: true
    })
    validationCode: number;

    /**
     * 验证码有效期
     */
    @Column({
        comment: '验证码有效期',
        nullable: true
    })
    validationTime: number;

    /**
     * 是否发送成功
     */
    @Column({
        comment: '是否发送成功'
    })
    success: boolean;

    /**
     * 云服务返回的状态码
     */
    @Column({
        comment: '云服务返回的状态码'
    })
    responseCode: string;

    /**
     * 云服务返回的消息
     */
    @Column({
        comment: '云服务返回的消息'
    })
    responseMessage: string;
}

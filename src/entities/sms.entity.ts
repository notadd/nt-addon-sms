import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { SmsTemplate } from './sms-template.entity';

@Entity('sms')
export class Sms {
    @PrimaryColumn({
        comment: '短信服务AppId'
    })
    appId: string;

    @Column({
        comment: '短信服务AppKey'
    })
    appKey: string;

    /**
     * 短信签名，必须唯一
     */
    @Column({
        comment: '短信签名',
        unique: true
    })
    signName: string;

    /**
     * 短信模板，可以一次保存多个，也可后续通过对应短信插件实体进行增加
     */
    @OneToMany(type => SmsTemplate, template => template.sms, {
        cascade: ['insert']
    })
    templates: SmsTemplate[];

    /**
     * 验证码有效期，默认5分钟
     */
    @Column({
        comment: '验证码有效期，默认5分钟',
        default: 5
    })
    validationTime?: number;
}

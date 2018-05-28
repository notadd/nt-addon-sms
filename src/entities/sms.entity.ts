import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { SmsTemplate } from "./sms-template.entity";

@Entity("sms")
export class Sms {
    @PrimaryColumn({
        name: "app_id",
        length: "40"
    })
    appId: string;

    @Column({
        name: "app_key"
    })
    appKey: string;

    /**
     * 签名名称，必须唯一
     */
    @Column({
        name: "sign_name",
        length: "10",
        unique: true
    })
    signName: string;

    /**
     * 短信模板，可以一次保存多个，也可后续通过对应短信插件实体进行增加
     */
    @OneToMany(type => SmsTemplate, template => template.sms, {
        cascade: ["insert"]
    })
    templates: Array<SmsTemplate>;

    /**
     * 验证码有效期，默认5分钟
     */
    @Column({
        name: "validation_time",
        default: 5
    })
    validationTime: number;
}

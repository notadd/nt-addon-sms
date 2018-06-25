import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

import { SmsLog } from "./sms-log.entity";
import { Sms } from "./sms.entity";

@Entity("sms_template")
export class SmsTemplate {
    /**
     * 短信模板id，在云服务商申请模板所生成的id
     */
    @PrimaryColumn({
        name: "template_id",
        comment: "短信模板ID"
    })
    templateId: number;

    /**
     * 模板标识
     */
    @Column({
        name: "name",
        comment: "模板标识"
    })
    name: string;

    /**
     * 模板备注，用于声明模板用途
     */
    @Column({
        name: "remark",
        comment: "模板备注，用于声明模板用途"
    })
    remark: string;

    @ManyToOne(type => Sms, sms => sms.templates, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "sms_id"
    })
    sms: Sms;

    /**
     * 短信发送记录
     */
    @OneToMany(type => SmsLog, smslog => smslog.smsTemplate, {
        cascade: ["update"]
    })
    smsLogs: Array<SmsLog>;
}

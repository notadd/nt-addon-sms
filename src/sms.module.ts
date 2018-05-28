import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SmsController } from "./controllers/sms.controller";
import { SmsLog } from "./entities/sms-log.entity";
import { SmsTemplate } from "./entities/sms-template.entity";
import { Sms } from "./entities/sms.entity";
import { SmsResolver } from "./resolvers/sms.resolver";
import { QcloudService } from "./services/qcloud.service";
import { SmsService } from "./services/sms.service";
import { ParamUtil } from "./utils/param.util";

@Module({
    imports: [
        TypeOrmModule.forFeature([Sms, SmsTemplate, SmsLog])
    ],
    controllers: [SmsController],
    providers: [
        ParamUtil,
        QcloudService,
        SmsResolver,
        SmsService,
    ]
})

export class SmsModule { }
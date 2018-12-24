import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SmsLog } from './entities/sms-log.entity';
import { SmsTemplate } from './entities/sms-template.entity';
import { Sms } from './entities/sms.entity';
import { QcloudService } from './services/qcloud.service';
import { SmsService } from './services/sms.service';
import { ParamUtil } from './utils/param.util';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sms, SmsTemplate, SmsLog]),
        HttpModule
    ],
    providers: [
        ParamUtil,
        QcloudService,
        SmsService
    ],
    exports: [SmsService]
})

export class SmsModule { }

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SmsService } from '../src';
import { SmsAddon } from '../src/sms.addon';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        SmsAddon
    ]
})
export class ApplicationModule implements OnModuleInit {
    constructor(private readonly smsService: SmsService) { }

    async onModuleInit() {
        // await this.smsService.createSms({
        //     appId: '1400084602',
        //     appKey: '71db721461cda01c01377770383d119b',
        //     signName: '段泽尧',
        //     templates: [
        //         {
        //             templateId: 111704,
        //             name: '短信测试',
        //             remark: '您的验证码是{1}，请于{2}分钟内填写。如非本人操作，请忽略本短信。'
        //         }
        //     ]
        // });

        // await this.smsService.sendMessageByQCloud(1, {
        //     appId: '1400084602',
        //     templateId: 111704,
        //     mobile: ['18133970155']
        // });
    }
}

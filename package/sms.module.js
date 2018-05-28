"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sms_controller_1 = require("./controllers/sms.controller");
const sms_log_entity_1 = require("./entities/sms-log.entity");
const sms_template_entity_1 = require("./entities/sms-template.entity");
const sms_entity_1 = require("./entities/sms.entity");
const sms_resolver_1 = require("./resolvers/sms.resolver");
const qcloud_service_1 = require("./services/qcloud.service");
const sms_service_1 = require("./services/sms.service");
const param_util_1 = require("./utils/param.util");
let SmsModule = class SmsModule {
};
SmsModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sms_entity_1.Sms, sms_template_entity_1.SmsTemplate, sms_log_entity_1.SmsLog])
        ],
        controllers: [sms_controller_1.SmsController],
        providers: [
            param_util_1.ParamUtil,
            qcloud_service_1.QcloudService,
            sms_resolver_1.SmsResolver,
            sms_service_1.SmsService,
        ]
    })
], SmsModule);
exports.SmsModule = SmsModule;

//# sourceMappingURL=sms.module.js.map

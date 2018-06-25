"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const sms_log_entity_1 = require("./sms-log.entity");
const sms_entity_1 = require("./sms.entity");
let SmsTemplate = class SmsTemplate {
};
__decorate([
    typeorm_1.PrimaryColumn({
        name: "template_id",
        comment: "短信模板ID"
    }),
    __metadata("design:type", Number)
], SmsTemplate.prototype, "templateId", void 0);
__decorate([
    typeorm_1.Column({
        name: "name",
        comment: "模板标识"
    }),
    __metadata("design:type", String)
], SmsTemplate.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        name: "remark",
        comment: "模板备注，用于声明模板用途"
    }),
    __metadata("design:type", String)
], SmsTemplate.prototype, "remark", void 0);
__decorate([
    typeorm_1.ManyToOne(type => sms_entity_1.Sms, sms => sms.templates, {
        onDelete: "CASCADE"
    }),
    typeorm_1.JoinColumn({
        name: "sms_id"
    }),
    __metadata("design:type", sms_entity_1.Sms)
], SmsTemplate.prototype, "sms", void 0);
__decorate([
    typeorm_1.OneToMany(type => sms_log_entity_1.SmsLog, smslog => smslog.smsTemplate, {
        cascade: ["update"]
    }),
    __metadata("design:type", Array)
], SmsTemplate.prototype, "smsLogs", void 0);
SmsTemplate = __decorate([
    typeorm_1.Entity("sms_template")
], SmsTemplate);
exports.SmsTemplate = SmsTemplate;

//# sourceMappingURL=sms-template.entity.js.map

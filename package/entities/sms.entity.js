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
const sms_template_entity_1 = require("./sms-template.entity");
let Sms = class Sms {
};
__decorate([
    typeorm_1.PrimaryColumn({
        name: "app_id",
        length: "40"
    }),
    __metadata("design:type", String)
], Sms.prototype, "appId", void 0);
__decorate([
    typeorm_1.Column({
        name: "app_key"
    }),
    __metadata("design:type", String)
], Sms.prototype, "appKey", void 0);
__decorate([
    typeorm_1.Column({
        name: "sign_name",
        length: "10",
        unique: true
    }),
    __metadata("design:type", String)
], Sms.prototype, "signName", void 0);
__decorate([
    typeorm_1.OneToMany(type => sms_template_entity_1.SmsTemplate, template => template.sms, {
        cascade: ["insert"]
    }),
    __metadata("design:type", Array)
], Sms.prototype, "templates", void 0);
__decorate([
    typeorm_1.Column({
        name: "validation_time",
        default: 5
    }),
    __metadata("design:type", Number)
], Sms.prototype, "validationTime", void 0);
Sms = __decorate([
    typeorm_1.Entity("sms")
], Sms);
exports.Sms = Sms;

//# sourceMappingURL=sms.entity.js.map

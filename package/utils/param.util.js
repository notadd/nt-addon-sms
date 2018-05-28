"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Chance = require("chance");
const crypto = require("crypto");
let ParamUtil = class ParamUtil {
    findSameTemplateId(template) {
        return __awaiter(this, void 0, void 0, function* () {
            const existTemplateId = [];
            const templateIds = template.map(item => item.templateId);
            templateIds.forEach(item => { (templateIds.indexOf(item) !== templateIds.lastIndexOf(item) && existTemplateId.indexOf(item) === -1) && existTemplateId.push(item); });
            return existTemplateId;
        });
    }
    genValidationCode() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Chance().natural({ max: 100000 });
        });
    }
    encryptor(aesKey, original) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = crypto.createHash("sha256").update(aesKey).digest();
            const iv = key.slice(0, 16);
            const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
            const cipherText = Buffer.concat([cipher.update(Buffer.from(original)), cipher.final()]);
            return cipherText.toString("base64");
        });
    }
    decryptor(aesKey, cipherText) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = crypto.createHash("sha256").update(aesKey).digest();
            const iv = key.slice(0, 16);
            const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
            const original = Buffer.concat([decipher.update(cipherText, "base64"), decipher.final()]);
            return original.toString();
        });
    }
};
ParamUtil = __decorate([
    common_1.Injectable()
], ParamUtil);
exports.ParamUtil = ParamUtil;

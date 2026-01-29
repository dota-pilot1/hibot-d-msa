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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProxyController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthProxyController = class AuthProxyController {
    httpService;
    authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8081';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async proxy(req, res) {
        const path = req.url;
        const url = `${this.authServiceUrl}${path}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                method: req.method,
                url,
                data: req.body,
                headers: {
                    ...req.headers,
                    host: undefined,
                },
            }));
            res.status(response.status).json(response.data);
        }
        catch (error) {
            const axiosError = error;
            if (axiosError.response) {
                res.status(axiosError.response.status).json(axiosError.response.data);
            }
            else {
                res.status(503).json({ message: 'Auth service unavailable' });
            }
        }
    }
};
exports.AuthProxyController = AuthProxyController;
__decorate([
    (0, common_1.All)('*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthProxyController.prototype, "proxy", null);
exports.AuthProxyController = AuthProxyController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AuthProxyController);
//# sourceMappingURL=auth-proxy.controller.js.map
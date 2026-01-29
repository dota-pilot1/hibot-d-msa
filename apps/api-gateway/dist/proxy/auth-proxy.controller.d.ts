import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
export declare class AuthProxyController {
    private readonly httpService;
    private readonly authServiceUrl;
    constructor(httpService: HttpService);
    proxy(req: Request, res: Response): Promise<void>;
}

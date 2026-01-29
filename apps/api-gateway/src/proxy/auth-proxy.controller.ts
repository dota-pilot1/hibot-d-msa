import { All, Controller, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';

@Controller('auth')
export class AuthProxyController {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL || 'http://localhost:8081';

  constructor(private readonly httpService: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const path = req.url;
    const url = `${this.authServiceUrl}${path}`;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method,
          url,
          data: req.body as unknown,
          headers: {
            ...req.headers,
            host: undefined,
          },
        }),
      );

      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else {
        res.status(503).json({ message: 'Auth service unavailable' });
      }
    }
  }
}

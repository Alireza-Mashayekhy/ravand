import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

const DB_PING_TIMEOUT_MS = 2000;

/**
 * health به‌عنوان readiness استفاده می‌شود: هم زنده‌بودن پروسه و هم
 * در دسترس بودن دیتابیس را بررسی می‌کند. docker-compose روی همین
 * endpoint healthcheck دارد، پس اگر دیتابیس قطع باشد کانتینر unhealthy می‌شود.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'بررسی سلامت API و اتصال دیتابیس' })
  @ApiResponse({ status: 200, description: 'API و دیتابیس سالم هستند' })
  @ApiResponse({ status: 503, description: 'دیتابیس در دسترس نیست' })
  async check() {
    const database = await this.pingDatabase();

    if (!database) {
      throw new ServiceUnavailableException('اتصال به دیتابیس برقرار نیست');
    }

    return {
      status: 'ok',
      database: 'up',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  private async pingDatabase(): Promise<boolean> {
    try {
      await Promise.race([
        this.dataSource.query('SELECT 1'),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), DB_PING_TIMEOUT_MS).unref();
        }),
      ]);

      return true;
    } catch {
      return false;
    }
  }
}

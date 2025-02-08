import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchLoggerService implements LoggerService {
  private logger: pino.Logger;
  private esClient: Client;

  constructor(private readonly configService: ConfigService) {
    this.logger = pino();
    console.log(configService.get('ES_HOST'));

    this.esClient = new Client({
      node: `http://${configService.get('ES_HOST')}:9200`,
    });
  }

  log(message: string) {
    this.logger.info(message);
    this.esClient.index({
      index: 'logs',
      body: { message, level: 'info', '@timestamp': new Date().toISOString() },
    });
  }

  error(message: string, trace: string) {
    this.logger.error(message, { trace });
    this.esClient.index({
      index: 'logs',
      body: {
        message,
        level: 'error',
        trace,
        '@timestamp': new Date().toISOString(),
      },
    });
  }
  warn(message: string) {
    this.logger.warn(message);
    this.esClient.index({
      index: 'logs',
      body: { message, level: 'warn', '@timestamp': new Date().toISOString() },
    });
  }
  debug(message: string) {
    this.logger.debug(message);
    this.esClient.index({
      index: 'logs',
      body: { message, level: 'debug', '@timestamp': new Date().toISOString() },
    });
  }

  verbose?(message: string) {
    this.logger.trace(message);
    this.esClient.index({
      index: 'logs',
      body: {
        message,
        level: 'verbose',
        '@timestamp': new Date().toISOString(),
      },
    });
  }

  logHTTPRequest(
    httpMethod: string,
    url: string,
    body: string,
    status: number,
  ) {
    this.esClient.index({
      index: 'http-logs',
      body: {
        httpMethod,
        url,
        body,
        status,
        level: 'info',
        '@timestamp': new Date().toISOString(),
      },
    });
  }
}

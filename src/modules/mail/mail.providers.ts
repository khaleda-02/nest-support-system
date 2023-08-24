import { ConfigService } from '@nestjs/config';

export const mailProviders = [
  {
    provide: 'MAILER_OPTIONS',
    useFactory: async (config: ConfigService) => ({
      transport: {
        secure: false,
        auth: {
          user: 'khaleda.02f@gmail.com',
          pass: 'kizzzwntxcfrniaz',
        },
      },
      defaults: {
        from: `"No Reply" <khaleda.02f@gmail.com>`,
      },
    }),
    inject: [ConfigService],
  },
];

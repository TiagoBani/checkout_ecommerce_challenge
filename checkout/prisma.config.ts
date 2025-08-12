// prisma.config.ts
import path from 'node:path';
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: path.join('prisma'),
  migrations: {
    // vai chamar nosso runner que executa todos os seeds da pasta
    seed: 'tsx prisma/seeds/main.ts',
    path: path.join('prisma', 'migrations'),
  },
});

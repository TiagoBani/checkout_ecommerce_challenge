import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

export type SeedCtx = { prisma: PrismaClient; log: (...a: any[]) => void };
export type SeedModule = { default: (ctx: SeedCtx) => Promise<void> };

const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = __dirname;

const SEED_FILE = /^\d{3}_.+\.(ts|js|mjs|cjs)$/;

async function runAll() {
  const files = (await fs.readdir(seedsDir))
    .filter((f) => SEED_FILE.test(f))
    .sort();

  for (const file of files) {
    const full = path.join(seedsDir, file);
    console.log(`→ Running seed: ${file}`);
    const mod = (await import(full)) as SeedModule;
    if (typeof mod.default !== 'function') {
      throw new Error(`Seed ${file} does not export a default async function`);
    }
    await mod.default({ prisma, log: console.log });
    console.log(`✓ Done: ${file}`);
  }
}

runAll()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ All seeds completed');
  })
  .catch(async (err) => {
    console.error('❌ Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });

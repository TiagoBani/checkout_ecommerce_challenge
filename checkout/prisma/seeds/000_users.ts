import type { SeedCtx } from './main';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { cpf } from 'cpf-cnpj-validator';

export default async function seed({ prisma, log }: SeedCtx) {
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@admin.com',
      document: '77558764033',
    },
  });

  const COUNT = 100;
  const usedEmails = new Set(['admin@admin.com']);
  const usedDocs = new Set(['77558764033']);
  const users: { name: string; email: string; document: string }[] = [];

  for (let i = 0; i < COUNT; i++) {
    const name = faker.person.fullName();

    let email: string;
    do {
      email = faker.internet
        .email({
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(-1)[0],
        })
        .toLowerCase();
    } while (usedEmails.has(email));
    usedEmails.add(email);

    let document: string;
    do {
      document = cpf.generate().replace(/\D/g, '');
    } while (usedDocs.has(document));
    usedDocs.add(document);

    users.push({ name, email, document });
  }

  await prisma.user.createMany({ data: users, skipDuplicates: true });
  log(`seed users ok → +${users.length}`);
}

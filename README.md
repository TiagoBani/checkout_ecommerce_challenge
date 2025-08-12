# checkout_ecommerce_challenge
Checkout e-commerce challenge

## Access kafka with ui

- [redpanda](http://localhost:8080)

## Initialize environment

```bash
    docker-compose up -d
```

## Requirement

### docker environment
- docker
- docker-compose

### local environment
- node:22
- kafka
- postgres

## Utils commands

### Start prisma studio

Use prisma studio to access database, docs and more.

```bash
    npx prisma studio
```

### Create migrations

```bash
    npm run prisma:migrate
```

## Architecture

C2 Model
![architecture c2](/docs/c2_architecture.svg)

C3 Model - Checkout
![architecture checkout c3](/docs/c3_checkout.svg)

C3 Model - Payments
![architecture payments c3](/docs/c3_payments.svg)

C3 Model - Expeditions
![architecture expeditions c3](/docs/c3_expeditions.svg)

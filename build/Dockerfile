#############################################
# 1) DEPS: instala dependências (dev)
#############################################
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./

ENV NPM_CONFIG_IGNORE_SCRIPTS=true
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copia o restante do código
COPY . .

#############################################
# 2) TESTS: roda a suíte de testes (Nest/Jest)
#############################################
FROM deps AS test
ENV NODE_ENV=test
RUN npm test --ci --passWithNoTests

#############################################
# 3) BUILD: gera artefatos de produção (dist/)
#############################################
FROM deps AS build
ENV NODE_ENV=production

RUN npm run build

#############################################
# 4) PROD-DEPS: só dependências de produção
#############################################
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --omit=optional --ignore-scripts

#############################################
# 5) APPRUNTIME: distroless, nonroot
#############################################
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS appruntime
WORKDIR /app

COPY --chown=nonroot:nonroot --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=nonroot:nonroot --from=build /app/dist           /app/dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --start-period=15s --interval=10s --timeout=2s --retries=10 \
  CMD ["/nodejs/bin/node","-e","const http=require('http');const o={host:'127.0.0.1',port:process.env.PORT||3000,path:process.env.HEALTH_PATH||'/',timeout:1500};const r=http.get(o,res=>process.exit(res.statusCode<400?0:1));r.on('timeout',()=>{r.destroy();process.exit(1)});r.on('error',()=>process.exit(1));"]

CMD ["/app/dist/main.js"]

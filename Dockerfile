FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/app.js ./app.js
COPY --from=build /app/agent-core ./agent-core
COPY --from=build /app/rag-backend ./rag-backend
COPY --from=build /app/*.css ./
COPY --from=build /app/index.html ./index.html

EXPOSE 8080

CMD ["npm", "run", "start"]
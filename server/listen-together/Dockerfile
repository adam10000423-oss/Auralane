FROM node:22-alpine
WORKDIR /app
COPY server/listen-together/package*.json ./server/listen-together/
RUN npm ci --prefix server/listen-together --omit=dev --ignore-scripts
COPY server/listen-together/server.js ./server/listen-together/
COPY src/shared/onlineTogetherProtocol.js ./src/shared/
USER node
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server/listen-together/server.js"]

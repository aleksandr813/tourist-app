FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3003 \
    DATABASE_DIR=/app/data
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN mv /app/public/uploads /app/seed-uploads && mkdir -p /app/data /app/public/uploads
EXPOSE 3003
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["node", "app.js"]

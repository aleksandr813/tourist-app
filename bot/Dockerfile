FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "index.js"]

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY public ./public
COPY src ./src
ARG REACT_APP_HOST=/api
ARG REACT_APP_STATIC_HOST=
ARG REACT_APP_MAPGL_KEY=
ARG REACT_APP_BOT_NAME=
ENV REACT_APP_HOST=$REACT_APP_HOST \
    REACT_APP_STATIC_HOST=$REACT_APP_STATIC_HOST \
    REACT_APP_MAPGL_KEY=$REACT_APP_MAPGL_KEY \
    REACT_APP_BOT_NAME=$REACT_APP_BOT_NAME
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

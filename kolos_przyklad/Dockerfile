FROM alpine:latest AS build

ARG GIT_REPO

WORKDIR /app

RUN apk update
RUN apk upgrade
RUN apk add git curl nodejs npm

RUN git clone $GIT_REPO .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
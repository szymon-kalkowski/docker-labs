FROM node:16-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

HEALTHCHECK --interval=10s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/ready || exit 1

EXPOSE 3000

CMD ["node", "index.js"]
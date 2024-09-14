FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "start:migrate:prod"]

FROM node:16.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install -f

COPY . .

EXPOSE 3000

CMD [ "npm", "run dev" ]
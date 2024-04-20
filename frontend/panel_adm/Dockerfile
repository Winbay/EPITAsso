FROM node:20.12.2-alpine3.19
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-only
EXPOSE 8080
CMD [ "http-server", "dist" ]
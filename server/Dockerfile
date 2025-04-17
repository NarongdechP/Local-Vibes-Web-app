FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000

ENV NODE_ENV=${NODE_ENV}
ENV MONGO_URI=${MONGO_URI}
ENV JWT_SECRET=${JWT_SECRET}

CMD [ "node", "server.js"]
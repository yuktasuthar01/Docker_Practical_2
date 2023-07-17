FROM node:14-alpine
WORKDIR /mern_app/login-and-register-backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
# CMD ["node", "index.js"]
CMD ["sh", "-c", "sleep 10 && node index.js"]

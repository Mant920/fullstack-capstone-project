FROM node:18-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# Copy the built React app and the Express server
COPY . .

USER appuser

EXPOSE 9000

CMD ["node", "index.js"]

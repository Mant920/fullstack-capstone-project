FROM node:18-alpine

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./

RUN npm install --omit=dev

# Copy application source
COPY . .

# Switch to non-root user
USER appuser

EXPOSE 3060

CMD ["node", "app.js"]

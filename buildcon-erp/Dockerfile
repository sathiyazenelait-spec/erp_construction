# Stage 1: Install dependencies and build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run the built Next.js server in production mode
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built application and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Next.js automatically respects the PORT env variable assigned by Render
EXPOSE 3000

CMD ["npm", "start"]

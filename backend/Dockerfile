# Use official lightweight Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install all dependencies (including dev for build step)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript into dist/
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app

# Copy only package files again and install only prod dependencies
COPY package*.json ./
RUN npm install --production

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Start server
CMD ["node", "dist/server.js"]

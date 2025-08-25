# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port (Cloud Run expects PORT env var)
ENV PORT=8080

# Start the app
CMD ["npm", "start"]

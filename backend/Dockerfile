# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including ts-node + typescript)
RUN npm install

# Copy all source code
COPY . .

# Expose the app port
EXPOSE 3000

# Run the app using ts-node
CMD ["npx", "ts-node", "index.ts"]
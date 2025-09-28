# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./
# Copy certs into image


# Install dependencies
RUN npm install --production

# Copy all files
COPY . .

# Expose backend port (adjust if needed)
EXPOSE 3001

# Start server
CMD ["node", "server.js"]

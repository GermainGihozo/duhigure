# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create non-root user (Alpine Linux uses different commands)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S duhigure -u 1001

# Change ownership of the app directory
RUN chown -R duhigure:nodejs /usr/src/app

# Switch to non-root user
USER duhigure

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start application
CMD [ "node", "server.js" ]
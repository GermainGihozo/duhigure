# Use Node.js LTS version
FROM node:18-alpine

# Create app directory and set working directory
WORKDIR /usr/src/app

# Create non-root user first
RUN addgroup -g 1001 -S nodejs && \
    adduser -S duhigure -u 1001 && \
    chown -R duhigure:nodejs /usr/src/app

# Switch to non-root user for npm install
USER duhigure

# Copy package files
COPY --chown=duhigure:nodejs package*.json ./

# Install dependencies as non-root user
RUN npm ci --only=production

# Copy app source as non-root user
COPY --chown=duhigure:nodejs . .

# Create necessary directories with proper permissions
RUN mkdir -p public/images public/css public/js logs __tests__

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if(r.statusCode!==200)throw new Error()})"

# Start application
CMD [ "node", "server.js" ]
# Stage 1: Build & Install Dependencies
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Run Prisma generate to create the client based on your schema
# NOTE: The schema.prisma file and the DATABASE_URL must be accessible in this context.
# If your backend is in a monorepo, you may need to adjust the copy commands.
RUN npx prisma generate

# Stage 2: Production Image (leaner image for deployment)
FROM node:20-alpine AS final

# Set the working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist  # Assuming your backend builds into a 'dist' folder
COPY --from=builder /app/prisma ./prisma # Needed for the Prisma client

# Expose the port your Node.js server listens on (e.g., 4000)
EXPOSE 4000

# Command to run the application (assuming the main file is server.js in 'dist')
CMD ["node", "dist/server.js"]
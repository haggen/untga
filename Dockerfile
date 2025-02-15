# Use the official Alpine based image.
FROM node:23-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package*.json ./

# Install the dependencies.
RUN npm ci

# Expose the port the app runs on.
EXPOSE 3000

# Sets the environment.
ENV NODE_ENV production

# Copy the rest of the application code.
COPY . .

# Build the application.
RUN npm run build

# Start the application.
CMD ["npm", "start"]
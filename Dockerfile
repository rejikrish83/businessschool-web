# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the Angular CLI globally
RUN npm install -g @angular/cli

# Install app dependencies
RUN npm install -g npm@latest

# Copy the rest of the application code to the working directory
COPY . .

RUN npm install

# Build the Angular app
RUN ng build

# Expose the port your app runs on (typically 80)
EXPOSE 80

# Define the command to run your app using a simple web server (e.g., http-server)
CMD ["npx", "http-server", "dist/contact-us", "--port", "80"]

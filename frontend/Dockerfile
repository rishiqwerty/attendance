# Use the official Node.js image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the remaining application files to the container
COPY . .

# Expose the port that the React app will run on
EXPOSE 3000

# Run the React development server
CMD ["npm", "start"]

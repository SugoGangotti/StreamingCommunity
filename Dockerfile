FROM node:20-slim

# Install Python, pip, and ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install --break-system-packages -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the backend server
CMD ["npm", "run", "server"]
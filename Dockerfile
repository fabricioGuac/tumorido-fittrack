# Builds Backend
FROM node:18-alpine AS backend

# Sets the working directory
WORKDIR /app

# Copies package.json and installs dependencies first
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Then copies the rest of the backend code
COPY server ./server

# Builds Frontend
FROM node:18 AS frontend

# Sets working directory
WORKDIR /app

# Copies and installs frontend dependencies
COPY Client/package*.json ./Client/
RUN cd Client && npm install

# Builds React app
COPY Client ./Client
RUN cd Client && npm run build

# Builds Final container
FROM node:18-alpine AS final

# Sets the working directory
WORKDIR /app

# Copies backend
COPY --from=backend /app/server ./server

# Copies frontend into the backend `public` directory
COPY --from=frontend /app/Client/dist ./server/dist

# Exposes backend port
EXPOSE ${PORT:-3001}

# Starts backend sever
CMD ["node", "server/server.js"]
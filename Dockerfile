# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app
# Expose the port that the application listens on.
EXPOSE 5000


FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the application with nodemon.
CMD npm run dev

FROM base as test
ENV NODE_ENV test
ENV PORT 3000
EXPOSE 3000
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the application test suite.
CMD npm run test

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
FROM base as prod
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
CMD npm start

FROM mhart/alpine-node

# Set the default working directory
WORKDIR /usr/src

# Install dependencies
COPY funcon/package.json funcon/yarn.lock ./
RUN yarn

# Copy the relevant files to the working directory
COPY ./funcon .

# Build and export the app
RUN yarn build && mv ./dist /public

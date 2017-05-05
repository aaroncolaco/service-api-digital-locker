FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV production

# Install gulp
RUN npm install -g gulp-cli

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY gulpfile.js /usr/src/app/
COPY src/ /usr/src/app/src/
RUN gulp && rm -rf src

EXPOSE 3000
CMD [ "npm", "start" ]

FROM node:14.16.0-alpine3.13

# Create app directory
WORKDIR /usr/src/app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY ./ .

EXPOSE 3000

CMD node .

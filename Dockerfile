FROM alpine

# Update
RUN apk add --update nodejs

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src && npm install

# Bundle app source
COPY . /src

EXPOSE  80
CMD ["node", "/src/server.js"]
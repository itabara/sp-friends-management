FROM node:6.9.4

RUN pwd
WORKDIR /usr/app
RUN pwd

#install app dependencies
COPY package.json /usr/app/
RUN pwd
RUN npm install --quiet
RUN pwd

COPY . /usr/app

EXPOSE 27017

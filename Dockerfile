FROM node

WORKDIR /usr/app/

COPY . /usr/app/

RUN yarn install

CMD [ "yarn", "dev" ]
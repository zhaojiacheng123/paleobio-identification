FROM circleci/node:latest-browsers

WORKDIR /usr/src/app/
USER root

COPY ./package.json ./package.json

RUN yarn

COPY ./ ./

EXPOSE 8000

CMD ["yarn", "start"]




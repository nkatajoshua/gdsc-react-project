FROM node:14
WORKDIR /dsc_ucu_community/src
COPY /dsc_ucu_community/ .
RUN npm install
ENV NODE_ENV production
EXPOSE 3000
CMD [ "npm", "start" ]
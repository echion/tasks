FROM nodesource/jessie:5.6.0

ADD package.json package.json  
RUN npm install
ADD . .

EXPOSE 8080

CMD [ "npm", "start" ]
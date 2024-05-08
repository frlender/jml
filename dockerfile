FROM node:slim

WORKDIR /root

COPY . .
# RUN rm -rf node_modules
# RUN rm pnpm-lock.yaml
RUN npm install
# RUN npm install

ENTRYPOINT ["node", "index.js"]



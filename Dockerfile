FROM node:20

RUN apt-get update && apt-get install -y ffmpeg

USER node

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node . .

RUN npm -f ci

CMD ["node", "dist/main"]

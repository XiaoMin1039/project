FROM node:alpine
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone && \
    apk del tzdata
RUN apk update && \
    apk add --no-cache git
COPY package.json /tmp/package.json
RUN npm config set registry http://nexus.daocloud.io/repository/daocloud-npm
RUN cd /tmp && npm install && mkdir -p /opt/workdir && mv /tmp/node_modules /opt/workdir/
WORKDIR /opt/workdir
COPY . /opt/workdir
RUN npm run build
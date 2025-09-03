# Use this when makeomatic/node is fixed
# FROM makeomatic/node:$NODE_VERSION

# fix start
# https://github.com/makeomatic/alpine-node/blob/master/node/Dockerfile
FROM node:$NODE_VERSION-alpine

ENV COREPACK_DEFAULT_TO_LATEST=0 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    COREPACK_ENABLE_NETWORK=0 \
    COREPACK_ENABLE_AUTO_PIN=0 \
    COREPACK_ENABLE_PROJECT_SPEC=0 \
    COREPACK_HOME=/usr/local/src/corepack

RUN \
    mkdir -p $COREPACK_HOME \
    && chown root:node $COREPACK_HOME \
    && corepack enable \
    && COREPACK_ENABLE_NETWORK=1 corepack install --global pnpm@9.x \
    && su node -c 'pnpm config set global-bin-dir "/usr/local/bin"' \
    && su node -c 'rm -rf ~/.cache ~/.npm' \
    && rm -rf ~/.npm \
    && chown -R root:node /usr/local/bin \
    && chmod g+w /usr/local/bin
# fix end

ENV NCONF_NAMESPACE=MS_PHONE \
    NODE_ENV=$NODE_ENV

WORKDIR /src

COPY --chown=node:node pnpm-lock.yaml ./
RUN \
  apk --update upgrade \
  && apk add ca-certificates openssl --virtual .buildDeps wget git g++ make python3 linux-headers \
  && update-ca-certificates \
  && chown node:node /src \
  && su -l node -c "cd /src && pnpm fetch --prod" \
  && apk del .buildDeps \
  && rm -rf \
    /tmp/* \
    /root/.node-gyp \
    /root/.npm \
    /etc/apk/cache/* \
    /var/cache/apk/*

USER node
COPY --chown=node:node . /src
RUN pnpm install --prod --prefer-offline

EXPOSE 3000

CMD [ "./node_modules/.bin/mfleet" ]

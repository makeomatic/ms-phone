FROM makeomatic/node:$NODE_VERSION-onbuild

ENV NCONF_NAMESPACE=MS_PHONE \
    NODE_ENV=$NODE_ENV

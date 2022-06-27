FROM geoffreybooth/meteor-base:2.7.1 as bundler

# Install app dependencies
RUN mkdir -p /source
WORKDIR /source
ADD package.json /source/
ADD package-lock.json /source/

RUN  NODE_ENV=development meteor npm install

# Build app
ADD . /source/
RUN meteor build --server-only --allow-superuser --directory /

FROM node:14 as runtime

RUN useradd -u 501 -d /home/meteor meteor

RUN mkdir /unchained-uploads && \
  chmod 777 /unchained-uploads

VOLUME /unchained-uploads

RUN apt-get update && apt-get install -y curl pdftk

# Install app dependencies
COPY --from=bundler /bundle/programs/server/package* /webapp/programs/server/
COPY --from=bundler /source/file_env.js  /webapp
WORKDIR /webapp/programs/server
RUN NODE_ENV=production npm install



# Copy the app
COPY --from=bundler /bundle /webapp/
RUN NODE_ENV=production npm run install --production
WORKDIR /webapp

ENV PORT 3000
ENV NODE_ENV production
ENV FILE_STORAGE_PATH /unchained-uploads

EXPOSE 3000
EXPOSE 4010
USER meteor
CMD node -r ./file_env.js main.js
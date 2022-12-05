FROM node:16-bullseye-slim

ENV HOME /usr/src/app/
ENV MEDIA_PATH /storage

# Create app directory
WORKDIR $HOME

# Change to non-root user
RUN groupadd -r -g 999 appuser && useradd -r -g appuser --uid 999 appuser \
  && mkdir -p $HOME \
  && mkdir ${MEDIA_PATH} \
  && chown -R appuser:appuser $HOME ${MEDIA_PATH}
USER appuser

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=appuser:appuser package*.json ./
RUN npm install --omit=dev --force

# Bundle app source
COPY --chown=appuser:appuser ./ .

# Change permissions
RUN chmod +x scripts/entrypoint.sh scripts/run-server.sh scripts/wait-for-it.sh

# VOLUME [ "${MEDIA_PATH}" ]
ENV CACHE_PATH ${MEDIA_PATH}/.cache
EXPOSE 3000

ENTRYPOINT ["/usr/src/app/scripts/entrypoint.sh"]
CMD [ "scripts/run-server.sh" ]

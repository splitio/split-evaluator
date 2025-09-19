FROM splitsoftware/split-evaluator:2.8.0

RUN apk add shadow curl \
&& groupadd --gid 14001 cnapp && useradd --no-create-home --gid 14001 --uid 14000 --shell /bin/false cnapp \
&& npm install --prefix /usr/src/split-evaluator global-agent@^2 https-proxy-agent@^7.0.2 \
&& chown cnapp:cnapp -R /usr/src/split-evaluator

# Copy our modified sdk.js with proxy support
COPY sdk.js /usr/src/split-evaluator/sdk.js

USER cnapp
ENTRYPOINT ["node", "server.js"]

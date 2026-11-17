# Plainfile: one image for the hosted SaaS and for self-hosted installs.
# Build from the agent-labs root so the fixed frameworks/ mappings come along:
#   docker build -f plainfile/Dockerfile -t plainfile .
FROM node:22-alpine
WORKDIR /app
COPY plainfile/ ./plainfile/
COPY frameworks/ ./frameworks/
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "plainfile/src/cli.js", "saas"]

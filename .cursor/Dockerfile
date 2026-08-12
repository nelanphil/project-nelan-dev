FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Base system tooling
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl gnupg git build-essential \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 (matches the repo's toolchain)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# MongoDB 8.0 (used by the Express API for auth + contact storage)
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
        | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" \
        > /etc/apt/sources.list.d/mongodb-org-8.0.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends mongodb-org \
    && rm -rf /var/lib/apt/lists/*

USER ubuntu

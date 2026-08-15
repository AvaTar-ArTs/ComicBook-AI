# Local environment directory

This repository does not store secrets. For a local machine, create:

  mkdir -p ~/.env.d
  cp .env.template ~/.env.d/comicbook-ai.env
  chmod 600 ~/.env.d/comicbook-ai.env

Load it only in a trusted shell or deployment process. The Firebase Function expects OPENAI_API_KEY to be configured as a Firebase Secret; do not put the key in frontend Vite variables.

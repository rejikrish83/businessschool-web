#!/bin/bash

# Fetch secrets
API_URL=${API_URL:-$1}
OKTA_DOMAIN=${OKTA_DOMAIN:-$2}
CLIENT_ID=${CLIENT_ID:-$3}

# Create environment.ts file
cat <<EOL >src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: '${API_URL}',
  OktaDomain: '${OKTA_DOMAIN}',
  ClientID: '${CLIENT_ID}',
};
EOL
chmod +x generate-environment-file.sh
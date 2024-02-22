### IP

In case I lose my IP address while remote, this will cause a dedicated server to
update an external server that I can access.

#### Server Setup

```bash
# Setup key for JWT
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem
docker-compose up --build
```

#### Development (Docker)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

#### Development (Manual)

```bash
pnpm install
pnpm run dev
```

Once it's running, setup a reverse proxy to port 80.

#### Client Setup

```bash
# Get latest IP
curl -H "Authorization: $(/path/to/node `readlink -f ./scripts/get-token.js`)" https://example.com/ip/get

# Set latest IP
curl -X POST -H "Authorization: $(/path/to/node `readlink -f ./scripts/get-token.js`)" https://example.com/ip/set

# Add cron to automatically run this
crontab -e

# Add this line
*/30 * * * * curl -X POST -H "Authorization: $(/path/to/node /path/to/scripts/get-token.js)" https://example.com/ip/set
```

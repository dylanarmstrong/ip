### IP

In case I lose my IP address while remote, this will cause a dedicated server to
update an external server that I can access.

#### Docker

Please note, the Dockerfile requires the application to be pre-built.

```
npm run build
docker build -t dylanarms/ip .
docker run -d -p <host port>:80 --name ip dylanarms/ip
```

#### Server Setup

```
# Setup key for JWT
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem

# Manual
npm ci
npm run build
node lib/server.js
```

Once it's running, setup a reverse proxy to port 80.

#### Client Setup

```
# Get latest IP
curl -H "Authorization: $(node /path/to/get-token.js)" https://example.com/ip/get

# Set latest IP
curl -X POST -H "Authorization: $(node /path/to/get-token.js)" https://example.com/ip/set

# Add cron to automatically run this
crontab -e

# Add this line
*/30 * * * * curl -X POST -H "Authorization: $(node /path/to/get-token.js)" https://example.com/ip/set
```

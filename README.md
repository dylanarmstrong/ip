### IP

In case I lost my IP address while remote, this will cause a dedicated server to
update an external server that I can access.

#### Docker

```
docker build -t dylanarms/ip .
docker run -d -p <host port>:80 --name photos dylanarms/ip
```

#### Server Setup

```
npm install
node server.js
```

Once it's running, setup a reverse proxy to port 9006.

#### Client Setup

```
# Copy config file
cp config.example.json config.json

# Update user & pass
vim config.json

# Add cron to automatically run this
crontab -e

# Add this line
*/30 * * * * curl -X POST -H 'user: random' -H 'pass: password' https://example.com/ip/set
```

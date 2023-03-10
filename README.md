# Proxy Auth

Validate the presence of a token before proxying to upstream server

## Problem

Containers started using Docker Swarm bypass the system firewall, which is a huge security issue if you rely on authentication at the HTTP level to prevent unwanted access. Proxy Auth aims to add an additional layer of security, requiring a static token to be present before proxying requests to the upstream application.

## Usage

### In `docker-compose.yml`

```
version: # whatever

services:
  web:
    image: myapp:latest
    # DO NOT EXPOSE PORTS 
  
  proxy_auth:
    build: path/to/proxy_auth
    environment:
      TOKEN: # Hardcode your token here
      UPSTREAM: http://web:3000 # No trailing slash
    ports:
      - 3000:80
```

### In your reverse proxy

Set `X-Proxy-Auth` to your token before proxying authenticated requests

## Development

Run `yarn test test` to run the tests.

See `/package.json` and `/test/package.json` for more information.

## Security

Proxy Auth represents a best effort to prevent unwanted access to protected Docker containers. Please contact me directly by email to report any security vulnerabilities that you find.

### Risks

#### Disclosure of static token

If the token used to authenticate requests is compromised, attackers may be able to bypass your reverse proxy and access your container directly. To mitigate against this, `X-Proxy-Auth` is not sent to the upstream container. It is your responsibility to ensure that any file containing the token is not readable by adversaries.

You should use a different token for each application you deploy.

#### Direct access to upstream container

The approach used by Proxy Auth relies on the assumption that containers can only be accessed from the host network via port forwarding rules in `docker-compose.yml`. If an attacker is able to access the upstream container directly, such as from another container on the same Docker network, they can bypass Proxy Auth.

Ensure that any container running on the same Docker network as your upstream container cannot make untrusted HTTP requests.

#### Logic error in Proxy Auth

The logic used to check the `X-Proxy-Auth` header relies on `if` directives in Nginx. The behaviour of `if` directives is [notoriously unintuitive](https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/) and may change in a future release of Nginx. There may be loopholes in the token checking logic that allow attackers to bypass Proxy Auth. In addition, the `=` operator may be vulnerable to timing attacks.

If you require a greater level of security than Proxy Auth is able to provide, you should implement token checking directly in your own application. See [`rack_authorised_proxy`](https://github.com/12joan/rack_authorised_proxy) for an example in Ruby.

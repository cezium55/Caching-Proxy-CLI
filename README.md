# Caching-Proxy-CLI

A small CLI tool that starts a caching proxy server. It forwards incoming
requests to a target origin server and caches the responses — repeat
requests are served from cache instead of hitting the origin again.

Built with **Node.js** and **Express**.

---

## What it does

- Starts a local proxy server on a port you choose
- Forwards requests to a specified origin server
- Caches responses so repeated requests don't re-hit the origin
- Lets you clear the cache on demand

## Installation

```bash
git clone https://github.com/cezium55/caching-proxy-cli.git
cd caching-proxy-cli
npm install
```

## Usage

Start the proxy, pointing it at an origin server:

```bash
node index.js --port 3000 --origin http://dummyjson.com
```

Then send requests to the proxy instead of the origin directly:

```bash
curl http://localhost:3000/products
```

The first request is a cache **MISS** (fetched from origin and stored).
Every identical request after that is a cache **HIT** (served from cache).

To clear the cache:

```bash
node index.js --clear-cache
```

> Flag names above reflect the standard `--port` / `--origin` / `--clear-cache` convention for this kind of tool — double check them against `index.js` and adjust if yours differ.

## Requirements

- Node.js (v16+ recommended)
- npm

## License

[MIT](LICENSE)

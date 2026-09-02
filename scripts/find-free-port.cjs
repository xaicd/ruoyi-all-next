const net = require('net');

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.listen(port, '0.0.0.0', () => {
      server.close(() => resolve(true));
    });
  });
}

async function findFreePort(startPort = 3300, maxPort = 3999) {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`在端口范围 [${startPort}-${maxPort}] 内未找到可用空闲端口`);
}

if (require.main === module) {
  const start = parseInt(process.argv[2], 10) || 3300;
  findFreePort(start).then((port) => {
    console.log(port);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { findFreePort, isPortAvailable };

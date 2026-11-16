// Local static file server. It does not process orders or form submissions.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8000;
const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

http.createServer(function (request, response) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405);
        response.end('Method not allowed');
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400);
        response.end('Invalid URL');
        return;
    }

    const relative = pathname === '/' ? 'indexx.html' : pathname.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep) || relative.split(/[\\/]/).some(part => part.startsWith('.'))) {
        response.writeHead(403);
        response.end('Access denied');
        return;
    }

    fs.readFile(file, function (error, data) {
        if (error) {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Page not found');
            return;
        }
        response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
        response.end(request.method === 'HEAD' ? undefined : data);
    });
}).listen(port, '127.0.0.1', function () {
    console.log('Noble is running at http://localhost:' + port);
    console.log('Press Ctrl+C to stop the server.');
});

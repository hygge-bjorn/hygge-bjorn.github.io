import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@vaneisu/ultraviolet-static';
import { join } from 'node:path';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Serve public static frontend files (HTML/CSS)
app.use(express.static(join(process.cwd(), 'public')));

// Serve the Ultraviolet proxy core files
app.use('/uv/', express.static(uvPath));

// Handle wildcard routing for proxy requests
app.flatMap || app.use((req, res) => {
    res.status(404).sendFile(join(process.cwd(), 'public/404.html'));
});

server.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = "500";
const server = app.listen(PORT, () => {
    console.log(`Api is Listening to port ${PORT}`)
});
server.on('error', (e) => {
    console.error('Error:', e);
});

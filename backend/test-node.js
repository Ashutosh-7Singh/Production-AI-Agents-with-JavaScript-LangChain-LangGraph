const http = require('http');
const server = http.createServer();
server.listen("500", () => {
    console.log("Listening callback called");
});
server.on('error', e => console.error("Error event:", e));

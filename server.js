const http = require('http');
const app = require('./app');
const cors=require('cors');
const fs=require('fs');
const ConnectionDB = require('./config/connectionDB.config');
const socketHandler = require('./socket/socketServer');

app.use(cors());


const PORT = 3001;
const options = {
    key: fs.readFileSync("./cert/server-key.pem"),
    cert: fs.readFileSync("./cert/server-cert.pem"),
};
ConnectionDB();
const server = http.createServer(options,app);
socketHandler(server);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

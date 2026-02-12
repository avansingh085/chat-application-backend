const http = require('http');
const app = require('./app');
const cors=require('cors');
const fs=require('fs');
const ConnectionDB = require('./config/connectionDB.config');
const socketHandler = require('./socket/socketServer');
const {BASE_SSL_CERT_PATH}=require('./config/server.config.js');
const {connectRedis}=require('./config/redis.config.js')


const PORT = 3001;

const options = {
    key: fs.readFileSync(`${BASE_SSL_CERT_PATH}/server-key.pem`),
    cert: fs.readFileSync(`${BASE_SSL_CERT_PATH}/server-cert.pem`),
};
ConnectionDB();
connectRedis();
const server = http.createServer(options,app);
setTimeout(()=>{
socketHandler(server);
},5000)

server.listen(PORT, '0.0.0.0',  () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const http = require('http');
const app = require('./app');
const cors=require('cors');
const fs=require('fs');
const ConnectionDB = require('./config/connectionDB.config');
const socketHandler = require('./socket/socketServer');

app.use(cors({
  origin: function (origin, callback) {
   
    const allowed = [
      'https://www.avansingh.in',
      'https://chat-application-henna-iota.vercel.app'
    ];
    if (!origin || allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


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

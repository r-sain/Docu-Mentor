import { Server } from 'socket.io';
import Connection from "./database/db.mjs"
import {getDocument, updateDocument} from './controller/document-controller.mjs';

const PORT = 9000;
Connection()
const io = new Server(PORT, {
  //socket.io is running on which port, it takes the port and another object to manage CORS
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  //creating server connection, it takes name and a callback function
  socket.on('get-document', async documentId => {
    const document=await getDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data);

    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async data =>{
      await updateDocument(documentId, data)
    })
  });
});

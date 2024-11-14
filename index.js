const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars')
const productRouter = require('./routes/productsRouter');
const viewsRouter = require('./routes/viewsRouter')
const productManager = require('./managers/productManager')
const cartsRouter = require('./routes/cartsRouter');
const { Socket } = require('dgram');
const connectDB = require('./config/db'); // Importar la conexión a MongoDB

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor');
});

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('productList', await productManager.getAllProducts());

    socket.on('createProduct', async (productData) => {
      const newProduct = await productManager.addProduct(productData);
      io.emit('productData', newProduct);
    });

    socket.on('deleteProduct', async (productId) => {
      await productManager.deleteProduct(productId);
      io.emit('productDeleted', productId);
    });
});

const port = 8080;
httpServer.listen(port, () => {
    console.log(`Escuchando el servidor en el puerto http://localhost:${port}`)
});

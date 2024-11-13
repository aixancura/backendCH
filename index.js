const express = require('express');
const app = express();
const productRouter = require('.routes/productsRouter');
const cartsRouter = require('.routes/cartsRouter');
const port = 8080;

app.use(express.json());

app.use('/products', productRouter);
app.use('/carts', cartsRouter);

app.listen('port', () => {
    console.log(`Escuchando el servidor en el puerto http:localhost:${port}`)
});

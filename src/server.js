const express = require("express");
const { Router } = express;

const ContenedorProductos = require("../lib/contenedorProductos");
const ContenedorCarrito = require("../lib/contenedorCarritos")
const productosApi = new ContenedorProductos("./assets/productos.json");
const carritoApi = new ContenedorCarrito("./assets/carritos.json");

const app = express();
const productos = Router();
const carrito = Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/productos", productos);
app.use("/api/carrito", carrito);

const administrador = false;

//------------------------Ruta PRODUCTO------------------------//
productos.get("/:id?", async (req, res) => {
    if(req.params.id){
        const id = parseInt(req.params.id, 10);
        res.send(await productosApi.getById(id));
    }
    else{
        res.send(await productosApi.getAll());
    }
});
productos.post("/", async (req, res) => {
    if(administrador == true){
        const prod = req.body;
        await productosApi.save(prod);
        res.send(`Producto agregado ${JSON.stringify(prod)}`);
    }
    else{
        res.send({error: -1, descripcion: "método 'post' no autorizado." });
    }
});
productos.put("/:id", async(req, res) => {
    if(administrador == true){
        const id = parseInt(req.params.id, 10);
        const prodOld = await productosApi.getById(id);
        const prod = req.body;
        await productosApi.upload(prod, id);
        const prodNew = await productosApi.getById(id);
        res.send(`Producto actualizado ${JSON.stringify(prodOld)} a ${JSON.stringify(prodNew)}`)
    }
    else{
        res.send({error: -1, descripcion: "método 'put' no autorizado." });
    }
});
productos.delete("/:id", async(req, res) => {
    if(administrador == true){
        const id = parseInt(req.params.id, 10);
        const prodAEliminar = await productosApi.getById(id);
        await productosApi.deleteById(id);
        res.send(`Producto eliminado con exito -> ${JSON.stringify(prodAEliminar)}`);
    }
    else{
        res.send({error: -1, descripcion: "método 'delete' no autorizado." });
    }
});

//------------------------Ruta CARRITO------------------------//
carrito.post("/", async (req, res) => {
    let carro = await carritoApi.crearCarrito();
    res.json(carro.id);
});
carrito.delete("/:id", async (req, res) => {
    const idCarrito = parseInt(req.params.id, 10);
    await carritoApi.eliminarCarrito(idCarrito);
    res.send({mensaje: `El carrito con el ID: ${idCarrito} fue eliminado`})
});
carrito.get("/:id/productos", async (req, res) => {
    const idCarrito =  parseInt(req.params.id, 10);
    res.send(await carritoApi.listarProductos(idCarrito));
});
carrito.post("/:id/productos/:id_prod", async (req, res) => {
    const idProducto = parseInt(req.params.id_prod, 10);
    const idCarrito = parseInt(req.params.id, 10);
    await carritoApi.agregarProducto(idProducto, idCarrito);
    res.send({mensaje: "Producto agregado con exito"})
});
carrito.delete("/:id/productos/:id_prod", async (req, res) => {
    const idProducto = parseInt(req.params.id_prod, 10);
    const idCarrito = parseInt(req.params.id, 10);
    await carritoApi.eliminarProductoDeCarrito(idProducto, idCarrito);
    res.send({mensaje: "Producto eliminado con exito"})
});

app.use((err, req, res, next) => {
    console.error(err.message);
    return res.status(400).send({ error : -2, descripcion: "ruta no implementada"});
  });

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Error en el servidor -> ${error}`));
const { promises : fs } = require("fs");

const ContenedorProductos = require("./contenedorProductos");
const productosApi = new ContenedorProductos("./assets/productos.json");

class Carrito{
    constructor(path){
        this.path = path;
    }

    async crearCarrito(){
        const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
        let carrito = {};
        let newId = 1;
        let timeStamp = Date.now();
        if(data.length > 0){
            newId = data[data.length - 1].id + 1;
            carrito = {id: newId, timestamp: timeStamp, productos: []};
        }
        else{
            carrito = {id: newId, timestamp: timeStamp, productos: []};
        }
        data.push(carrito);
        try{
            await fs.writeFile(this.path, JSON.stringify(data, null, 2))
        }
        catch(error){
            throw new Error(`No se pudo crear el carrito -> ${error}`)
        }
        return carrito;
    }

    async listarProductos(carritoId){
        const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const index = data.findIndex(elemento => elemento.id == carritoId);
        if(index == -1) {
            throw new Error(`No se encontro el ID -> ${error}`);
        }
        else{
            const carrito = data[index];
            const productos = carrito.productos;
            return productos;
        }
    }

    async agregarProducto(productoId, carritoId){
        //Agrega un producto al carrito, recibe ID del producto y ID del carrito
        const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const indexCarrito = data.findIndex(elemento => elemento.id == carritoId);
        if(indexCarrito == -1) {
            throw new Error(`No se encontro el ID -> ${error}`);
        }
        else{
            const carrito = data[indexCarrito];
            const prods = carrito.productos;
            const producto = await productosApi.getById(productoId);
            let existe = false;
            let prodActualizado = {}
            for(let elemento of prods){
                if(elemento.id == producto.id){
                    existe = true;
                    elemento.stock++;
                    prodActualizado = elemento;
                }
            }
            if(existe){
                let indexProducto = prods.findIndex(elemento => elemento.id == producto.id);
                prods[indexProducto] = prodActualizado;
            }
            else{
                const timeStamp = Date.now();
                prods.push({...producto,  timestamp: timeStamp, stock: 1})
            }

            carrito.productos = prods;
            data[indexCarrito] = carrito;
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        }
    }

    async eliminarCarrito(id) {
        const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const index = data.findIndex(objeto => objeto.id == id);
        if(index == -1){
            throw new Error(`No se pudo eliminar -> ${error}`);
        }
        else{
            data.splice(index, 1);
            const dataStr = JSON.stringify(data, null, 2);
            try {
                await fs.writeFile(this.path, dataStr);
            }
            catch(error){
                throw new Error(`No se pudo eliminar -> ${error}`);
            }
        }
    }

    async eliminarProductoDeCarrito(productoId, carritoId) {
        const data = JSON.parse(await fs.readFile(this.path, "utf-8"));
        const indexCarrito = data.findIndex(elemento => elemento.id == carritoId);
        if(indexCarrito == -1) {
            throw new Error(`No se encontro el ID del carrito-> ${error}`);
        }
        else{
            let carrito = data[indexCarrito];
            const indexProducto = carrito.productos.findIndex(elemento => elemento.id == productoId);
            if(indexProducto == -1) {
                throw new Error(`No se encontro el ID del producto-> ${error}`);
            }
            else{
                let producto = carrito.productos[indexProducto];
                if(producto.stock > 1){
                    producto.stock--;
                    console.log(producto.stock)
                    data[indexCarrito] = carrito;
                    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
                }
                else{
                    carrito.productos.splice(indexProducto, 1);
                    data[indexCarrito] = carrito;
                    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
                }
            }
        }
    }
}

module.exports = Carrito;
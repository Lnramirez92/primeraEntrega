const { promises : fs } = require("fs");

class Contenedor {
    constructor(path){
        this.path = path;
    }

    async getAll() {
        try{
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        }
        catch(error){
            throw new Error(`No se pudo leer el archivo -> ${error}`);
        }
    }

    async getById(id) {
        const data = await this.getAll();
        const index = data.findIndex(objeto => objeto.id == id);
        if(index == -1) {
            throw new Error(`No se encontro el ID -> ${error}`);
        }
        else{
            const encontrado = data[index];
            return encontrado;
        }
    }

    async save(objeto) {
        const data = await this.getAll();
        let newId = 0;
        if(data.length == 0){
            newId = 1;
        }
        else{
            newId = data[data.length -1].id + 1
        }
        const newObjeto = {...objeto, id: newId};
        data.push(newObjeto);
        const dataStr = JSON.stringify(data, null, 2);

        try{
            await fs.writeFile(this.path, dataStr);
            return newId;
        }
        catch(error){
            throw new Error(`No se pudo agregar el objeto -> ${error}`);
        }
    }

    async upload(objeto, id) {
        const data = await this.getAll();
        const index = data.findIndex(objeto => objeto.id == id);
        let newObject = {...objeto, id: id};

        if(index == -1) {
            throw new Error(`No se pudo actualizar -> ${error}`);
        }
        else{
            data[index] = newObject;
            const dataStr = JSON.stringify(data, null, 2);
            try{
                await fs.writeFile(this.path, dataStr);
            }
            catch(error){
                throw new Error(`No se pudo actualizar -> ${error}`);
            }
        }
    }

    async deleteById(id) {
        const data = await this.getAll();
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
    async deleteAll() {
        const arrayVacio = [];
        try{
            await fs.writeFile(this.path, JSON.stringify(arrayVacio, null, 2));
        }
        catch(error){
            throw new Error(`No se pudo eliminar -> ${error}`);
        }
    }
}

module.exports = Contenedor;
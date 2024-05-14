
import express from 'express';
import { json } from 'express';
import { readFile, writeFile } from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware para procesar solicitudes JSON y habilitar CORS
app.use(json());
app.use(cors());

// Ruta para agregar un nuevo producto
app.post('/agregar-producto', (req, res) => {
    const nuevoProducto = req.body;

    // Validar los datos del nuevo producto
    if (!nuevoProducto || !nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.imagen_url) {
        return res.status(400).send('Los datos del producto son inválidos');
    }

    // Leer el archivo db.json
    readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo db.json', err);
            return res.status(500).send('Error al leer el archivo db.json');
        }

        let db = JSON.parse(data);

        // Generar un nuevo ID para el producto
        nuevoProducto.id = db.productos.length + 1;

        // Agregar el nuevo producto a la lista de productos en la base de datos
        db.productos.push(nuevoProducto);

        // Escribir la base de datos actualizada en el archivo db.json
        writeFile('db.json', JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo db.json', err);
                return res.status(500).send('Error al escribir en el archivo db.json');
            }

            console.log('Producto agregado correctamente:', nuevoProducto);
            res.status(201).json(nuevoProducto);
        });
    });
});

// Ruta para eliminar un producto
app.delete('/delete-product/:id', (req, res) => {
    const productId = req.params.id;

    // Leer el archivo db.json
    readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo db.json', err);
            return res.status(500).send('Error al leer el archivo db.json');
        }

        let db = JSON.parse(data);

        // Filtrar el producto a eliminar
        db.productos = db.productos.filter(producto => producto.id !== parseInt(productId));

        // Verificar si se eliminó algún producto
        if (db.productos.length === data.productos.length) {
            return res.status(404).send('Producto no encontrado');
        }

        // Escribir la base de datos actualizada en el archivo db.json
        writeFile('db.json', JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo db.json', err);
                return res.status(500).send('Error al escribir en el archivo db.json');
            }

            console.log('Producto eliminado correctamente:', productId);
            res.status(200).send('Producto eliminado correctamente');
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

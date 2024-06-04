//Importaciones
import express from 'express'; 
import fs from 'fs';

//sevidor ok.
const app = express();
app.listen(3000, () => {console.log('Servidor arriba en puerto 3000')
})
app.use(express.static("public"));

//Ruta para agregar datos.
app.get('/agregar', (req, res) => {
  const { nombre, precio } = req.query;
  const nuevoDeporte = {
    nombre: nombre,
    precio: precio
  };
  
  fs.readFile('deportes.json', 'utf8', (err, data) => {
    //Crear array
    let deportes = [];
    //errores.
    if (err) {
      console.error('Error al leer el archivo:', err);
    } else {
      //Parseo de variable.
      deportes = JSON.parse(data);
    }
    //Agregar nuevo dato al array.
    deportes.push(nuevoDeporte);
    
    fs.writeFile('deportes.json', JSON.stringify(deportes), err => {
      if (err) {
        //errores.
        console.error('Error al escribir el archivo:', err);
        res.status(500).send('Error del servidor');
        return;
      }
      //Respuesta positiva.
      res.send('Deporte agregado');
    });
  });
});

// Ruta GET
app.get('/deportes', (req, res) => {

  fs.readFile('deportes.json', 'utf8', (err, data) => {
    //errores.
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.status(500).json({ error: 'Error al leer el archivo' });
      return;
    }
    const deportes = JSON.parse(data);
    res.json({ deportes });
  });
});

//Modificar precio.
app.get("/editar", (req, res) => {
  const { nombre, precio } = req.query;
  fs.readFile('deportes.json', 'utf8', (err, data) => {
    let deportes = JSON.parse(data);
    let deporte = deportes.find(d => d.nombre === nombre);
    if (deporte) {
      //Buscar precio.
      deporte.precio = precio;
      fs.writeFile('deportes.json', JSON.stringify(deportes), err => {
      res.send('Precio actualizado correctamente. 👍');
      });
    } else {
      res.send('Deporte no encontrado');
    }
  });
});

//Eliminar.
app.get("/eliminar", (req, res) => {
  const { nombre } = req.query;
  fs.readFile('deportes.json', 'utf8', (err, data) => {
     try {
      let deportes = JSON.parse(data);
      let deporteEliminado = deportes.filter(d => d.nombre !== nombre);
      fs.writeFile('deportes.json', JSON.stringify(deporteEliminado, null, 2), err => {
        res.send('Deporte eliminado correctamente');
      });
      //error.
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error al eliminar');
    }
  });
});

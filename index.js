// 1. Importacion de dependencias globales

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();

// 2. Configuración de Middlewares (Filtros de entrada)

app.use(cors());
app.use(express.json());

// 3. Configuración de contrato Swagger (OpenAPI)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', 
        info: {
            title: 'API Alquiler de Vehículos', 
            version: '1.0.0',
            description: 'Documentación técnica para el sistema de Alquiler de Vehículos. Administrando por tablas las sucursales, los clientes, los vehículos y el historial de alquileres.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local de Desarrollo'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. Importación de Rutas Modulares (Separación de responsabilidades)

const rutasSucursales = require('./routes/sucursales');
const rutasClientes = require('./routes/clientes');
const rutasVehiculos = require('./routes/vehiculos');
const rutasAlquileres = require('./routes/alquileres');


// 5. Conexión de Rutas (Delegación del tráfico)

app.use('/api/sucursales', rutasSucursales);
app.use('/api/clientes', rutasClientes);
app.use('/api/vehiculos', rutasVehiculos);
app.use('/api/alquileres', rutasAlquileres);

// 6. Encender el servidor

const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PUERTO}`);
    console.log(`Documentación interactiva lista en http://localhost:${PUERTO}/api-docs`);
});
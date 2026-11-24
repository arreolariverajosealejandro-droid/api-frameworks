// Configuración de la conexión a la base de datos PostgreSQL
const { Pool } = require('pg');

const db = new Pool({
    user: 'postgres',         
    host: 'localhost',        
    database: 'alquiler_vehiculos_db', 
    password: 'Alex06', 
    port: 5432,
});

module.exports = db;
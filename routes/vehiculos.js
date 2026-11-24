// RUTAS: Vehículos (routes/vehiculos.js)

const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a PostgreSQL

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtiene todos los vehículos
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM vehiculos');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la base de datos" });
    }
});

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Registra un nuevo vehículo
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: "JQK-356-K"
 *               modelo:
 *                 type: string
 *                 example: "Dodge Charger"
 *               anio:
 *                 type: integer
 *                 example: 2023
 *               sucursal_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Vehículo registrado exitosamente.
 */
router.post('/', async (req, res) => {
    try {
        const { matricula, modelo, anio, sucursal_id } = req.body;
        const query = 'INSERT INTO vehiculos (matricula, modelo, anio, sucursal_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const resultado = await db.query(query, [matricula, modelo, anio, sucursal_id]);
        res.status(201).json({ mensaje: "Vehículo creado", vehiculo: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar." });
    }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualiza un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: "RCA-718-K"
 *               modelo:
 *                 type: string
 *                 example: "Dodge Challenger"
 *               anio:
 *                 type: integer
 *                 example: 2022
 *               sucursal_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, modelo, anio, sucursal_id } = req.body;
        const query = 'UPDATE vehiculos SET matricula = $1, modelo = $2, anio = $3, sucursal_id = $4 WHERE id = $5 RETURNING *';
        const resultado = await db.query(query, [matricula, modelo, anio, sucursal_id, id]);
        res.status(200).json({ mensaje: "Vehículo actualizado", vehiculo: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el vehículo" });
    }
});

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Elimina un vehículo
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado.
 *       500:
 *         description: Error al eliminar el vehículo.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM vehiculos WHERE id = $1 RETURNING *';
        await db.query(query, [id]);
        res.status(200).json({ mensaje: "Vehículo eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el vehículo." });
    }
});

module.exports = router;

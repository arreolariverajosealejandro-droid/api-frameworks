// RUTAS: Alquileres (routes/alquileres.js)

const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a PostgreSQL

/**
 * @swagger
 * /api/alquileres:
 *   get:
 *     summary: Obtiene todos los alquileres
 *     tags: [Alquileres]
 *     responses:
 *       200:
 *         description: Lista de alquileres obtenida exitosamente.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM alquileres');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la base de datos" });
    }
});

/**
 * @swagger
 * /api/alquileres:
 *   post:
 *     summary: Registra un nuevo alquiler
 *     tags: [Alquileres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-01"
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-07"
 *               cliente_id:
 *                 type: integer
 *                 example: 2
 *               vehiculo_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Alquiler registrado exitosamente.
 */
router.post('/', async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, cliente_id, vehiculo_id } = req.body;
        const query = 'INSERT INTO alquileres (fecha_inicio, fecha_fin, cliente_id, vehiculo_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const resultado = await db.query(query, [fecha_inicio, fecha_fin, cliente_id, vehiculo_id]);
        res.status(201).json({ mensaje: "Alquiler creado", alquiler: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar." });
    }
});

/**
 * @swagger
 * /api/alquileres/{id}:
 *   put:
 *     summary: Actualiza un alquiler
 *     tags: [Alquileres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alquiler
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-02"
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-09"
 *               cliente_id:
 *                 type: integer
 *                 example: 2
 *               vehiculo_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Alquiler actualizado exitosamente.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, cliente_id, vehiculo_id } = req.body;
        const query = 'UPDATE alquileres SET fecha_inicio = $1, fecha_fin = $2, cliente_id = $3, vehiculo_id = $4 WHERE id = $5 RETURNING *';
        const resultado = await db.query(query, [fecha_inicio, fecha_fin, cliente_id, vehiculo_id, id]);
        res.status(200).json({ mensaje: "Alquiler actualizado", alquiler: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el alquiler" });
    }
});

/**
 * @swagger
 * /api/alquileres/{id}:
 *   delete:
 *     summary: Elimina un alquiler
 *     tags: [Alquileres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alquiler
 *     responses:
 *       200:
 *         description: Alquiler eliminado.
 *       500:
 *         description: Error al eliminar el alquiler.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM alquileres WHERE id = $1 RETURNING *';
        await db.query(query, [id]);
        res.status(200).json({ mensaje: "Alquiler eliminado." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el alquiler." });
    }
});

module.exports = router;
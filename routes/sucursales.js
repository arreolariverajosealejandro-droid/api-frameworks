// RUTAS: Sucursales (routes/sucursales.js)

const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a PostgreSQL

/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     summary: Obtiene todas las sucursales
 *     tags: [Sucursales]
 *     responses:
 *       200:
 *         description: Lista de sucursales obtenida exitosamente.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM sucursales');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la base de datos" });
    }
});

/**
 * @swagger
 * /api/sucursales:
 *   post:
 *     summary: Registra una nueva sucursal
 *     tags: [Sucursales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plaza Galerías"
 *               ciudad:
 *                 type: string
 *                 example: "Cuernavaca"
 *               direccion:
 *                 type: string
 *                 example: "Av. Emiliano Zapata 829, Tlaltenango"
 *     responses:
 *       201:
 *         description: Sucursal registrada.
 */
router.post('/', async (req, res) => {
    try {
        const { nombre, ciudad, direccion } = req.body;
        const query = 'INSERT INTO sucursales (nombre, ciudad, direccion) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await db.query(query, [nombre, ciudad, direccion]);
        res.status(201).json({ mensaje: "Sucursal creada", sucursal: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/sucursales/{id}:
 *   put:
 *     summary: Actualiza una sucursal
 *     tags: [Sucursales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sucursal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plaza Galerías 123"
 *               ciudad:
 *                 type: string
 *                 example: "Cuernavaca, México"
 *               direccion:
 *                 type: string
 *                 example: "Av. Emiliano Zapata 829, Tlaltenango distrito 9"
 *     responses:
 *       200:
 *         description: Sucursal actualizada.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ciudad, direccion } = req.body;
        const query = 'UPDATE sucursales SET nombre = $1, ciudad = $2, direccion = $3 WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [nombre, ciudad, direccion, id]);
        res.status(200).json({ mensaje: "Sucursal actualizada", sucursal: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

/**
 * @swagger
 * /api/sucursales/{id}:
 *   delete:
 *     summary: Elimina una sucursal
 *     tags: [Sucursales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal eliminada.
 *       500:
 *         description: Error al eliminar la sucursal.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM sucursales WHERE id = $1 RETURNING *';
        await db.query(query, [id]);
        res.status(200).json({ mensaje: "Sucursal eliminada." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la sucursal. Verifique que no tenga vehículos asociados." });
    }
});

module.exports = router;
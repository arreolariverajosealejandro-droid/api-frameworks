// RUTAS: Clientes (routes/clientes.js)

const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a PostgreSQL

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM clientes');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la base de datos" });
    }
});

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Registra un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Perez"
 *               numero_licencia:
 *                 type: string
 *                 example: "QRO18765435"
 *               telefono:
 *                 type: string
 *                 example: "5557654321"
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente.
 */
router.post('/', async (req, res) => {
    try {
        const { nombre, numero_licencia, telefono } = req.body;
        const query = 'INSERT INTO clientes (nombre, numero_licencia, telefono) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await db.query(query, [nombre, numero_licencia, telefono]);
        res.status(201).json({ mensaje: "Cliente creado", cliente: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar." });
    }
});

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Perez Lopéz"
 *               numero_licencia:
 *                 type: string
 *                 example: "QRO10999999"
 *               telefono:
 *                 type: string
 *                 example: "5559264819"
 *     responses:
 *       200:
 *         description: Cliente actualizado.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, numero_licencia, telefono } = req.body;
        const query = 'UPDATE clientes SET nombre = $1, numero_licencia = $2, telefono = $3 WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [nombre, numero_licencia, telefono, id]);
        res.status(200).json({ mensaje: "Cliente actualizado", cliente: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    }
});

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado.
 *       500:
 *         description: Error al eliminar el cliente.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
        await db.query(query, [id]);
        res.status(200).json({ mensaje: "Cliente eliminado." });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el cliente." });
    }
});

module.exports = router;
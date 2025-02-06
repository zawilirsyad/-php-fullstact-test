const express = require("express");
const pool = require("./db");
const redisClient = require("./redisClient");
const upload = require("./upload");
const router = express.Router();

router.post("/clients", upload.single("client_logo"), async (req, res) => {
  try {
    const {
      name,
      slug,
      is_project,
      self_capture,
      client_prefix,
      address,
      phone_number,
      city,
    } = req.body;
    const client_logo = req.file ? req.file.location : "no-image.jpg";

    const result = await pool.query(
      `INSERT INTO my_client (name, slug, is_project, self_capture, client_prefix, client_logo, address, phone_number, city) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        name,
        slug,
        is_project,
        self_capture,
        client_prefix,
        client_logo,
        address,
        phone_number,
        city,
      ]
    );

    const client = result.rows[0];

    redisClient.setex(slug, 3600, JSON.stringify(client));

    res.status(201).json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

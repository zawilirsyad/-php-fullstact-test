router.put("/clients/:slug", upload.single("client_logo"), async (req, res) => {
  const { slug } = req.params;
  const {
    name,
    is_project,
    self_capture,
    client_prefix,
    address,
    phone_number,
    city,
  } = req.body;
  const client_logo = req.file ? req.file.location : undefined;

  const result = await pool.query(
    `UPDATE my_client SET name = $1, is_project = $2, self_capture = $3, client_prefix = $4, 
       client_logo = COALESCE($5, client_logo), address = $6, phone_number = $7, city = $8, updated_at = NOW()
       WHERE slug = $9 RETURNING *`,
    [
      name,
      is_project,
      self_capture,
      client_prefix,
      client_logo,
      address,
      phone_number,
      city,
      slug,
    ]
  );

  if (result.rows.length > 0) {
    redisClient.del(slug);
    redisClient.setex(slug, 3600, JSON.stringify(result.rows[0]));
    return res.json(result.rows[0]);
  } else {
    return res.status(404).json({ error: "Client not found" });
  }
});

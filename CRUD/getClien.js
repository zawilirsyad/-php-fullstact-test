router.get("/clients/:slug", async (req, res) => {
  const { slug } = req.params;

  redisClient.get(slug, async (err, data) => {
    if (data) {
      return res.json(JSON.parse(data));
    } else {
      const result = await pool.query(
        `SELECT * FROM my_client WHERE slug = $1`,
        [slug]
      );
      if (result.rows.length > 0) {
        redisClient.setex(slug, 3600, JSON.stringify(result.rows[0]));
        return res.json(result.rows[0]);
      } else {
        return res.status(404).json({ error: "Client not found" });
      }
    }
  });
});

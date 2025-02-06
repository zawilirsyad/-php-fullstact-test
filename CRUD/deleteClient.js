router.delete("/clients/:slug", async (req, res) => {
  const { slug } = req.params;

  const result = await pool.query(
    `UPDATE my_client SET deleted_at = NOW() WHERE slug = $1 RETURNING *`,
    [slug]
  );

  if (result.rows.length > 0) {
    redisClient.del(slug);
    return res.json({ message: "Client soft deleted" });
  } else {
    return res.status(404).json({ error: "Client not found" });
  }
});

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/properties
// Støtter filtrering via query-params: ?type=rent&minPrice=5000&maxPrice=15000
app.get("/api/properties", async (req, res) => {
  const { type, minPrice, maxPrice } = req.query;

  let query = "SELECT * FROM properties WHERE 1=1";
  const params = [];

  if (type) {
    params.push(type);
    query += ` AND type = $${params.length}`;
  }
  if (minPrice) {
    params.push(Number(minPrice));
    query += ` AND price >= $${params.length}`;
  }
  if (maxPrice) {
    params.push(Number(maxPrice));
    query += ` AND price <= $${params.length}`;
  }

  query += " ORDER BY created_at DESC";

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Databasefeil" });
  }
});

// GET /api/properties/:id
app.get("/api/properties/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*,
              array_agg(pi.url ORDER BY pi.sort_order) FILTER (WHERE pi.url IS NOT NULL) AS images
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id],
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Eiendom ikke funnet" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Databasefeil" });
  }
});

app.listen(PORT, () => console.log(`API kjører på http://localhost:${PORT}`));

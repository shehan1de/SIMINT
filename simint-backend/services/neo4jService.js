const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function runCypherQuery(query) {
  const session = driver.session();
  const result = await session.run(query);
  const data = result.records.map(r => r.toObject());
  await session.close();
  return data;
}

module.exports = runCypherQuery;

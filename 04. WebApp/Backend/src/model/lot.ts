import pool from "../database/sqldb";
import { RowDataPacket } from "mysql2";

class LotModel {
  // Gets Lot summary
  static async getLotSummaryByEstate(estateId: number) {
    const query = `
          SELECT 
            L.lotId,
            L.lot,
            L.lat,
            L.lng,
            MAX(R.timestamp) AS lastUpdate,
            AVG(R.temperature) AS temperature,
            AVG(R.humidity) AS humidity,
            AVG(R.ph) AS ph,
            AVG(R.n) AS n,
            AVG(R.p) AS p,
            AVG(R.k) AS k
          FROM LOTS L
          JOIN NODES N ON N.lotId = L.lotId
          JOIN (
            SELECT SR1.*
            FROM SENSOR_READINGS SR1
            INNER JOIN (
              SELECT nodeId, MAX(timestamp) AS latestTime
              FROM SENSOR_READINGS
              GROUP BY nodeId
            ) AS LatestPerNode
            ON SR1.nodeId = LatestPerNode.nodeId AND SR1.timestamp = LatestPerNode.latestTime
          ) R ON R.nodeId = N.nodeId
          WHERE L.estateId = ?
          GROUP BY L.lotId, L.lot, L.lat, L.lng
          `;

    const [rows] = await pool.query<RowDataPacket[]>(query, [estateId]);

    if (rows.length === 0) return null;

    return rows.map((row) => ({
      lotId: row.lotId,
      lot: row.lot,
      location: [parseFloat(row.lat), parseFloat(row.lng)],
      lastUpdate: row.lastUpdate,
      temperature: parseFloat(row.temperature),
      humidity: parseFloat(row.humidity),
      ph: parseFloat(row.ph),
      n: parseFloat(row.n),
      p: parseFloat(row.p),
      k: parseFloat(row.k),
    }));
  }
}

export default LotModel;

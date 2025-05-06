import { RequestHandler } from "express";
import LotModel from "../../model/lot";
import createHttpError from "http-errors";

interface HomeProps {
  name: string;
  location: [number, number];
}

interface NodeProps {
  nodeId: number;
  node: string;
  location: [number, number];
  temperature: string;
  humididty: string;
  ph: string;
  n: string;
  p: string;
  k: string;
}

export const getMapData: RequestHandler = async (req, res, next) => {
  try {
    // Step 01: Extract query params
    const userId = parseInt(req.params.userId);
    const lotId = parseInt(req.params.lotId);

    console.log("User " + userId + " requests node data of lot " + lotId);

    if (isNaN(userId) || isNaN(lotId)) {
      throw createHttpError(400, "Missing required fields");
    }

    // Step 02: User and lot get autherized
    const lot = await LotModel.isLotAccessibleByUser(userId, lotId);
    if (!lot) {
      throw createHttpError(403, "Forbidden");
    }

    // Step 03: Find home position
    const home: HomeProps = {
      name: lot.lot,
      location: [parseFloat(lot.lat), parseFloat(lot.lng)],
    };

    // Step 04: Find node summary
    const rows = await LotModel.getNodesByLotId(lotId);
    if (rows.length === 0) {
      throw createHttpError(404, "No data found");
    }

    const nodes: NodeProps[] = rows.map((row) => ({
      nodeId: row.nodeId,
      node: row.node,
      location: [parseFloat(row.nodeLat), parseFloat(row.nodeLng)],
      temperature: row.temperature,
      humididty: row.humidity,
      ph: row.ph,
      n: row.n,
      p: row.p,
      k: row.k,
    }));

    // Step 05: Send data
    console.log({ home, nodes });

    res.status(200).json({ message: "Node data get succesfully", home, nodes });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

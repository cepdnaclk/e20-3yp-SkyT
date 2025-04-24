import { RequestHandler } from "express";
import createHttpError from "http-errors";
import LotModel from "../../model/lot";
import { formatTimestamp } from "../../util/formatTimestamp";

export const getGalleryImages: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const lotId = parseInt(req.params.lotId);
    const lastId = parseInt(req.params.lastId);

    console.log(
      "User " +
        userId +
        " request images on lot " +
        lotId +
        " from imageId " +
        lastId
    );

    if (isNaN(userId) || isNaN(lotId) || isNaN(lastId)) {
      throw createHttpError(400, "Missing required fields");
    }

    const lot = await LotModel.isLotAccessibleByUser(userId, lotId);
    if (!lot) throw createHttpError(404, "Lot not found");

    const result = await LotModel.getGalleryImages(
      Number(lotId),
      lastId > 0 ? lastId : null
    );

    if (result.length === 0) {
      console.log("No more content to load");
      res.status(204).send();
    } else {
      const imageList = result.map((row) => ({
        imageId: row.imageId,
        url: row.url,
        uploadedAt: formatTimestamp(row.uploadedAt),
        node: row.node,
      }));

      console.log(imageList);

      res.status(200).json({ message: "Images got successfully.", imageList });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

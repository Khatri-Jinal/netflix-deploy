import { findVideoIdByUser } from "../../lib/db/hasura";
import { updateStats, insertStats } from "../../lib/db/hasura";
import { verifyToken } from "../../lib/db/utils";
export default async function stats(req, res) {
  if (req.method === "POST") {
    try {
      const token = req.cookies.token;

      if (!token) {
        res.status(403).send({ error: error });
      } else {
        const userId = await verifyToken(token);

        const { videoId, favourited, watched } = req.body;

        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;

        if (doesStatsExist) {
          const response = await updateStats(token, {
            favourited,
            userId,
            watched,
            videoId,
          });

          res.send({ data: response });
        } else {
          const response = await insertStats(token, {
            favourited,
            userId,
            watched,
            videoId,
          });
          res.send({ data: response });
        }
      }
    } catch (error) {
      console.log("error occured", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  } else {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(403).send({ error: error });
      } else {
        const userId = await verifyToken(token);
        const { videoId } = req.query;

        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;

        if (doesStatsExist) {
          res.send(findVideo);
        } else {
          res.status(404);
          res.send({ user: null, msg: "Video not found" });
        }
      }
    } catch (error) {
      console.log("error occured", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}

import cors from "cors";

const corsOptionsDelegate = (req, callback) => {
  // This is save since this is a prototype
  callback(null, { origin: true, credentials: true });
};

export const corsMiddleware = cors(corsOptionsDelegate);

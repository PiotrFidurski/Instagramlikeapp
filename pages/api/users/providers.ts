import { NextApiRequest, NextApiResponse } from "next";
import { ClientSafeProvider, getProviders } from "next-auth/client";
import { Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Response<Record<string, ClientSafeProvider> | []>>
) => {
  try {
    const providers = await getProviders();

    return res
      .status(200)
      .json({ success: true, errors: {}, data: providers! });
  } catch (error) {
    return res.status(400).json({ success: false, errors: {}, data: [] });
  }
};

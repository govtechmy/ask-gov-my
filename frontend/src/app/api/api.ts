// create a webhook listener
// with different http request POST, GET, DELETE, UPDATE
// by each request send it to searchServices to update the db in bonsai
// dont need to to update the questions variable instance inside questionServices
// because each new user open a page will make a request to fetch all the questions from plane.so api

import { NextApiRequest, NextApiResponse } from "next"
export default function handleGet(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    res.status(200).json({ message: 'Hello from Next.js!' })
  }
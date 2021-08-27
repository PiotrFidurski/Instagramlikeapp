import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { NextApiResponse } from "next-auth/internals/utils";
import * as yup from "yup";

export const setFormData = (values: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(values).forEach((entry: any) => {
    const [key, value] = entry;
    formData.set(key, value);
  });
  return formData;
};

async function resolvePromise(promise: any) {
  try {
    const data = await promise;

    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

function formatYupErrors(errors: yup.ValidationError) {
  let formatted: Record<string, string> = {};

  errors.inner.forEach((e) => {
    if (!Object.keys(formatted).includes(e.path!)) {
      formatted = { ...formatted, [e.path!]: e.errors[0] };
    }
  });

  return formatted;
}

const authorize = async (
  req: NextApiRequest,
  res: NextApiResponse,
  type?: string
) => {
  const session = await getSession({ req });
  if (session) {
    return session;
  } else {
    return type === "paginatedResult"
      ? res.status(400).json({
          success: false,
          data: {
            pages: [],
            pageInfo: {
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
          },
          errors: { error: "Not authorized to perform this action." },
        })
      : res.status(401).json({
          success: false,
          data: null,
          status: 401,
          errors: [{ message: "Not authorized to perform this action." }],
        });
  }
};

export { resolvePromise, formatYupErrors, authorize };

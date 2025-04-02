import type { ActionFunctionArgs } from "react-router";
import { loader } from "../../../modules/user/routes/user.$address.header";

export async function action({ params, request, context }: ActionFunctionArgs) {
  return loader({ params, request, context });
}

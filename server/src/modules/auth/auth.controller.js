import { sendSuccess } from "../../lib/http.js";
import { loginWithEmailPassword } from "./auth.service.js";

export async function loginController(req, res) {
  const payload = await loginWithEmailPassword(req.validatedBody);
  return sendSuccess(res, payload);
}

export async function meController(req, res) {
  return sendSuccess(res, req.user);
}

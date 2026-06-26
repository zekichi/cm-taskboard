import { Router } from "express";

import { asyncHandler } from "../../middleware/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import {
  addOrganizationMemberController,
  createOrganizationController,
  getOrganizationController,
  listOrganizationsController,
  removeOrganizationMemberController,
  updateOrganizationMemberController,
} from "./organizations.controller.js";
import {
  organizationMemberSchema,
  organizationSchema,
  updateOrganizationMemberSchema,
} from "./organizations.schemas.js";

const organizationsRouter = Router();

organizationsRouter.get("/", asyncHandler(listOrganizationsController));
organizationsRouter.post(
  "/",
  validateBody(organizationSchema),
  asyncHandler(createOrganizationController)
);
organizationsRouter.get(
  "/:organizationId",
  asyncHandler(getOrganizationController)
);
organizationsRouter.post(
  "/:organizationId/members",
  validateBody(organizationMemberSchema),
  asyncHandler(addOrganizationMemberController)
);
organizationsRouter.patch(
  "/:organizationId/members/:memberId",
  validateBody(updateOrganizationMemberSchema),
  asyncHandler(updateOrganizationMemberController)
);
organizationsRouter.delete(
  "/:organizationId/members/:memberId",
  asyncHandler(removeOrganizationMemberController)
);

export default organizationsRouter;

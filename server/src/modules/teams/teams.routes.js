import { Router } from "express";

import { asyncHandler } from "../../middleware/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import {
  addTeamMemberController,
  createTeamController,
  listTeamsController,
  removeTeamMemberController,
  updateTeamMemberController,
} from "./teams.controller.js";
import {
  createTeamSchema,
  teamMemberSchema,
  updateTeamMemberSchema,
} from "./teams.schemas.js";

const teamsRouter = Router();

teamsRouter.get("/", asyncHandler(listTeamsController));
teamsRouter.post("/", validateBody(createTeamSchema), asyncHandler(createTeamController));
teamsRouter.post(
  "/:teamId/members",
  validateBody(teamMemberSchema),
  asyncHandler(addTeamMemberController)
);
teamsRouter.patch(
  "/:teamId/members/:memberId",
  validateBody(updateTeamMemberSchema),
  asyncHandler(updateTeamMemberController)
);
teamsRouter.delete("/:teamId/members/:memberId", asyncHandler(removeTeamMemberController));

export default teamsRouter;

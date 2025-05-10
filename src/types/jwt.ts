import { ClientRole } from "../enums/roles";

export type JwtAuthPayload = {
  type: ClientRole;
  id: string;
};

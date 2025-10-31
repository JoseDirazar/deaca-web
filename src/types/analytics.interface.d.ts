import type { BaseEntity } from "./common/base.interface";

export interface Analytics extends BaseEntity {
  ip: string;
  establishmentId: string;
}

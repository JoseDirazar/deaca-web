import type { Establishment } from "../establishment/etablihment.interface";
import type { BaseEntity } from "./base.interface";

export interface Image extends BaseEntity {
    name: string;
    establishment: Establishment;
}

import type { Establishment } from "../establishment/etablihment.interface";
import type { BaseEntity } from "./base.interface";

export interface Image extends BaseEntity {
    fileName: string;
    establishment: Establishment;
}

import type { Establishment } from "../establishment/etablihment.interface";
import type { BaseEntity } from "./baes.interface";

export interface Image extends BaseEntity {
    name: string;
    establishment: Establishment;
}

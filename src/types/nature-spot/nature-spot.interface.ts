import type { Image } from "../common/image.interface";
import type { BaseEntity } from "../common/base.interface";

export interface NatureSpot extends BaseEntity {
  name: string;
  description: string;
  comment: string | null;
  image: string | null;
  latitude: number;
  longitude: number;
  slug: string;
  gallery: Image[];
}

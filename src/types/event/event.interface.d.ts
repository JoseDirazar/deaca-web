import type { BaseEntity } from "../common/base.interface";
import type { Image } from "../common/image.interface";

export interface Event extends BaseEntity {
  name: string;
  description: string;
  start: Date;
  end: Date;
  time: Date;
  latitude: string;
  longitude: string;
  price: number | null;
  active: boolean;
  isSingleTime: boolean;
  image: string | null;
  slug: string;
  gallery: Image[] | null;
}

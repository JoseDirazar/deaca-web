import type { Image } from "../common/image.interface";

export interface NatureSpot {
  name: string;
  description: string;
  comment: string | null;
  image: string | null;
  latitude: number;
  longitude: number;
  slug: string;
  gallery: Image[];
}

export type PharmacyData = {
  dia_semana: string;
  dia_mes: string;
  farmacias: { nombre: string; direccion?: string }[];
};

export type PharmacyDetail = {
  nombre: string;
  direccion?: string;
  telefono?: string;
  lat: number;
  lng: number;
};

export type PharmacyDay = {
  dia_semana: string;
  dia_mes: string;
  farmacias: { nombre: string }[];
};

export type FormattedPharmacies = {
  dia_mes: string;
  farmacias: PharmacyDetail[];
};

export type PharmaciesResponse = {
  farmacias_por_dia: PharmacyDay[];
  detalle_farmacias: PharmacyDetail[];
};

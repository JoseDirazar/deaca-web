export type PharmacyData = {
  dia_semana: string;
  dia_mes: string;
  farmacias: { nombre: string; direccion?: string }[];
};

export type PharmacyDetailData = {
  nombre: string;
  direccion?: string;
  telefono?: string;
};

export type FormattedPharmacies = {
  dia_mes: string;
  farmacias: { nombre: string; direccion: string }[];
};

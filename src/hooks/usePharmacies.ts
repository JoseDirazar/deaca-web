import { useEffect, useState } from "react";
import { pharmacyService } from "@/api/pharmacy-service";
import type { PharmaciesResponse } from "@/component/pharmacy/types";

export function usePharmacies() {
  // TODO: que es esto!
  const [data, setData] = useState<PharmaciesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    pharmacyService
      .getAll()
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        if (mounted) setData(payload as PharmaciesResponse);
      })
      .catch(() => {
        if (mounted) setError("No se pudo cargar los datos de farmacias");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

import { useQuery } from "@tanstack/react-query";
import { getPaymentMethodsService } from "../services/getPaymentMethodsService";

export function usePaymentMethods() {
  const query = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethodsService,
    staleTime: 1000 * 60 * 60,
  });

  const paymentMethods = query.data?.data || [];

  return {
    paymentMethods,
    loading: query.isLoading,
    error: query.error,
  };
}

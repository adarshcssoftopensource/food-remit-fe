import { fetcher } from "@/hooks/useApi";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQuery } from "@tanstack/react-query";
import type { SubAdminData } from "../types/sub-admin.types";

interface GetSubAdminByIdResponse {
  message: string;
  status: boolean;
  data: SubAdminData;
}

export function useGetSubAdminById(id: string) {
  return useQuery<GetSubAdminByIdResponse, Error>({
    queryKey: ["sub-admins", id],
    queryFn: () =>
      fetcher<GetSubAdminByIdResponse>({
        method: "get",
        url: SUB_ADMIN_ENDPOINTS.GET_SUB_ADMIN_BY_ID(id),
      }),
    enabled: !!id,
  });
}

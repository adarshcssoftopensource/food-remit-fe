import { useApiQuery } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useMemo } from "react";
import { normalizeUser } from "../lib/normalize-user";
import type { UserData } from "../types/user.types";

interface RawUserResponse {
  message: string;
  data: Record<string, unknown>;
}

interface GetUserByIdResponse {
  message: string;
  data: UserData;
}

export function useGetUserById(id: string) {
  const url = USER_MANAGEMENT_ENDPOINTS.GET_USER_BY_ID(id);
  const cacheKey = ["user", id];

  const query = useApiQuery<RawUserResponse>(cacheKey, url, {
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const data = useMemo<GetUserByIdResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      data: normalizeUser(api.data),
    };
  }, [query.data]);

  return { ...query, data };
}

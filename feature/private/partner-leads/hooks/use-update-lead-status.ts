import { fetcher } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { successToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStatusMutation, isPending: isUpdatingStatus } = useMutation<
    unknown,
    Error,
    { id: string; status: string; remark: string }
  >({
    mutationFn: ({ id, status, remark }) =>
      fetcher({
        method: "patch",
        url: PARTNER_LEAD_ENDPOINTS.UPDATE_STATUS(id),
        body: { status, remark },
      }),
  });

  const updateLeadStatus = async (id: string, newStatus: string, remark: string) => {
    try {
      await updateStatusMutation({ id, status: newStatus, remark });
      successToast({
        title: "Success",
        description: "Partner lead status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PARTNER_LEADS_LIST });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PARTNER_LEADS_DETAIL(id) });
    } catch {}
  };

  return { updateLeadStatus, isUpdatingStatus };
}

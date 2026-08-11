import { useApiMutation, useApiQuery, fetcher } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/toaster";

export interface PartnerLeadData {
  id: string;
  referenceNumber: string;
  businessName: string;
  businessType: string;
  locationsCount: string;
  businessCity: string | null;
  stateProvince: string | null;
  country: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  businessEmail: string;
  phoneNumber: string;
  workPreferences: string[];
  inventoryManagement: string | null;
  website: string | null;
  additionalInfo: string | null;
  agreeToContact: boolean;
  status: string;
  statusRemark: string | null;
  createdAt: string;
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateStatusMutation, isPending: isUpdatingStatus } = useMutation<
    any,
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
      queryClient.invalidateQueries({ queryKey: ["partner-leads"] });
    } catch (e) {
      errorToast({
        title: "Error",
        description: "Failed to update lead status",
      });
    }
  };

  return { updateLeadStatus, isUpdatingStatus };
}

export function usePartnerLeads(search?: string, sortBy?: string, sortOrder?: string) {
  const { data: response, isLoading } = useApiQuery<{ data: PartnerLeadData[] }>(
    ["partner-leads", search, sortBy, sortOrder].filter(Boolean) as string[],
    PARTNER_LEAD_ENDPOINTS.GET_LEADS(search, sortBy, sortOrder),
  );
  const leads = response?.data;

  const leadsArray = leads || [];
  const stats = {
    total: leadsArray.length,
    new: leadsArray.filter((l) => l.status === "NEW").length,
    contacted: leadsArray.filter((l) => l.status === "CONTACTED").length,
    approved: leadsArray.filter((l) => l.status === "APPROVED").length,
  };

  return {
    leads: leadsArray,
    stats,
    isLoading,
  };
}

export function usePartnerLead(id: string) {
  const { data: response, isLoading } = useApiQuery<{ data: PartnerLeadData }>(
    ["partner-leads", id],
    PARTNER_LEAD_ENDPOINTS.GET_LEAD(id),
    { enabled: !!id },
  );

  return { lead: response?.data, isLoading };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUserStatus, updateAdminUserRole } from "./service";
import { PaginationResponse } from "@/app/(dashboard)/books/service/service";
import { getAdminDashboardSummary, triggerReindex } from './service';
import { AdminUserSummary } from "./type";
import { AdminDashboardSummary } from './type';

export const useAdminUsers = (params?: { page?: number; size?: number; keyword?: string }) => {
  return useQuery<PaginationResponse<AdminUserSummary>>({
    queryKey: ["adminUsers", params],
    queryFn: () => getAdminUsers(params),
  });
};

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAdminUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
};

export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => updateAdminUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
};


export const useAdminDashboardSummary = () => {
    return useQuery<AdminDashboardSummary>({
        queryKey: ['adminDashboardSummary'],
        queryFn: getAdminDashboardSummary,
    });
};

export const useTriggerReindex = () => {
    return useMutation({
        mutationFn: triggerReindex,
    });
};
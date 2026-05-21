import HttpRequest from "@/app/config/auth";
import { PaginationResponse } from "@/app/(dashboard)/books/service/service";
import { AdminUserSummary, AdminDashboardSummary} from "./type";

export const getAdminUsers = async (params?: { page?: number; size?: number; keyword?: string }): Promise<PaginationResponse<AdminUserSummary>> => {
  try {
    const res = await HttpRequest.get("/admin/users", { params });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAdminUserStatus = async (id: number, status: string): Promise<void> => {
  try {
    await HttpRequest.patch(`/admin/users/${id}/status`, { status });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAdminUserRole = async (id: number, role: string): Promise<void> => {
  try {
    await HttpRequest.patch(`/admin/users/${id}/role`, { role });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAdminDashboardSummary = async (): Promise<AdminDashboardSummary> => {
    try {
        const res = await HttpRequest.get("/admin/dashboard/summary");
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const triggerReindex = async (): Promise<void> => {
    try {
        await HttpRequest.post("/comics/reindex");
    } catch (error) {
        console.log(error);
        throw error;
    }
};
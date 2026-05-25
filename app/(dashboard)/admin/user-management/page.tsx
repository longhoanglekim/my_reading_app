"use client";

import { useState } from "react";
import { useAdminUsers, useUpdateAdminUserStatus, useUpdateAdminUserRole } from "./queryHook";
import { useIntl } from "react-intl";
import { AdminUserSummary } from "./type";
import CButton from "@/app/components/common/CButton";
import CInput from "@/app/components/common/CInput";

export default function UserManagementPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const intl = useIntl();

  const { data, isLoading } = useAdminUsers({ page, size: 10, keyword });
  const updateStatusMutation = useUpdateAdminUserStatus();
  const updateRoleMutation = useUpdateAdminUserRole();

  const handleStatusChange = (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  const handleRoleChange = (id: number, currentRole: string) => {
    const nextRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    updateRoleMutation.mutate({ id, role: nextRole });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{intl.formatMessage({ id: "adminUser.title" })}</h1>
        <div className="w-64">
          <CInput
            placeholder={intl.formatMessage({ id: "adminUser.searchPlaceholder" })}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div>{intl.formatMessage({ id: "common.loading" })}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800 text-left">
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.id" })}</th>
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.name" })}</th>
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.email" })}</th>
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.role" })}</th>
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.status" })}</th>
                <th className="p-3">{intl.formatMessage({ id: "adminUser.table.actions" })}</th>
              </tr>
            </thead>
            <tbody>
              {data?.content?.map((user: AdminUserSummary) => (
                <tr key={user.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role === "ADMIN" ? intl.formatMessage({ id: "adminUser.roleAdmin" }) : intl.formatMessage({ id: "adminUser.roleUser" })}</td>
                  <td className="p-3">{user.status === "ACTIVE" ? intl.formatMessage({ id: "adminUser.statusActive" }) : intl.formatMessage({ id: "adminUser.statusBanned" })}</td>
                  <td className="p-3 flex gap-2">
                    <CButton onClick={() => handleRoleChange(user.id, user.role)}>
                      {intl.formatMessage({ id: "adminUser.table.changeRole" })}
                    </CButton>
                    <CButton onClick={() => handleStatusChange(user.id, user.status)}>
                      {user.status === "ACTIVE" ? intl.formatMessage({ id: "adminUser.ban" }) : intl.formatMessage({ id: "adminUser.activate" })}
                    </CButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
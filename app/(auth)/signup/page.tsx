'use client'

import CButton from "@/app/components/common/CButton";
import CForm from "@/app/components/common/CForm";
import CInput from "@/app/components/common/CInput";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";  // ← Import đúng cho App Router

export default function SignupPage() {
    const intl = useIntl();
    const router = useRouter();  // ← Dùng từ next/navigation
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleNavigateToLogin = () => {
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        router.push("/login");  // ← Chuyển sang /login
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-gray-950">
            <CForm
                variant="default"
                title={intl.formatMessage({ id: "auth.title.register" })}
                className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 dark:shadow-gray-950/50"
            >
                {/* Full Name */}
                <CInput
                    variant="outline"
                    label={intl.formatMessage({ id: "auth.title.name" })}
                    type="text"
                    placeholder={intl.formatMessage({ id: "auth.placeholder.name" })}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                />

                {/* Email */}
                <CInput
                    variant="outline"
                    label={intl.formatMessage({ id: "auth.title.email" })}
                    type="email"
                    placeholder={intl.formatMessage({ id: "auth.placeholder.email" })}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />

                {/* Password */}
                <CInput
                    variant="outline"
                    label={intl.formatMessage({ id: "auth.title.password" })}
                    type="password"
                    placeholder={intl.formatMessage({ id: "auth.placeholder.password" })}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />

                {/* Confirm Password */}
                <CInput
                    variant="outline"
                    label={intl.formatMessage({ id: "auth.title.confirmPassword" })}
                    type="password"
                    placeholder={intl.formatMessage({ id: "auth.placeholder.confirmPassword" })}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                />

                {/* Terms checkbox */}
                <div className="flex items-start text-sm">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-blue-500 mt-0.5"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                            {intl.formatMessage({ id: "auth.checkbox.agreeTerms" })}{" "}
                            <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                            >
                                {intl.formatMessage({ id: "auth.link.terms" })}
                            </a>
                        </span>
                    </label>
                </div>

                {/* Sign Up button */}
                <CButton
                    variant="primary"
                    className="w-full font-medium"
                >
                    {intl.formatMessage({ id: "auth.button.register" })}
                </CButton>

                {/* Login link */}
                <div className="flex justify-center items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <span>{intl.formatMessage({ id: "auth.link.hasAccount.true" })}</span>

                    {/* Cách dùng CButton + onClick với router.push */}
                    <CButton
                        variant="ghost"
                        className="p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={handleNavigateToLogin}  // ← Gọi hàm có router.push
                    >
                        {intl.formatMessage({ id: "auth.title.login" })}
                    </CButton>

                </div>

                {/* Divider */}
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            {intl.formatMessage({ id: "auth.title.or" })}
                        </span>
                    </div>
                </div>

                {/* Google Signup */}
                <CButton
                    variant="outline"
                    className="w-full justify-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    <FcGoogle className="h-5 w-5" />
                    {intl.formatMessage({ id: "auth.button.registerWithGoogle" })}
                </CButton>
            </CForm>
        </div>
    );
}
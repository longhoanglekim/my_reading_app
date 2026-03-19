'use client'

import CButton from "@/app/components/common/CButton";
import CForm from "@/app/components/common/CForm";
import CInput from "@/app/components/common/CInput";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
    const intl = useIntl();
    const router = useRouter();  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleNavigateToSignup = () => {
        setEmail("");
        setPassword("");
        router.push("/signup"); 
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12 dark:bg-gray-950">
            <CForm
                variant="default"
                title={intl.formatMessage({ id: "auth.title.login" })}
                className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-900 dark:shadow-gray-950/50"
            >
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
                    autoComplete="current-password"
                />

            
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                            {intl.formatMessage({ id: "auth.title.rememberLogin" })}
                        </span>
                    </label>

                    <CButton
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {intl.formatMessage({ id: "auth.title.forgotPassword" })}
                    </CButton>
                </div>

                {/* Login button */}
                <CButton
                    variant="primary"
                    className="w-full font-medium"
                    onClick={() => {
                        console.log("Login thôi");
                    }}
                >
                    {intl.formatMessage({ id: "auth.button.login" })}
                </CButton>

                {/* Register link */}
                <div className="flex justify-center items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                    <span>{intl.formatMessage({ id: "auth.link.hasAccount.false" })}</span>

                    {/* Cách 1: Dùng CButton + onClick với router.push */}
                    <CButton
                        variant="ghost"
                        className="p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={handleNavigateToSignup}  // ← Gọi hàm đã có router.push
                    >
                        {intl.formatMessage({ id: "auth.title.register" })}
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

                {/* Google Login */}
                <CButton
                    variant="outline"
                    className="w-full justify-center gap-3 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                    <FcGoogle className="h-5 w-5" />
                    {intl.formatMessage({ id: "auth.button.loginWithGoogle" })}
                </CButton>
            </CForm>
        </div>
    );
}
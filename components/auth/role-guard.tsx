"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { selectAuth, type TAuthRole } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";

const dashboardByRole: Record<string, string> = {
    admin: "/admin",
    child: "/child",
    parent: "/parent",
};

export default function RoleGuard({
    allowedRole,
    children,
}: {
    allowedRole: Exclude<TAuthRole, null>;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { token, role } = useAppSelector(selectAuth);
    const isAuthorized = Boolean(token) && role === allowedRole;

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        if (role !== allowedRole) {
            router.replace(dashboardByRole[role ?? ""] ?? "/login");
        }
    }, [allowedRole, role, router, token]);

    if (!isAuthorized) {
        return null;
    }

    return children;
}
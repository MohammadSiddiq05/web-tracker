"use client";
import AppHeader from "@/app/_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        if (isSignedIn && user) {
            axios.post("/api/user").catch(console.error);
        }
    }, [isSignedIn, user]);

    return (
        <div>
            <AppHeader />
            {children}
        </div>
    );
};

export default DashboardLayout;
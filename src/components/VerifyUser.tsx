"use client";
import useAuthStore from "@/app/store/user.state";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Verify = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const currentPath = usePathname(); 
  const { setUser } = useAuthStore()
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (
          currentPath === "/register" ||
          currentPath.startsWith("/login")) {
          setLoading(false);
          return;
        }
        const res = await api.get(`/users/verify-token`, {
          headers : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("token") || "",
          }
        });
        const responseData = res.data;
        setLoading(false);

        if (res.status < 210) {          
          setUser(responseData)
          if (!currentPath.includes("/dashboard")) {
            router.push("/dashboard"); 
          }
          return;
        }
        router.push("/login");
      } catch (error) {
        setLoading(false);
        console.error("Token verification failed:", error);
        router.push("/login");
      }
    };

    verifyToken();
  }, [currentPath]);

  if (loading) {
    return (
      <div className="fixed z-50 top-0 left-0 w-full">
        <div className="auth-loader"></div>
      </div>
    );
  }

  return null;
};

export default Verify;

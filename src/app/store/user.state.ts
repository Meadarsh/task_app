import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
    _id: string;
    role: string;
    email: string;
    name: string;
    status: string;
    profilePicture: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }), 
    logout: () => {
        Cookies.remove("token");
        set({ user: null });
    },
}));

export default useAuthStore;
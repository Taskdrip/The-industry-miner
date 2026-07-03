import { useGetCurrentAuthUser } from "@workspace/api-client-react";

export function useAuth() {
  const { data, isLoading } = useGetCurrentAuthUser({
    query: {
      queryKey: ["auth-user"],
      staleTime: 60_000,
      retry: false,
    },
  });

  const user = data?.user ?? null;

  return {
    user,
    isLoading,
    isAuthenticated: user != null,
    isAdmin: user?.role === "admin",
    loginUrl: "/api/login",
    logoutUrl: "/api/logout",
  };
}

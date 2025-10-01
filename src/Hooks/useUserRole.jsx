import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, roleLoading: authLoading } = useAuth(); 
// console.log(user.email);
  const { data: role = "user", isLoading: roleLoading, refetch } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data.role;
    },
    enabled: !!user?.email && !authLoading,
  });

  return {role,roleLoading:authLoading || roleLoading , refetch}
};

export default useUserRole;

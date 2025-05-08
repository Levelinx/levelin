import { useQuery } from "@tanstack/react-query";
import { getTest } from "./api";

export const useGetTest = () => {
  return useQuery({ queryKey: ["test"], queryFn: getTest });
};

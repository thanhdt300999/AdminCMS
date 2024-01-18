// docs https://jmango360.atlassian.net/wiki/spaces/B2B/pages/2795077633/APIs+Login+flow#Login-API
import { useMutation } from '@tanstack/react-query'
import {AxiosInstance} from "./useGetUser";

const fetcher = async (params) => {
  const rs = await AxiosInstance.delete(`/api/admin?userId=${params?.userId}`)
  return rs.data
}

const useDeleteUser = () => {
  const fn = useMutation({
    mutationFn: fetcher,
    retry: false,
  })
  return { ...fn }
}

export { useDeleteUser }

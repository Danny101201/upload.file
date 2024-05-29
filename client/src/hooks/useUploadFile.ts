import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { API } from "../utils/api";
import { RcFile } from "antd/es/upload";
import { ZodError, z } from "zod";

const STATUSES = {
  success: 200,
} as const
const responseEnum = z.nativeEnum(STATUSES)
const postResetPasswordBatchByFileResponse = z.object({
  status: z.string(),
  result: z.object({
    "$metadata": z.object({
      httpStatusCode: responseEnum,
      requestId: z.string(),
      extendedRequestId: z.string(),
      totalRetryDelay: z.number().int(),
      attempts: z.number().int(),
    })
  })
})
type PostResetPasswordBatchByFileResponse = z.infer<
  typeof postResetPasswordBatchByFileResponse
>;
export const postResetPasswordBatchByFile = async (file: RcFile) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const { data } = await API.post<PostResetPasswordBatchByFileResponse>('/signal', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return postResetPasswordBatchByFileResponse.parseAsync(data)
}
export const useUploadFile = (option: UseMutationOptions<PostResetPasswordBatchByFileResponse, ZodError, RcFile>) => useMutation({
  mutationKey: ['useUploadFile'],
  mutationFn: postResetPasswordBatchByFile,
  ...option
})
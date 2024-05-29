import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { postResetPasswordBatchByFile } from '../hooks/useUploadFile'
import { RcFile } from 'antd/es/upload'
import { message } from 'antd'
import { ZodError } from 'zod'

export const UploadImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = useMutation({
    mutationFn: postResetPasswordBatchByFile,
    onSuccess: (data) => {
      messageApi.open({
        type: 'success',
        content: data.status,
      })
    },
    onError: (error) => {
      console.log(error)
      if (error instanceof ZodError) {
        const { code, message, path } = error.issues[0]
        messageApi.open({
          type: 'error',
          content: `${code}, ${path},${message}`,
        })
      }
    }
  })
  const [previewImage, setPreviewImage] = useState<string>('')
  const [file, setFile] = useState<File>()
  const upload = (file?: File) => {
    if (!file) return
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      if (!fileReader.result) return
      setPreviewImage(fileReader.result.toString())
      setFile(file)
    }

  }
  const handleSubmit = () => {
    mutate(file as RcFile)
  }
  return (
    <div>
      {contextHolder}
      {previewImage && (
        <>
          < img src={previewImage} width={100} height={100} />
          <button onClick={() => setPreviewImage('')}>clear</button>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={e => {

          upload(e.target.files?.[0])
        }}
      />
      <div>
        <button onClick={handleSubmit}>upload</button>
      </div>
    </div>
  )
}



import './App.css'
import { Button, message } from 'antd'
import { UploadModal } from './components/UploadModal'
import NiceModal from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { API } from './utils/api';
import { RcFile } from 'antd/es/upload';
import { useUploadFile } from './hooks/useUploadFile';
import { ZodError } from 'zod';

const downloadTemplateUrl = new URL(
  '/platform-bo-service/api/v1.0/member/housePlayer/resetPassword/batchByFile/downloadTemplate',
  import.meta.env.VITE_API_DOMAIN,
).href
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const { mutateAsync: uploadFile } = useUploadFile({
    onSuccess: (data) => {
      messageApi.open({
        type: 'success',
        content: data.status,
      });
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        const { code, message, path } = error.issues[0]
        messageApi.open({
          type: 'error',
          content: `${code}, ${path},${message}`,
        });
      }
    }
  })
  const onSubmit = async (file: RcFile) => {
    await uploadFile(file)
  }
  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={() => {
        NiceModal.show(UploadModal, { downloadTemplateUrl, onSubmit })
      }}>+ reset member password</Button>
    </>
  )
}

export default App

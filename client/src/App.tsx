
import './App.css'
import { Button } from 'antd'
import { UploadModal } from './components/UploadModal'
import NiceModal from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { API } from './utils/api';
import { RcFile } from 'antd/es/upload';

const downloadTemplateUrl = new URL(
  '/platform-bo-service/api/v1.0/member/housePlayer/resetPassword/batchByFile/downloadTemplate',
  import.meta.env.VITE_API_DOMAIN,
).href
function App() {
  const onSubmit = async (file: RcFile) => {
    console.log(file)
  }
  return (
    <>
      <Button type="primary" onClick={() => {
        console.log(132)
        NiceModal.show(UploadModal, { downloadTemplateUrl, onSubmit })
      }}>+ reset member password</Button>
    </>
  )
}

export default App

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import NiceModal, { antdModalV5, useModal } from '@ebay/nice-modal-react';
import { Button, Modal, Upload, UploadFile, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useState } from 'react'

const MAX_FILE_SIZE = 5
interface UploadModalProps {
  downloadTemplateUrl: string
  onSubmit: (file: RcFile) => Promise<void>
}

export const UploadModal = NiceModal.create(({ downloadTemplateUrl, onSubmit }: UploadModalProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const modal = useModal();
  const handleUpload = async () => {
    try {
      setLoading(true)
      await onSubmit(fileList[0] as RcFile)
      modal.hide()
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Modal
        {...antdModalV5(modal)}
        onOk={handleUpload}
        title="Batch Reset Password"
        okText='upload'
        cancelText='cancel'
        okButtonProps={{
          disabled: fileList.length === 0 || loading,
          loading
        }}
      >
        <div>
          <span>1. Download the template.</span>
          <Button
            download
            data-testid="actionDownloadTemplate"
            href={downloadTemplateUrl}
            icon={<DownloadOutlined style={{ color: 'green' }} />}
            rel="noreferrer"
            target="_blank"
            color='red'
            type="link"
          />

        </div>
        <div>
          3. Max 100 records, Duplicate records will be ignored and process one time only.
        </div>
        <div>
          2. Save the file as a .xlsx format and upload (max 5 MB.)
        </div>
        <Upload
          accept='.xlsx'
          beforeUpload={file => {
            if (file.size > MAX_FILE_SIZE * 1000 ** 2) {
              message.error(`File size is more than ${MAX_FILE_SIZE} MB.`);
              return
            }
            setFileList([file])
          }}
          fileList={fileList}
          onRemove={() => {
            setFileList([])
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>

      {/* ✅ Work as expect when put here */}
      {/* {contextHolder} */}
    </div>
  );
})

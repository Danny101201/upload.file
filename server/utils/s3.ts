import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { uuid } from "uuidv4"

const s3CLient = new S3Client()
export const uploadFile = async (file: Express.Multer.File | undefined) => {
  if (!file) return
  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `upload/${uuid()}-${file?.originalname}`,
    Body: file.buffer
  })
  try {
    const result = await s3CLient.send(putCommand)
    return result
  } catch (e) {
    console.log(e)
  }
}

export const uploadFiles = async (files: Express.Multer.File[] | undefined) => {
  try {
    if (!files) return
    const putCommands = files.map(file => new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `upload/${uuid()}-${file?.originalname}`,
      Body: file.buffer
    }))
    console.log(putCommands)
    const result = await Promise.all(putCommands.map(command => s3CLient.send(command)))
    return result
  } catch (e) {
    console.log(e)
  }
}

export const getFile = async (Key: string) => {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key
    })
    const result = await s3CLient.send(getCommand)
    const data = await result.Body?.transformToByteArray()
    return data
  } catch (e) {
    console.log(e)
  }
}
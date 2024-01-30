import express from 'express';
import { getS3File, uploadS3File, uploadS3Files } from './utils/s3';
import multer, { MulterError } from 'multer'
import cors from 'cors'
// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config({})


const storage = multer.memoryStorage()
const upload = multer({
  dest: 'uploads',
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(xlsx|png)$/)) {
      // You can always pass an error if something goes wrong:
      return cb(new MulterError('LIMIT_UNEXPECTED_FILE'))
    }
    // // To accept the file pass `true`, like so:
    cb(null, true)
  },
  limits: { fileSize: 10000000, files: 2 },
  storage
})
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  return res.json('file upload api')
})
app.post('/signal', upload.single('avatar'), async (req, res) => {
  try {
    const result = await uploadS3File(req.file)
    return res.json({ status: 'success upload file', result })
  } catch (e) {
    console.log(e)
  }
})
app.post('/multer', upload.array('photos', 4), async (req, res) => {
  try {

    const uploadResults = await uploadS3Files(req.files as Express.Multer.File[])
    return res.json({ status: 'success upload files', result: uploadResults })
  } catch (e) {
    console.log(123)
  }
})
app.post('/fields', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'photos', maxCount: 4 }]), (req, res) => {
  return res.json({ status: 'success upload files', file: req.files })
})
app.post('/file', async (req, res) => {
  const { id } = req.body
  const data = await getS3File(id)
  const blob = new Blob([data], { type: 'application/octet-stream' });
  return res.json({ status: 'success get object', blob })
})

app.listen(process.env.PORT, () => {
  console.log('server run on port : ' + process.env.PORT)
})
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'file is to large'
      })
    }
    if (err.code === 'LIMIT_FIELD_COUNT') {
      return res.status(400).json({
        message: 'limit field count'
      })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'file must be xlsx'
      })
    }
  }
})
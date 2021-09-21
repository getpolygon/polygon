import { Client } from "minio";

const {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL,
} = process.env;

export const config = {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL,
};

export const client = new Client({
  endPoint: MINIO_ENDPOINT!!,
  port: parseInt(MINIO_PORT!!),
  accessKey: MINIO_ACCKEY!!,
  secretKey: MINIO_SECKEY!!,
  useSSL: JSON.parse(MINIO_USESSL!!),
});

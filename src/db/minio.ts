const {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL,
} = process.env;
const config = {
  MINIO_ENDPOINT,
  MINIO_BUCKET,
  MINIO_PORT,
  MINIO_ACCKEY,
  MINIO_SECKEY,
  MINIO_USESSL,
};
const minio = require("minio");
const client = new minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT!!),
  accessKey: MINIO_ACCKEY,
  secretKey: MINIO_SECKEY,
  useSSL: JSON.parse(MINIO_USESSL!!),
});

export default {
  client,
  config,
};

module.exports = {
  client,
  config,
};

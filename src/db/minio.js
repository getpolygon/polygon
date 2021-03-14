require("dotenv").config();
const minio = require("minio");
const {
	MINIO_ENDPOINT,
	MINIO_BUCKET,
	MINIO_PORT,
	MINIO_ACCKEY,
	MINIO_SECKEY,
	MINIO_USESSL
} = process.env;

const MinIOClient = new minio.Client({
	endPoint: MINIO_ENDPOINT,
	port: parseInt(MINIO_PORT),
	accessKey: MINIO_ACCKEY,
	secretKey: MINIO_SECKEY,
	useSSL: JSON.parse(MINIO_USESSL)
});

const policy = {
	Version: "2012-10-17",
	Statement: [
		{
			Action: ["s3:GetBucketLocation", "s3:ListBucket"],
			Effect: "Allow",
			Principal: {
				AWS: ["*"]
			},
			Resource: ["arn:aws:s3:::local"],
			Sid: ""
		},
		{
			Action: ["s3:GetObject"],
			Effect: "Allow",
			Principal: {
				AWS: ["*"]
			},
			Resource: ["arn:aws:s3:::local/*"],
			Sid: ""
		}
	]
};

module.exports = {
	policy: policy,
	client: MinIOClient,
	bucket: MINIO_BUCKET
};

import {
	S3Client,
	PutObjectCommand,
	ListObjectsV2Command,
	GetObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_KEY as string
	},
	region: 'ap-northeast-2'
});

export const S3Upload = async (file: Blob, uploadKey: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: 'users/' + uploadKey,
		Body: file
	};

	const command = new PutObjectCommand(params);
	await s3.send(command);
};

export const S3GetObject = async (downloadKey: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: downloadKey
	};

	const command = new GetObjectCommand(params);
	return await s3.send(command);
};

export const S3ListObject = async () => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
	};

	const command = new ListObjectsV2Command(params);
	const s3Data = await s3.send(command);
	return s3Data.Contents?.filter((content) => {
		return content.Key?.includes('.txt');
	});
};

export const S3DeleteObject = async (name: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: name
	};

	const command = new DeleteObjectCommand(params);
	const s3Data = await s3.send(command);
	console.log(s3Data);
};

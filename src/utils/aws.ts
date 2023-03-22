import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';

AWS.config.update({
	accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY as string,
	secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_KEY as string,
	region: 'ap-northeast-2'
});
const S3 = new AWS.S3();
const Bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string;

const s3Client = new S3Client({
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_KEY as string
	},
	region: 'ap-northeast-2'
});

export const S3DeleteObject = async (key: string) => {
	const params = {
		Bucket,
		Key: key
	};
	await S3.deleteObject(params, (err) => {
		if (err) console.log(err, err.stack);
		else alert('삭제했어요!');
	});
};

export const S3PutObject = async (file: Blob, uploadKey: string, contentType: string) => {
	const params = {
		Bucket,
		Key: 'users/' + uploadKey,
		Body: file,
		ContentType: contentType
	};

	await S3.putObject(params, (err) => {
		if (err) console.log(err, err.stack);
	});
};

export const S3ListObject = async (uuid: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Prefix: `users/${uuid}/`
	};

	const command = new ListObjectsV2Command(params);
	const s3Data = await s3Client.send(command);
	const textFile = s3Data.Contents?.filter((content) => content.Key?.includes('.txt'));
	const imageFile = s3Data.Contents?.filter((content) => content.Key?.includes('.png'));
	const folders = s3Data.Contents?.filter((content) => content.Key?.includes('.json'));

	return { folders, textFile, imageFile };
};

export const S3GetObject = async (downloadKey: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: downloadKey
	};

	const command = new GetObjectCommand(params);
	return await s3Client.send(command);
};

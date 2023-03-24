import { S3Client, ListObjectsV2Command, GetObjectCommand, _Object } from '@aws-sdk/client-s3';
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

export const S3DeleteObject = async (key: { Key: string }[]) => {
	const params = {
		Bucket,
		Delete: {
			Objects: key
		}
	};
	await S3.deleteObjects(params, (err) => {
		if (err) console.log(err, err.stack);
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
	let textFile: _Object[] = [];
	let imageFile: _Object[] = [];
	let folders: _Object[] = [];
	let background;
	s3Data.Contents?.forEach((content) => {
		if (content.Key?.includes('.txt')) {
			textFile.push(content);
		} else if (content.Key?.includes('.png') && !content.Key?.includes('mls_background')) {
			imageFile.push(content);
		} else if (content.Key?.includes('.json')) {
			folders.push(content);
		} else if (content.Key?.includes('mls_background')) {
			background = content;
		}
	});

	return { folders, textFile, imageFile, background };
};

export const S3GetObject = async (downloadKey: string) => {
	const params = {
		Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
		Key: downloadKey
	};

	const command = new GetObjectCommand(params);
	return await s3Client.send(command);
};

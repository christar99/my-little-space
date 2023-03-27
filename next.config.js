/** @type {import('next').NextConfig} */

const path = require('path');

module.exports = {
	reactStrictMode: false,
	env: {
		BASE_URL: process.env.BASE_URL
	},
	swcMinify: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')]
	},
	compiler: {
		styledComponents: true
	},
	images: {
		domains: ['mylittlespace-s3.s3.ap-northeast-2.amazonaws.com'],
		formats: ['image/avif', 'image/webp']
	}
};

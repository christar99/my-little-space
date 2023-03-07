/** @type {import('next').NextConfig} */

const path = require("path");

module.exports = {
    reactStrictMode: false,
    swcMinify: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    },
    compiler: {
        styledComponents: true
    }
};

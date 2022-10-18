const withImages = require("next-images");

module.exports = withImages({
	images: {
		disableStaticImages: true,
		domains: ["localhost", "lh3.googleusercontent.com"],
	},
});

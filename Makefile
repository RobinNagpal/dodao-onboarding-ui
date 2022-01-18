invalidate_cloudfront_cache:
	aws cloudfront create-invalidation --distribution-id ELC5P9YAVVXA6 --paths "/*"

invalidate_cloudfront_cache:
	aws cloudfront create-invalidation --distribution-id ELC5P9YAVVXA6 --paths "/*"
	aws cloudfront create-invalidation --distribution-id ECT0QC99SNJ0W --paths "/*"
	aws cloudfront create-invalidation --distribution-id EFTZE8QBWO66L --paths "/*"

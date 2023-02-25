### PRODUCT-SERVICE:

#### Lambda functions:
- getProductsList
- getProductsById

### LINKS:
- [Swagger](https://27ryd2a6z9.execute-api.us-east-1.amazonaws.com/swagger) try API
- [S3 Bucket link](http://lis-store-app-react.s3-website-us-east-1.amazonaws.com/) 403 Forbidden
- [CloudFront link](https://d1areo6ly74sdt.cloudfront.net/) website
- [FrontEnd Git Repo](https://github.com/Lisinchyk/shop-react-redux-cloudfront/pull/2) PR Task3
- [getProductsList](https://z93dh321nh.execute-api.us-east-1.amazonaws.com/dev/products) GET Products
- [getProductsById](https://z93dh321nh.execute-api.us-east-1.amazonaws.com/dev/products/{productId}) Get Product by ID

### Available Scripts:
### `deploy:dev`

Deploy service to the dev AWS environment and create Swagger

### `deploy:prod`

Deploy service to the prod AWS environment and create Swagger

### `sls:invoke`

Verify lambda function locally

### `remove:dev-stack`

Delete stack on the dev env

### `remove:prod-stac`

Delete stack on the prod env

### `swagger`

Run swagger plugin and create the API documentation

### `test`

Run unit jest tests

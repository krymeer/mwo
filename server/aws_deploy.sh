# requires the AWS CLI configured with an access key with cloudformation permissions
set -e
# package the stack
aws cloudformation package \
    --template-file api.yaml \
    --output-template-file aws-out.yaml \
     --s3-bucket todo.mwo.app

# deploy
aws cloudformation deploy \
    --template-file aws-out.yaml \
    --stack-name mwo-todo \
    --capabilities CAPABILITY_IAM

# cleanup
rm aws-out.yaml
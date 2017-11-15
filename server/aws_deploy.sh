# requires the AWS CLI configured with an access key with cloudformation permissions
set -e
# package the stack
echo "> packaging the stack"
aws cloudformation package \
    --template-file api.yaml \
    --output-template-file aws-out.yaml \
     --s3-bucket todo.mwo.app

# deploy
echo "> deploying..."
aws cloudformation deploy \
    --template-file aws-out.yaml \
    --stack-name mwo-todo \
    --capabilities CAPABILITY_NAMED_IAM

# cleanup
rm aws-out.yaml
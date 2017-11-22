# requires the AWS CLI configured with an access key with cloudformation permissions
param($stackName)
# package the stack
echo "> packaging the stack"
aws cloudformation package `
    --template-file $PSScriptRoot/stack.yaml `
    --output-template-file $PSScriptRoot/aws-out.yaml `
     --s3-bucket todo.mwo.app

# deploy
echo "> deploying..."
aws cloudformation deploy `
    --template-file $PSScriptRoot/aws-out.yaml `
    --stack-name $stackName `
    --capabilities CAPABILITY_NAMED_IAM

# cleanup
rm $PSScriptRoot/aws-out.yaml
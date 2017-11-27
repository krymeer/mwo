# requires the AWS CLI configured with an access key with cloudformation permissions
param($stackName)
# package the stack
echo "> packaging the stack"
aws cloudformation package `
    --template-file $PSScriptRoot/stack.yaml `
    --output-template-file $PSScriptRoot/aws-out.yaml `
     --s3-bucket todo.mwo.app

# deploy
echo "> deploying"
aws cloudformation deploy `
    --template-file $PSScriptRoot/aws-out.yaml `
    --stack-name $stackName `
    --capabilities CAPABILITY_NAMED_IAM

# cleanup
if ($?) {
    rm $PSScriptRoot/aws-out.yaml
    echo ">updating api log settings"
    $API_ID = aws apigateway get-rest-apis --query '(items[?name==`TodoApi`].id)[0]' --output=text
    aws apigateway delete-stage --rest-api-id $API_ID --stage-name 'Stage'
    aws apigateway update-stage `
        --rest-api-id $API_ID `
        --stage-name 'v1' `
        --patch-operations `
            op=replace,path=/*/*/logging/dataTrace,value=true `
            op=replace,path=/*/*/logging/loglevel,value=INFO `
        --output text

}
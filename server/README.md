# Elementy
* [`Lambda`](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions) - "mikroserwery" wykonujące raczej niewielkie fragmenty kodu w opdpowiedzi na zdarzenia, np.:
    * requesty z API
    * aktywność na bazie
    * itd.
* [`DynamoDB`](https://eu-central-1.console.aws.amazon.com/dynamodb/home?region=eu-central-1#) - baza noSQL, przechowująca dane w formacie klucz - wartość. Bez-schemowa, tzn. można umieścić dowolny element, który zawiera pola określone jako klucz główny
* [`Api Gateway`](https://eu-central-1.console.aws.amazon.com/apigateway/home?region=eu-central-1#) - restowe API działające jako proxy dla innych elementów. Odbiera żądania HTTP i tłumaczy je na 'eventy', które przekazuje do Lambdy określonej dla danego endpointa.
* [`Cognito`](https://eu-central-1.console.aws.amazon.com/cognito/users/?region=eu-central-1#/) - dostarcza autentykację i autoryzację użytkowników, tzn. dostarcza mechanizmy:
    * rejestracji
    * potwierdzenia rejestracji (mail/telefon)
    * logowania
    * uwierzytelniania (bez sesji - token JWT)
* `CloudFormation` - pozwala na zarządzanie całym stackiem w jednym miejscu, na podstawie konfiguracji YAML/JSON (`/server/api.yaml`). CloudFormation na podstawie tego pliku tworzy/usuwa/aktualizuje wszystkie zdefiniowane elementy i odpowiednio je konfiguruje.
* `CloudWatch` - głównie przechwytuje logi z lambd. Pozwala też monitorować stan zasobów (liczbę requestów do API, procent błędów, obciążenie baz danych, itd.)
Efekt: 2 komendy pakują wszystkie pliki źródłowe, tworzą wszystkie zasoby (uprawnienia, lambdy, tabele w dynamo, konfigurują api) i uruchamiają je.
* `IAM` (_Identity and Access Management_) - zarządzanie użytkownikami AWS (tzn. nie użytkownikami aplikacji). 

# Dostęp
* konsola AWS: pozwala na zarządzanie usługami z przeglądarki: https://mwo-todo.signin.aws.amazon.com/console
* `AWS CLI` - to samo, ale z linii komend. Wymaga wygenerowania `access keya` przez `IAM`, i podania go do `aws configure`. Wymagany do odpalenia `/server/aws_deploy.sh`

# Deploy
Wgranie lokalnych zmian: `/server/aws_deploy.sh`
UWAGA: jeśli na zasobach zdeiniowanych w konfiguracji były wprowadzane jakiekolwiek zmiany z poziomu konsoli, prawdopodobnie zostaną nadpisane!
## Zmiana kodu - Lambda
Żeby zaktualizować kod istniejącej Lambdy mamy 2 możliwości:
* Lokalna modyfikacja kodu + deploy:
    1.  Zmieniamy kod jak chcemy
    2.  Odpalamy ./server/aws_deploy.sh
    3.  Czekamy na wiadomość "Successfully created/updated stack - mwo-todo"
    4.  Jeśli dostaliśmy - OK, stack został stworzony i urtuchomiony, można korzystać
    5.  W przeciwnym wypadku:
        * Jesli dostajemy info o konkretnym błedzie - poprawiamy. Najczęściej jednak nie ma takiej informacji.
        * Wchodzimy na [`CloudFormation`](https://eu-central-1.console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks?stackId=arn:aws:cloudformation:eu-central-1:874845083551:stack%2Fmwo-todo%2Ffcabbec0-c975-11e7-a56e-503f2ad2e5fe&filter=active)
        * Wybieramy stack mwo-todo
        * Szukamy w eventach co się posypało
        * Naprawiamy :)
* Modyfikacja kodu z poziomu konsoli AWS
    1. Wchodzimy na dashboard [`Lambda`](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)
    2. Z `Functions` wybieramy interesującą nas lambdę
    3. Modyfikujemy kod
    4. "Save and test"
    5. Gotowe

## Nowa Lambda - lokalnie
Żeby dodać nową Lambdę (np. obsługa nowego endpointu), należy:
* Napisać kod obslugujący ją
* Dodać do konfiguracji dla `CloudFormation`

### Kod
Język - do wyboru
* C#
* Java 8
* Javascript (Node.js 4.3, 6.10)
* Python (2.7, 3.6)
*WAŻNE*: Porgramming Model dla AWS Lambda (interfejsy, co jest przekazywane, itd): https://docs.aws.amazon.com/lambda/latest/dg/programming-model-v2.html
### Konfiguracja
Należy dodać 2 elementy: samą Lambdę oraz pozwolenie dla Api Gateway na jej wywołanie:
* Lambda:
  ```yaml
  <Element><Method>Handler: # identyfikator, np. TodoPostHandler
    Type: AWS::Serverless::Function
    Properties:
      Handler: <nazwa_modułu>.<metoda> # wg programmiing model
      FunctionName: <Element><Method>Handler # nazwa funckcji - j.w.
      Runtime: <runtime>
      Events: # co uruchamia tę Lambdę
        <identyfikator_wydarzenia>:
          Type: Api
          Properties:
            Path: <ścieżka w Api>
            Method: <method>
            RestApiId: !Ref TodoApi
      Tags:
        Application: mwo-todo
      Role: !GetAtt TodoHandlerRole.Arn
  ```
* Permission:
  ```yaml
  <Method><Element<LambdaPermission:
    Type: AWS::Lambda::Permission
    Properties:
      FunctionName: !GetAtt [<ID>, Arn] # ID = identyikator nowej Lambdy
      Action: lambda:InvokeFunction
      Principal: apigateway.amazonaws.com
      SourceArn:
        Fn::Join:
          - ""
          - - "arn:aws:execute-api:"
            - Ref: AWS::Region
            - ":"
            - Ref: AWS::AccountId
            - ":"
            - Ref: TodoApi
            - "/*/*/*"
  ```

## Zmiany API
Api jest generowane wg specyfikacji [Swagger/OpenAPI](https://swagger.io/specification/).
Dodatkowo są dostępne rozszerzenia AWS: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions.html
Na chwilę obecną jest ona w `/server/api.yaml: Resources > TodoApi > DefinitionBody`, jak się rozrośnie to mozna przenieśc do zewnętrznego pliku.
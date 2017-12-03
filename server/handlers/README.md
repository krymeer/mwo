# Komunikacja z TodoApi
Tworzenie zapytań do pobierania danych z _back-endu_ ToDoApp nie jest skomplikowaną czynnością; należy jednak pamiętać o zachowaniu odpowiedniej składni.

## Must-have
Niezbędna jest znajomość dwóch parametrów:
```javascript 
const apiURL  = 'https://xjtxrfc6a1.execute-api.eu-central-1.amazonaws.com/v1/todo';
var token = '...';
```
tj. tokena i adresu URL, pod którym można wykonać dane żądanie. Adres dla `DELETE` i `PUT` powinien być rozszerzony o `/{noteID}`, gdzie `{noteID}` jest identyfikatorem notatki (8-znakowym ciągiem alfanumerycznym).

Wspomniany token powinien być umieszczony jako wartość dodatkowego nagłówka ‒ `Authorization`.

## GET
Pobieranie listy notatek przypisanych do danego użytkownika. Żądanie nie wymaga podania dodatkowych parametrów.
### jQuery
```javascript
$.ajax({
  type: 'GET',
  url: apiURL,
  headers: { Authorization: token }
})
```

## POST
Niezbędny jest argument ``dataAsJSON``, którego wartość to treść notatki, którą chcemy dodać.
### jQuery
```javascript
$.ajax({
  type: 'POST',
  url: apiURL,
  data: dataAsJSON,
  headers: { Authorization: token }
})
```
Jak mówi sama nazwa, `dataAsJSON` powinien być typowym JSON-owym stringiem, np. `{ "Content": "Lorem ipsum dolor sit amet" }`. Jeżeli wysyłane dane będą innego typu ‒ np. tablicowego ‒ API zwróci komunikat o błędzie.
Przydatna w tym miejscu może okazać się funkcja `JSON.stringify()`, która zwraca dane w postaci akceptowanej przez TodoApi.

## PUT
Jeśli chcemy zmodyfikować pewną notatkę, to powinniśmy w adresie URL umieścić jej identyfikator w bazie danych, a także dostarczyć jako parametr w zapytaniu nową treść do wstawienia.
### jQuery
```javascript
$.ajax({
  type: 'PUT',
  url: apiURL + '/{noteID}',
  data: dataAsJSON,
  headers: { Authorization: token }
})
```
gdzie `{noteID}` jest identyfikatorem notatki, natomiast `dataAsJSON` ‒ jej nową treścią.

## DELETE
Do usunięcia wybranej notatki wystarczy „doklejenie” jej identyfikatora w bazie danych do `apiURL` :
### jQuery
```javascript
$.ajax({
  type: 'DELETE',
  url: apiURL + '/{noteID}',
  headers: { Authorization: token }
})
```
Podobnie jak wcześniej, `{noteID}` jest identyfikatorem notatki.
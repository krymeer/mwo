function getPageContents() {
  return document.body.innerHTML;
}

function showSection(sectionName) {
  $('.contents').addClass('hidden');
  $('#' + sectionName).removeClass('hidden');
}

function showMessageSection(k, l) {
  var msg_title     = ['To nie jest dobra strona.', 'Wystąpił nieznany błąd', 'Jesteś już blisko!', 'Zmień semestr', 'Odmowa dostępu', 'Udało się', 'Połączenie nieudane'];
  var msg_contents  = [
    'Wejdź na <a href="https://edukacja.pwr.wroc.pl" target="blank">stronę Edukacji.CL</a>, zaloguj się, znajdź zakładkę <b>&bdquo;Grupy zajęciowe, do których zapisał się słuchacz w&nbsp;semestrze&rdquo;</b> i spróbuj jeszcze raz.',
    'Pobieranie danych nie udało się. Uruchom przeglądarkę ponownie bądź skontaktuj się z <a href="mailto:krzysztof.radoslaw.osada@gmail.com">autorem</a> wtyczki.',
    'Wygląda na to, że znajdujesz się na stronie <a href="https://edukacja.pwr.wroc.pl" target="blank">Edukacji.CL</a>. Otwórz zakładkę <b>&bdquo;Grupy zajęciowe, do których zapisał się słuchacz w&nbsp;semestrze&rdquo;</b> i spróbuj ponownie.',
    'Plan zajęć na wybrany przez Ciebie semestr nie jest jeszcze znany ‒ wybierz inny i spróbuj jeszcze raz.',
    'Rozszerzenie nie zna tokenu umożliwiającego dodanie danych do aplikacji. Zaloguj się w <a href="http://localhost:8080" class="todoapp_link inline small" target="blank">ToDoApp</a> i spróbuj ponownie.',
    'Twoje dane z <a href="https://edukacja.pwr.wroc.pl" target="blank">Edukacji.CL</a> zostały pomyślnie przekazane.',
    'Wystąpił błąd komunikacji z <a href="http://localhost:8080" class="todoapp_link inline small" target="blank">ToDoApp</a>. Uruchom przeglądarkę ponownie bądź skontaktuj się z <a href="mailto:krzysztof.radoslaw.osada@gmail.com">autorem</a> wtyczki.',
  ]
  var icons         = ['sentiment_very_dissatisfied', 'sentiment_satisfied', 'sentiment_very_satisfied'];

  $('#error_title').text(msg_title[k]);
  $('#error_contents').html(msg_contents[k]);
  $('#error_icon').html(icons[l]);
  showSection('error');
}

function handleToDoApp(dataArray) {
  $('#goto_todoapp').click(function() {
    if (!token) {
      showMessageSection(4, 0);
    } else {
      const apiURL  = 'https://xjtxrfc6a1.execute-api.eu-central-1.amazonaws.com/v1/todo';
      var body      = { Content: dataArray };
      var bodyJSON  = JSON.stringify(body);

      $.ajax({
        type: 'POST',
        url: apiURL,
        data: bodyJSON,
        headers: { Authorization: token }
      })
      .done(function() {
        showMessageSection(5, 2);
      })
      .fail(function(response) {
        showMessageSection(6, 0);
        if (response.responseText) {
          console.log(response.responseText)
        }
      });
    }
  });
}

function handleDownload(dataArray) {
  $('#download_btns li').click(function() {
    var id        = $(this).attr('id').slice(9);
    var str       = ''; 
    var filename  = 'eduCL_data.' + id;
    var link      = document.createElement('a');
    var encodedURI;

    if (id === 'json') {
      str = JSON.stringify(dataArray);
    }

    // TODO handling other file extensions

    encodedURI  = encodeURI(str);
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:charset=utf-8,' + encodedURI);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function handleEduCLPage() {
  chrome.tabs.query({ 'active': true }, function(tabs) {
    var tab = tabs[0]
    var url = tab.url;
    var i0  = url.indexOf('edukacja.pwr.wroc.pl'); 

    if (typeof url !== 'undefined') {
      if (i0 > 0) {
        // The active tab is likely to be the page we look for
        chrome.tabs.executeScript(tab.id, {
          code: '('+ getPageContents +')();'
        }, (results) => {
          if (results.length > 0) {
            var data = results[0];
            var i1 = data.indexOf('W wybranym semestrze nie jesteś zapisany(na) do żadnej grupy zajęciowej.');
            var i3 = data.indexOf('hrefZapisaneGrupySluchaczaTabela');
            var i4 = data.indexOf('<!-- grupy zajeciowe: poczatek -->');
            var i5 = data.indexOf('<!-- grupy zajeciowe zapisane administracyjnie: koniec -->');

            if (i1 > 0) {
              showMessageSection(3, 1);
            } else if (i3 > 0 && i4 > 0 && i5 > 0) {
              var dataWrapper   = $('<div/>').html(data.substring(i4, i5));
              var tables        = dataWrapper.find('table.KOLOROWA');
              var coursesArray  = getCoursesData(tables);

              if (coursesArray.length > 0) {
                showSection('data_success');
                handleToDoApp(coursesArray);;
                handleDownload(coursesArray);
              } else {
                showMessageSection(1, 0);
              }

            } else {
              showMessageSection(2, 1);
            }
          } else {
            showMessageSection(1, 0);
          }
        });
      } else {
        showMessageSection(0, 0);
      }
    } else {
      // The popup with focus on itself will not work properly
      window.close();
    }
  });
}

var token;

$(document).ready(function() {
  chrome.storage.sync.get(['todoToken'], function(item) { 
    token = item.todoToken;

    // If the token is not available, show an appropriate messsage
    if (!token) {
      $('#token_not_found').removeClass('hidden');
    } else {
      $('#token_not_found').addClass('hidden');
    }
  });

  $('#menu li').click(function() {
    $('#back_btn').removeClass('hidden');
    var id = $(this).attr('id');

    if (id === 'li_about') {
      showSection('about');
    } else {
      handleEduCLPage();
    }

  });
  $('#back_btn').click(function() {
    $('.contents:not(#menu), #back_btn').addClass('hidden');
    $('#menu').removeClass('hidden');
  });
});
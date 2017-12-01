function getPageContents() {
  return document.body.innerHTML;
}

function showSection(sectionName) {
  $('.contents').addClass('hidden');
  $('#' + sectionName).removeClass('hidden');
}

function showErrorSection(k) {
  var msg_title     = ['To nie jest dobra strona.', 'Wystąpił nieznany błąd', 'Jesteś już blisko!', 'Zmień semestr'];
  var msg_contents  = [
    'Wejdź na <a href="https://edukacja.pwr.wroc.pl" target="blank">stronę Edukacji.CL</a>, zaloguj się, znajdź zakładkę <b>&bdquo;Grupy zajęciowe, do których zapisał się słuchacz w semestrze&rdquo;</b> i spróbuj jeszcze raz.',
    'Pobieranie danych nie udało się. Uruchom przeglądarkę ponownie bądź skontaktuj się z <a href="mailto:krzysztof.radoslaw.osada@gmail.com">autorem</a> wtyczki.',
    'Wygląda na to, że znajdujesz się na stronie <a href="https://edukacja.pwr.wroc.pl" target="blank">Edukacji.CL</a>. Otwórz zakładkę <b>&bdquo;Grupy zajęciowe, do których zapisał się słuchacz w semestrze&rdquo;</b> i spróbuj ponownie.',
    'Plan zajęć na wybrany przez Ciebie semestr nie jest jeszcze znany ‒ wybierz inny i spróbuj jeszcze raz.'
  ]
  var icons         = ['sentiment_very_dissatisfied', 'sentiment_satisfied'];
  var selectedIcon  = icons[0];

  if (k >= 2) {
    selectedIcon = icons[1];
  }

  $('#error_title').text(msg_title[k]);
  $('#error_contents').html(msg_contents[k]);
  $('#error_icon').html(selectedIcon);
  showSection('error');
}

function handleToDoApp(dataArray) {
  $('#goto_todoapp').click(function() {
    // TODO
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
              showErrorSection(3);
            } else if (i3 > 0 && i4 > 0 && i5 > 0) {
              var dataWrapper   = $('<div/>').html(data.substring(i4, i5));
              var tables        = dataWrapper.find('table.KOLOROWA');
              var coursesArray  = getCoursesData(tables);

              if (coursesArray.length > 0) {
                showSection('data_success');
                handleToDoApp(coursesArray);;
                //handleDownload(coursesArray);
              } else {
                showErrorSection(1);
              }

            } else {
              showErrorSection(2);
            }
          } else {
            showErrorSection(1);
          }
        });
      } else {
        showErrorSection(0);
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
    // Check if the token is available
    token = item.todoToken;
    var msg;

    if (token) {
      msg = 'is defined!';
    } else {
      msg = 'is not defined!';
    }
    
    $('#for_token').text(msg);
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
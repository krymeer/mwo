function getCoursesData(tables) {
  var groupsArray = [];

  tables.each(function() {
    var groupCode, groupType, groupDetails, academic, courseName;

    $(this).children('tbody').children('tr').slice(4).each(function() {
      var rowIndex = $(this).index() % 4;
      var cells = $(this).children();
      cells.each(function() {
        $(this).text($(this).text().replace(/(^\s+|\n|\s+$)/g, ''));
      });

      if (rowIndex === 0) {
        groupCode = cells.eq(0).text();
        groupType = cells.eq(1).text().slice(-1);
        courseName = cells.eq(2).text();
      } else if (rowIndex === 2) {
        academic = cells.eq(0).text();
      } else if (rowIndex === 3) {
        var details = cells.eq(0).text().split(/\s\s+/);
        groupDetails = [];
        for (var k = 0; k < details.length; k++) {
          var detailsArr = details[k].split(', ');
          groupDetails.push(
            { 'time': detailsArr[0], 'building': detailsArr[1].slice(5), 'room': detailsArr[2].slice(5) }
          );
        }
        groupsArray.push(
          { 'code': groupCode, 'type': groupType, 'courseName': courseName, 'academic': academic, 'details': groupDetails }
        );
      }
    });
  });

  return groupsArray;
}

/*
$(document).ready(function() {
  var data = $('body').html();
  var i0 = data.indexOf('hrefZapisaneGrupySluchaczaTabela');
  var i1 = data.indexOf('<!-- grupy zajeciowe: poczatek -->');
  var i2 = data.indexOf('<!-- grupy zajeciowe zapisane administracyjnie: koniec -->');

  if (i0 > 0 && i1 > 0 && i2 > 0) {
    var dataWrapper   = $('<div/>').html(data.substring(i1, i2));
    var tables        = dataWrapper.find('table.KOLOROWA');
    var coursesArray  = getCoursesData(tables);

    console.log(coursesArray)
  } else {
    console.error('Error: this page does not contain the required data');
  }
});
*/
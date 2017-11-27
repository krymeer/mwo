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
        
          if (detailsArr.length === 3) {
            groupDetails.push(
              { 'time': detailsArr[0], 'building': detailsArr[1].slice(5), 'room': detailsArr[2].slice(5) }
            );
          } else {
            groupDetails.push(
              { 'time': 'undetermined' }
            )
          }
          
        }

        groupsArray.push(
          { 'code': groupCode, 'type': groupType, 'courseName': courseName, 'academic': academic, 'details': groupDetails }
        );
      }
    });
  });

  return groupsArray;
}
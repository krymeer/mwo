function sortGroupsByHours(scheduleArray) {
  for (var k = 0; k < scheduleArray.length; k++) {
    scheduleArray[k].courses.sort(function(a, b) {
      var hourA = parseInt(a.hours.substr(0, 2) + a.hours.substr(3, 5));
      var hourB = parseInt(b.hours.substr(0, 2) + b.hours.substr(3, 5));

      if (hourA === hourB) {
        var weekTypeA = a.weekType;
        var weekTypeB = b.weekType;

        if (weekTypeA === weekTypeB) {
          return (a.courseName <= b.courseName) ? -1 : 1; 
        } else if (typeof weekTypeA !== 'undefined' && typeof weekTypeB !== 'undefined') {
          return (weekTypeA <= weekTypeB) ? -1 : 1;
        } else {
          return (weekTypeA > weekTypeB ) ? -1 : 1; 
        }
      }

      return (hourA - hourB);
    });

    if (scheduleArray[k].courses.length === 0) {
      scheduleArray.splice(k, 1);
      k--;
    }
  }

  return scheduleArray;
}

function sortGroupsByTime(groupsArray) {
  var scheduleArray = [];
  var daysNames     = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Bez terminu'];

  for (var k = 0; k <= 7; k++) {
    scheduleArray.push( { weekDay: daysNames[k], courses: [] });
  }

  for (var k = 0; k < groupsArray.length; k++) {
    var group = groupsArray[k];
    var d = 7;

    if (time !== 'undetermined') {
      var time      = group.time.split(' ');
      var weekDay   = time[0].slice(0, 2);
      var weekType  = time[0].slice(3);
      group.hours   = time[1];

      switch(weekDay) {
        case "pn":
          d = 0;
          break;
        case "wt":
          d = 1;
          break;
        case "śr":
          d = 2;
          break;
        case "cz":
          d = 3;
          break;
        case "pt":
          d = 4;
          break;
        case "so":
          d = 5;
          break;
        default:
          d = 6;
      }   

      if (weekType === 'TN+1/2') {
        group.weekType = 'TN';
      } else if (weekType === 'TP+1/2') {
        group.weekType = 'TP';
      }
    }

    delete group.time;
    scheduleArray[d].courses.push(group);
  }

  return sortGroupsByHours(scheduleArray);
}

function getCoursesData(tables) {
  var groupsArray = [];

  tables.each(function() {
    var groupCode, groupType, academic, courseName;

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
        var timeAndPlace = cells.eq(0).text().split(/\s\s+/);
        
        for (var k = 0; k < timeAndPlace.length; k++) {
          var detailsArr = timeAndPlace[k].split(', ');
          var group = {};

          // For some particular types of courses we have a slightly different
          // syntax since they are not specified by time in the schedule
          if (detailsArr.length === 3) {
            group.time = detailsArr[0];
            group.building = detailsArr[1].slice(5);
            group.room = detailsArr[2].slice(5);
          } else {
            group.time = 'undetermined';
          }

          group.code = groupCode;
          group.type = groupType;
          group.courseName = courseName;
          group.academic = academic;

          groupsArray.push(group);
        }
      }
    });
  });

  return sortGroupsByTime(groupsArray);
}
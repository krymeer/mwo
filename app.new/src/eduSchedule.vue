<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">plan zajęć</h2>
    <div class="popup" id="deletion_popup" v-if="showDeletionPopup">
      Czy na pewno chcesz usunąć swój plan?
      <span @click="sayYes()">Tak</span> /
      <span @click="sayNo()">Nie</span>
    </div>
    <div v-if="loadingFinished" class="grid" id="control_panel">
      <i v-if="!noSchedule" @click="deleteSchedule()" class="material-icons" id="delete_schedule" data-title="usuń plan">delete</i>
    </div>
    <div v-if="loadingFinished">
      <div v-if="noSchedule" id="no_schedule_msg">
        Tutaj pojawi się Twój plan zajęć z Edukacji.CL. Użyj rozszerzenia <b>eduParser</b> i pobierz wymagane informacje.
        <div id="tokenNotSent" class="margin-top" v-if="!tokenAlreadySent">
          Naciśnij przycisk <button class="margin-left-50 margin-right-50" @click="sendToken()">wyślij token</button> aby udostępnić <b>eduParserowi</b> swój token.
        </div>
        <div class="margin-top" v-if="tokenJustSent">
          Gotowe! Token został wysłany. Naciśnij ikonę <b>eduParsera</b> i postępuj zgodnie z podanymi instrukcjami.
        </div>
      </div>
      <div v-else-if="!noSchedule">
        <div id="schedule">
          <div class="day" v-for="day in schedule">
            <div class="name">{{ day.weekDay }}</div>
            <ul class="courses">
              <li class="course" v-for="course in day.courses">
                <div class="course_hours">{{ course.hours }} <span v-if="course.weekType">{{ course.weekType }}</span></div>
                <div>
                  <div class="course_name">{{ course.courseName }}</div>
                  <div class="course_code">({{ course.code }})</div>
                </div>
                <div class="course_academic">{{ course.academic }}</div>
                <div class="course_place" v-if="course.building && course.room">{{ course.building }} / {{ course.room }}</div>
                <div class="course_type">{{ course.type }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!loadingFinished">
      <loader></loader>
    </div>
  </div>
</template>

<script>
  const apiURL  = 'https://xjtxrfc6a1.execute-api.eu-central-1.amazonaws.com/v1/todo';
  import Vue from 'vue';
  import VueResource from'vue-resource';
  import loader from './loader.vue';
  import auth from './user/auth';
  import './css/eduSchedule.css';
  Vue.use(VueResource);
  export default {
    created: function() {
      auth.getUser().then(result => {
        if (result !== null) {
          this.token = result.idToken.jwtToken;  
          this.getSchedule();
        }
      }).catch(e => {
        console.error(e);
      });
    },
    components: {
      loader
    },
    methods: {
      getSchedule: function() {
        if (typeof this.token !== 'undefined') {
          this.$http.get(apiURL, { headers: { 'Authorization': this.token } }).then(done => {
            var items = done.body.Items;
            var len   = items.length
            if (len > 0) {
              var schedule      = items[len-1].Content;
              var id            = items[len-1].ID;
              var scheduleFound = false;
              var k             = len-2;

              // Temporary way of catching the JSON object
              while (k >= 0) {
                if (typeof schedule === 'object') {
                  scheduleFound = true;
                  break;
                }

                schedule = items[k].Content;
                id = items[k].ID;
                k--;
              }

              if (!scheduleFound) {
                this.noSchedule = true;
              } else {
                this.schedule = schedule;
                this.scheduleId = id;
              }
              
            } else {
              this.noSchedule = true;
            }
            // Here we hide the loader
            this.loadingFinished = true;
          }, fail => {
            console.error('Loading notes failed');
          });
        }
      },
      sayYes: function() {
        if (typeof this.token !== 'undefined') {
          this.$http.delete(apiURL + '/' + this.scheduleId, { headers: { 'Authorization': this.token } }).then(done => {
            this.showDeletionPopup = false;
            this.loadingFinished = false;
            this.schedule = undefined;
            this.scheduleId = undefined;
            this.getSchedule();
          }, fail => {
            console.error('Deleting note failed');
          });
        }
      },
      sayNo: function() {
        this.showDeletionPopup = false;
      },
      deleteSchedule: function() {
        this.showDeletionPopup = true;
      },
      sendToken: function() {
        if (typeof this.token !== 'undefined') {
          var data = { page: 'ToDoApp', token: this.token };

          window.localStorage.setItem('tokenAlreadySent', true);
          window.postMessage(data, '*');
          this.tokenAlreadySent = true;
          this.tokenJustSent = true;
        }
      }
    },
    data: function() {
      return {
        tokenAlreadySent: false,
        tokenJustSent: false,
        token: undefined,
        noSchedule: false,
        loadingFinished: false,
        schedule: undefined,
        scheduleId: undefined,
        showDeletionPopup: false
      }
    }
  }
</script>
<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">plan zajęć</h2>
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
                <div class="course_place">{{ course.building }} / {{ course.room }}</div>
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

          if (typeof this.token !== 'undefined') {
            this.$http.get(apiURL, { headers: { 'Authorization': this.token } }).then(done => {
              var items = done.body.Items;
              var len   = items.length
              if (len > 0) {
                var schedule      = items[len-1].Content;
                var scheduleFound = false;
                var k             = len-2;

                // Temporary way of catching the JSON object
                while (k >= 0) {
                  if (typeof schedule === 'object') {
                    scheduleFound = true;
                    break;
                  }

                  schedule = items[k].Content;
                  k--;
                }

                if (!scheduleFound) {
                  this.noSchedule = true;
                }
                
                this.schedule = schedule;
              } else {
                this.noSchedule = true;
              }
              // Here we hide the loader
              this.loadingFinished = true;
            }, fail => {
              console.error('Loading notes failed');
            });
          }

        }
      }).catch(e => {
        console.error(e);
      });
    },
    components: {
      loader
    },
    methods: { 
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
        schedule: undefined
      }
    }
  }
</script>
<template>
	<div class="google-calendar">
		<button id="authorize-button" style="display: none;">Google Calendar</button>
		<button id="signout-button" style="display: none;">Wyloguj z GC</button>
		<!-- 
			Zakomentowane, było potrzebne do debuga, jak ktoś potrzebuje, to usunąć komentarz
			<div id="content"></div>
		-->
	</div>
</template>

<script>

	// import "./client/lib/apiGoogleCalendar/calendarAPI.js"
	import "./css/googleCalendar.css"
	export default {

		methods: {

			/**
			*  On load, called to load the auth2 library and API client library.
			*/
			handleClientLoad: function() {
			  gapi.load( 'client:auth2', this.initClient );
			},

			/**
			*  Initializes the API client library and sets up sign-in state
			*  listeners.
			*/
			initClient: function() {

				// Client ID and API key from the Developer Console
				var CLIENT_ID = '198563637102-7br738nbkcohjh0tl8nced6uehmpoosh.apps.googleusercontent.com';
				var API_KEY = 'AIzaSyAH6dZfb1dKuz0AqOkw6ukGwDonFdpRE4U';

				// Array of API discovery doc URLs for APIs used by the quickstart
				var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

				// Authorization scopes required by the API; multiple scopes can be
				// included, separated by spaces.
				var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

				var self = this;

			  gapi.client.init({
			    apiKey: API_KEY,
			    clientId: CLIENT_ID,
			    discoveryDocs: DISCOVERY_DOCS,
			    scope: SCOPES
			  }).then( function() {

			    // Listen for sign-in state changes.
			    gapi.auth2.getAuthInstance().isSignedIn.listen( self.updateSigninStatus );

			    // Handle the initial sign-in state.
			    self.updateSigninStatus( gapi.auth2.getAuthInstance().isSignedIn.get() );

			    var authorizeButton = document.getElementById('authorize-button');
			    var signoutButton = document.getElementById('signout-button');
			    authorizeButton.onclick = self.handleAuthClick;
			    signoutButton.onclick = self.handleSignoutClick;


			  }, function( error ) {
			  	console.log( error );
			  });
			},

			/**
			*  Called when the signed in status changes, to update the UI
			*  appropriately. After a sign-in, the API is called.
			*/
			updateSigninStatus: function( isSignedIn ) {

				var authorizeButton = document.getElementById('authorize-button');
				var signoutButton = document.getElementById('signout-button');
				var content = document.getElementById("content");

			  if( isSignedIn ) {
			    authorizeButton.style.display = 'none';
			    signoutButton.style.display = 'block';
			    if( content ) content.style.display = "block";
			    this.listUpcomingEvents();
			  } else {
			    authorizeButton.style.display = 'block';
			    signoutButton.style.display = 'none';
			  }

			},

			/**
			*  Sign in the user upon button click.
			*/
			handleAuthClick: function( event ) {
			  gapi.auth2.getAuthInstance().signIn();
			},

			/**
			*  Sign out the user upon button click.
			*/
			handleSignoutClick: function( event ) {
			  gapi.auth2.getAuthInstance().signOut();
			  var content = document.getElementById("content");
			  if( !content ) return;
			  content.innerHTML = "";
			  content.style.display = "none";
			},

			/**
			* Append a pre element to the body containing the given message
			* as its text node. Used to display the results of the API call.
			*
			* @param {string} message Text to be placed in pre element.
			*/
			appendPre: function( message ) {
			  var pre = document.getElementById('content');
			  if( !pre ) return;
			  pre.innerHTML = pre.innerHTML + message + "<br>\n";
			  // var textContent = document.createTextNode( message + '<br>\n' );
			  // pre.appendChild( textContent );
			},

			/**
			* Print the summary and start datetime/date of the next ten events in
			* the authorized user's calendar. If no events are found an
			* appropriate message is printed.
			*/
			listUpcomingEvents: function() {


				var self = this;

			  gapi.client.calendar.events.list({
			    'calendarId': 'primary',
			    'timeMin': (new Date()).toISOString(),
			    'showDeleted': false,
			    'singleEvents': true,
			    'maxResults': 10,
			    'orderBy': 'startTime'
			  }).then( function( response ) {

			    var events = response.result.items;
			    self.appendPre('Upcoming events:');

			    if( events.length > 0 ) {
			      for( var i = 0; i < events.length; i++ ) {
			        var event = events[i];
			        var when = event.start.dateTime;

			        if( !when ) {
			          when = event.start.date;
			        }

			        self.appendPre(event.summary + ' (' + when + ')')
			        console.log( "Notka -> " + when + ": " + event.summary );
			      }
			    } else {
			      self.appendPre('No upcoming events found.');
			    }

			  });
			}
		},
		created() {
			this.handleClientLoad();
		}
	}





</script>
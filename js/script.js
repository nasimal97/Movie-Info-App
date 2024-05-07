// Lets the user start their search immediately after page has loaded without having to click on anything
window.onload = function() {
   document.getElementById("cinema").select(); // Selects the cinema dropdown
};

var theatreID; // Variable to store the ID of the selected theater
var searchWord; // Variable to store the user's search query

// Placing contents to h1
var date = new Date(); // Get the current date
var day = date.getDate(); // Get the day of the month
var month = date.getMonth() + 1; // Get the month
var year = date.getFullYear(); // Get the year
date = (day < 10 ? "0" + day : day) + "." + (month < 10 ? "0" + month : month) + "." + year; // Date format as DD.MM.YYYY
document.getElementById("heading").innerHTML = "Movie Theaters<br>" + date; // Puts the formatted date in the heading

// When user has used the search field and wants to use the drop-down menu, the search field is emptied
document.getElementById("cinema").addEventListener("click", function(){
  document.getElementById("search").value = ""; // Clears the search field when the cinema dropdown is clicked
});

window.onload = function() {
   document.getElementById("cinema").select(); // Selects the cinema dropdown
   var finnkinoLogo = document.getElementById("finnkino-logo"); // Gets the Finnkino logo element
   if (finnkinoLogo) {
       finnkinoLogo.onclick = function() { // Adds onclick event handler to the logo
           window.open("https://www.finnkino.fi/", "_blank"); // Opens the Finnkino website in a new tab when the logo is clicked
       };
   }
};

// When user has chosen a placefrom the drop-down menu, XML starts loading
function showMovies(event) {
   event.preventDefault(); // Prevents the default behavior of the select element
   document.getElementById("cinema").select(); // Selects the cinema dropdown
  var selectedValue = document.getElementById("cinema").value; // Get the selected value from the cinema dropdown
  var areas = { // Map the cinema names to their IDs
     "Pääkaupunkiseutu": 1014,
     "Espoo": 1012,
     "Espoo: OMENA": 1039,
     "Espoo: SELLO": 1038,
     "Helsinki": 1002,
     "Helsinki: ITIS": 1045,
     "Helsinki: KINOPALATSI": 1031,
     "Helsinki: MAXIM": 1032,
     "Helsinki: TENNISPALATSI": 1033,
     "Vantaa: FLAMINGO": 1013,
     "Jyväskylä: FANTASIA": 1015,
     "Kuopio: SCALA": 1016,
     "Lahti: KUVAPALATSI": 1017,
     "Lappeenranta: STRAND": 1041,
     "Oulu: PLAZA": 1018,
     "Pori: PROMENADI": 1019,
     "Tampere": 1021,
     "Tampere: CINE ATLAS": 1034,
     "Tampere: PLEVNA": 1035,
     "Turku ja Raisio": 1047,
     "Turku: KINOPALATSI": 1022,
     "Raisio: LUXE MYLLY": 1046
  };
  theatreID = areas[selectedValue]; // Get the ID of the selected theater
  loadXML(); // Loads the XML data
}
 
// When user has searched for an area or cinema using the search field, start loading XML
function searchFunction() {
  var selection = document.getElementById("search").value.toLowerCase(); // Get the user's search query and convert it to lowercase
  var areas = { // Connect thr cinema names to their IDs
     "pääkaupunkiseutu": 1014,
     "espoo": 1012,
     "espoo: omena": 1039,
     "espoo: sello": 1038,
     "helsinki": 1002,
     "helsinki: itis": 1045,
     "helsinki: kinopalatsi": 1031,
     "helsinki: maxim": 1032,
     "helsinki: tennispalatsi": 1033,
     "vantaa: flamingo": 1013,
     "jyväskylä: fantasia": 1015,
     "kuopio: scala": 1016,
     "lahti: kuvapalatsi": 1017,
     "lappeenranta: strand": 1041,
     "oulu: plaza": 1018,
     "pori: promenadi": 1019,
     "tampere": 1021,
     "tampere: cine atlas": 1034,
     "tampere: plevna": 1035,
     "turku ja raisio": 1047,
     "turku: kinopalatsi": 1022,
     "raisio: luxe mylly": 1046
  };
  theatreID = areas[selection]; // Get the ID of the selected theater depending on the search query
  loadXML(); // Load the XML data
  document.getElementById("search").value = Object.keys(areas).find(key => areas[key] === theatreID); // Set the search field value to the respective cinema name
}

// Function that loads XML data
function loadXML() {
  if (theatreID) { // Checks if theater ID is available
     var url = "https://www.finnkino.fi/xml/Schedule/?area=" + theatreID + "&dt=" + date; //  The URL for fetching XML data
     var xhttp = new XMLHttpRequest(); // Create a new XMLHttpRequest object to make asynchronous HTTP requests to the server
     xhttp.onreadystatechange = function() { // Defines the event handler for state changes
        if (this.readyState == 4 && this.status == 200) { // Check if request is complete and successful
           parseXML(this); // Parse the received XML data
        }
     };
     xhttp.open("GET", url, true); // Opens request
     xhttp.send(); // Sends request
  }
}

// Function thagt parses XML data
function parseXML(xml) {
   var xmlData = xml.responseXML; // Get the XML data
   var x = xmlData.getElementsByTagName("Show"); // Get all 'Show' elements
   if (x.length === 0) { // Checks if no shows are available
     var selectedCinema = document.getElementById("cinema").value || searchWord; // Get the selected cinema name or search word
     alert(selectedCinema + ": No shows today. Please pick another place."); // Shows alert message
     document.getElementById("cinema").value = ""; // Clears the cinema dropdown value
     document.getElementById("search").value = ""; // Clears the search field value
   } else {
     var tableRows = ""; // starts the table rows variable
     for (var i = 0; i < x.length; i++) { // Loops through all 'Show' elements
       var eventURL = x[i].getElementsByTagName("EventURL")[0].childNodes[0].nodeValue; // Gets the event URL
       var title = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue; // Gets the movie title
       var duration = timeConvert(x[i].getElementsByTagName("LengthInMinutes")[0].childNodes[0].nodeValue); // Gets the movie duration
       var startTime = (x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue).slice(11,16); // Gets the show start time
       var auditorium = x[i].getElementsByTagName("TheatreAndAuditorium")[0].childNodes[0].nodeValue; // Gets the  auditorium
       var eventImage = x[i].getElementsByTagName("EventSmallImagePortrait")[0]; // Gets the event image
       var tablePic = eventImage ? "<img id='moviePic' src='" + eventImage.childNodes[0].nodeValue + "'></img>" : "<br>Image<br>not<br>found<br><br>"; // Generates HTML for the event image
       
       tableRows += "<tr><td id='pic' rowspan='2'><a href='" + eventURL + "' target='_blank'>" + tablePic + "</a></td><td id='today'>" + date + "</td><td id='title'><a href='" + eventURL + "' target='_blank'>" + title + "</a></td><td id='duration' rowspan='2'> Duration:<br>" + duration + "</td></tr><tr><td id='startTime'>" + startTime + "</td><td id='auditorium'>Finnkino " + auditorium + "</td></tr>"; // Generate HTML for table rows
     }
     
     var table = "<table>" + tableRows + "</table>"; // HTML for the table
     document.getElementById("results").innerHTML = table; // Set the table HTML in the 'results' element
     document.getElementById("cinema").value = ""; // Clears the cinema dropdown value
   }
 }
 

function timeConvert(duration) {
   var hours = Math.floor(duration / 60); // Calculate hours
   var minutes = duration % 60; // Calculate remaining minutes
   return hours + " h " + minutes + " min"; // Return the formatted duration string
}

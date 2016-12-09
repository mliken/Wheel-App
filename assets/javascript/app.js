var colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
             "#2E2C75", "#673A7E", "#CC0071", "#F80120",
             "#F35B20", "#FB9A00", "#FFCC00", "#FEF200","#FB9A00", "#FFCC00"];
var restaraunts = ["Korean", "Indian", "Italian", "Sandwiches","Burgers", "Breakfast",
                   "Mexican", "Caribbean","Vietnamese", "Chinese",
                   "Seafood", "Pizza", "Thai", "Japanese"];
var startAngle = 0;
var arc = Math.PI / 6;
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;


   
    $("#spin").on('click', spin);
  
    
   

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;
   
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);
   
   
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
   
    ctx.font = 'bold 12px Helvetica, Arial';
   
    for(var i = 0; i < 12; i++) {
      var angle = startAngle + i * arc;
      ctx.fillStyle = colors[i];
     
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();
     
      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = restaraunts[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
   
    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}
   
function spin() { 
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}
function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = restaraunts[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}
function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}



//==========google map API==========
//create variable for coordinates
var coordinates=[];
var address;


function geocodeAddress(geocoder, resultsMap) {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
            //coords = results[0].geometry.location;
            //coordinates.push(coords.nb);
            //coordinates.push(coords.ob);
            //console.log(results);
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
            }
       		});
    		};


//
function initMap() {
		//create geocoder to get coordinates
		var geocoder = new google.maps.Geocoder();

		//add event listener to add coordinates to the empty array
		$("#submit").on("click", function(){
		address = document.getElementById('address').value;
		geocodeAddress(geocoder, map);
		return false;
		});

		var location = {lat: coordinates[0], lng: coordinates[1]};
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          scrollwheel: false,
          zoom: 12
        });

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
      	location: location,
      	radius: 500,
        }, processResults);

        function processResults(result){
  		console.log(result);
		for (var i = 0; i<result.length; i++) {
     		var marker = new google.maps.Marker({
          		position: result[i].geometry.location,
         		 map: map
        	});
  			}
		}

      };
		
	$(document).ready(drawRouletteWheel, initMap);
   // end of document ready function  
$(window).load(function () {
  $(".preloader").fadeOut(2000);
});
var mainDiv=document.getElementsByClassName("mainDiv")[0]
mainDiv.style.display="none"
var temp=document.getElementById("temp")
var condition=document.getElementById("condition")
var feelsLike=document.getElementById("feelsLike")
var humidity=document.getElementById("humidity")
var pressure=document.getElementById("pressure")
var weather=document.getElementById("weather")
var city=document.getElementById("city")
var country=document.getElementById("country")
var time=document.getElementById("time")
var upperhalf=document.getElementsByClassName("upperHalf")[0]
const search = document.getElementById("search")
  submit = document.getElementById("submit")

// Search city
function searchCity(e) {
  e.preventDefault();
  
  //Get search term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?appid=8de8f0a92b0f5bfd9dbe058cb7d2daed&units=metric&q=${term}`
    )
      .then((res) => res.json())
      .then((data) => {
        if(data.cod==404){
          alert("enter a valid city!")
          return;
        }else{
          var date=new Date()
          var gmt=data.timezone/3600
          var isRound=false;
          if(gmt==Math.floor(data.timezone/3600)){
            isRound=true;
          }
          
          var utcHour=date.getUTCHours();
          var utcminute=date.getUTCMinutes();
          if(gmt>=12){
            gmt-=12
            utcHour-=12
          }
          var hour=utcHour+gmt;
          var minute=utcminute;
          if(!isRound){
            console.log("entered")
            hour=utcHour+Math.floor(gmt)
            minute=utcminute+Math.floor((data.timezone-(Math.floor(gmt)*3600))/60);
            if(minute>60){
              hour+=1;
              minute=minute-60;
            }
          }
          
          
          var text="am"
          if(hour>12){
            hour-=12
            text="pm"
          }
          if(hour>12){
            hour-=12
            text="am"
          }
          if((hour>=7 && text=="pm") || ((hour < 6 || hour ==12) && text=="am")){
            upperhalf.style.backgroundImage = "url('img/nightimg.svg')";
              city.style.color="white"
              country.style.color="white"
          }else{
            upperhalf.style.backgroundImage = "url('img/dayimg.svg')";
            city.style.color="#3d3d3d"
            country.style.color="#3d3d3d"
          }
          
          if(minute<10){
            minute="0"+String(minute)
          }
          var shomoy=hour+":"+minute+" "+text;
          time.innerText=shomoy        
          temp.innerText=Math.round(data.main.temp)
          if(data.weather[0].main=="Thunderstorm"){
            condition.innerText="Thunder"
          }
          condition.innerText=String(data.weather[0].main)
          feelsLike.innerText=(data.main.feels_like).toFixed(2)
          humidity.innerText=data.main.humidity
          pressure.innerText=(data.main.pressure/1000).toFixed(2)
          weather.setAttribute("src","http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png")
          city.innerText=term
          country.innerText=data.sys.country
          showDiv()
        }
        
      });
  }

  // Clear search text
  search.value = "";
}

//EventListener
function showDiv(){
  mainDiv.style.display="block"
}


submit.addEventListener("submit", searchCity);


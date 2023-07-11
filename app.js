const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const homeStartingContent="Random mumbo jumbo";
const contactContent="You can contact us via Email at gautam@gmail.com";
app.get("/",function(req,res){
  // res.sendFile(__dirname+"/index.html");
  res.render("home", {
    startingContent: homeStartingContent
    });
  //res.send("Server is up and running");
});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get('/covidMeter', async (req, res) => {
  const api = require('novelcovid');
  const global = await api.all();
  const countries = await api.countries({ sort: 'cases' });
  res.render('covidMeter', { global, countries });
});
const aboutContent="This is an overall health index calculator website which we have built as part of our IIP project.";
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
app.post("/calculator", function(req, res){
  let toWork=[];
  let totalScore;
  let pulseScore;
  let sugarScore;
  let diabetes;
  let gender = req.body.gender;
  let age = req.body.personAge;
  let sodiumRange;
  let sodiumScore;
  let respRange;
  let respScore;
  let bpRange;
  let bpScore;
  let totalPercent;
  let cholesterolRange;
  let cholesterolScore;
  let calciumScore;
  let calciumRange;
  const bmi = req.body.personWeight/((req.body.personHeight/100) * (req.body.personHeight/100));
  let bmiRange;
  let bmiScore;
  if(bmi>=18.5 && bmi<=25)
  {
    bmiRange="Normal";
    bmiScore=10;
  }
  else if (bmi>25 && bmi<=30) {
    bmiRange="Overweight";
    bmiScore=7;
    toWork.push("Try to reduce some weight");
  }
  else if (bmi>30 && bmi<=40) {
    bmiRange="Obese";
    bmiScore=5;
    toWork.push("Try to reduce some weight");
  }
  else if (bmi>40) {
    bmiRange="Extremely Overweight";
    bmiScore=4;
    toWork.push("Try to reduce some weight");
  }
  else {
    bmiRange="Underweight";
    bmiScore=7;
    toWork.push("Try to gain some muscle mass");
  }
  if(req.body.personPulse>=60 && req.body.personPulse<=100)
  {
    pulseScore = 10;
  }
  else {
    if(req.body.personPulse<60)
    {
      pulseScore = (100-((60-req.body.personPulse)/40*100))/10;
    }
    else {
      pulseScore = (100-((req.body.personPulse-100)/40*100))/10;
    }
  }
  if(req.body.personSugar == "Default")
  {
    sugarScore=10;
    diabetes="Assumed to be normal";
  }
  else {
    if(req.body.personSugar<=100)
    {
      sugarScore=10;
      diabetes="Normal";
    }
    else {
      if(req.body.personSugar>100 && req.body.personSugar<125)
      {
        sugarScore=8;
        diabetes="Pre-diabetic";
        toWork.push("Try to reduce overall sugar intake");
      }
      else {
        sugarScore=5;
        diabetes="Diabetic";
        toWork.push("Try to reduce overall sugar intake");
      }
    }
  }
  if(req.body.personCholesterol=="Default")
  {
    cholesterolRange="Assumed to be normal";
    cholesterolScore=10;
  }
  else {
    if(age<=19)
    {
      if(req.body.personCholesterol<170)
      {
        cholesterolRange="Normal";
        cholesterolScore=10;
      }
      else {
        cholesterolRange="Above normal";
        cholesterolScore=(100-(req.body.personCholesterol-170))/10;
        toWork.push("Try to reduce oil intake");
      }
    }
    if(age>19)
    {
      if(req.body.personCholesterol>=125 && req.body.personCholesterol<=200)
      {
        cholesterolRange="Normal";
        cholesterolScore=10;
      }
      else if (req.body.personCholesterol<125) {
        cholesterolRange="Below normal";
        cholesterolScore=(100-(125-req.body.personCholesterol))/10;
        toWork.push("Try to consume optimal amount of oil");
      }
      else {
        cholesterolRange="Above normal";
        cholesterolScore=(100-(req.body.personCholesterol-200))/10;
        toWork.push("Try to reduce oil intake");
      }
    }
  }
  if(req.body.personSodium=="Default")
  {
    sodiumRange="Assumed to be normal";
    sodiumScore=10;
  }
  else {
    if (req.body.personSodium>=135 && req.body.personSodium<=145) {
      sodiumRange="Normal";
      sodiumScore=10;
    }
    else if (req.body.personSodium<135) {
      sodiumRange="Hyponatremia (Below normal)";
      sodiumScore=(100-(135-req.body.personSodium))/10;
      toWork.push("Try to consume optimal amount of salt in the overall doubt");
    }
    else {
      sodiumRange="Hypernatremia (Above normal)";
      sodiumScore=(100-(req.body.personSodium-145))/10;
      toWork.push("Try to reduce overall salt intake");
    }
  }
  if(req.body.personResp>=12 && req.body.personResp<=20)
  {
    respRange="Normal";
    respScore=10;
  }
  else if (req.body.personResp<12) {
    respRange="Below Normal";
    respScore=(100-(12-req.body.personResp)*4)/100;
    toWork.push("Breathing");
  }
  else if (req.body.personResp>20 && req.body.personResp<=25) {
    respRange="Slightly above normal";
    respScore=(100-(req.body.personResp-20)*4)/10;
    toWork.push("Try some pranayama to have an optimal respiratory rate");
  }
  else {
    respRange="Above normal";
    respScore=(100-(req.body.personResp-25)*4)/10;
    toWork.push("Try some pranayama to have an optimal respiratory rate");
  }
  if(req.body.personSysBP<=120 && req.body.personDysBP<=80)
  {
    bpRange="Normal";
    bpScore=10;
  }
  else if (((req.body.personSysBP>120)&&(req.body.personSysBP<=139))&&((req.body.personDysBP>80)&&(req.body.personDysBP<=89))) {
    bprange="At risk of hypertension";
    bpScore=7;
    toWork.push("Try to improve your overall lifestyle to avert risk of hypertension");
  }
  else if ((req.body.personSysBP>140)&&(req.body.personDysBP>90)) {
    bpRange="High blood pressure";
    bpscore=5;
    toWork.push("Consult a doctor regarding your high blood pressure");
  }
  if(req.body.personCalcium=="Default")
  {
    calciumRange="Assumed to be normal";
    calciumScore=10;
  }
  else {
    if (req.body.personCalcium>= 8.6 && req.body.personCalcium<= 10.4) {
      calciumRange="Normal";
      calciumScore=10;
    }
    else if (req.body.personCalcium < 8.6) {
      calciumRange="Calcium deficiency";
      calciumScore=6
      toWork.push("Try to increase calcium intake in overall diet");
    }
  }
  // const apiKey = "5cb1cc22c8f4d7fa143b7581f55ce933";
  // const url = "https://api.openweathermap.org/data/2.5/air_pollution?lat="+req.body.lat+"&lon="+req.body.lon+"&appid="+apiKey;
  // https.get(url,function(response){
  //   response.on("data", function(data){
  //     const aqiData = JSON.parse(data);
  //     const aqi = aqiData.list[0].main.aqi;
  //     var airQuality;
  //     if(aqi == 1)
  //     {
  //       airQuality="Air Quality at your location seems to be good. You should go and have a walk outside!";
  //     }
  //     else if (aqi==2) {
  //       airQuality="Air Quality at your location seems to be fair. You should go and have a short walk outside!";
  //     }
  //     else if (aqi==3) {
  //       if(req.body.breathing == "yes"){
  //         airQuality="Current air quality may cause some breathing discomfort to you.";
  //       }
  //       else{
  //       airQuality="Air quality currently is moderate.";
  //       }
  //     }
  //     else if (aqi==4) {
  //       if(req.body.breathing == "yes"){
  //         airQuality="Current air quality is not good. Try to stay indoors as much as possible.";
  //       }
  //       else{
  //       airQuality="Current air quality is poor.";
  //       }
  //     }
  //     else {
  //       if(req.body.breathing == "yes"){
  //         airQuality="Current air quality is not good. Try to stay indoors as much as possible.";
  //       }
  //       else{
  //       airQuality="Current air quality is very poor.";
  //       }
  //     }

  totalScore=bmiScore+pulseScore+sugarScore+cholesterolScore+sodiumScore+respScore+bpScore+calciumScore;
  totalPercent=(totalScore/80)*100;
  let total = totalPercent.toFixed(2);
  res.render("result",{data:{personBMI:bmi,
    pulseScore:pulseScore,
    sugarScore:sugarScore,
    diabetes:diabetes,
    bmiRange:bmiRange,
    bmiScore:bmiScore,
    cholesterolRange:cholesterolRange,
    cholesterolScore:cholesterolScore,
    sodiumRange:sodiumRange,
    sodiumScore:sodiumScore,
    respRange:respRange,
    respScore:respScore,
    bpRange:bpRange,
    bpScore:bpScore,
    totalScore:total,
    calciumRange:calciumRange,
    calciumScore:calciumScore,
    toWork
  }});
});
app.get("/calculator",function(req,res){
  res.render("calculator");
});
app.get("/aqi",function(req,res){
  res.render("aqi");
});
app.get("/cowin",function(req,res){
  res.render("cowin");
});
app.post("/cowinNoResult",function(req,res){
  res.render("cowin");
});
app.post("/aqi",function(req,res){
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  const apiKey = "5cb1cc22c8f4d7fa143b7581f55ce933";
  const url = "https://api.openweathermap.org/data/2.5/air_pollution?lat="+lat+"&lon="+lon+"&appid="+apiKey;
  https.get(url,function(response){
    if(response.statusCode===200){


    response.on("data", function(data){
      const aqiData = JSON.parse(data);
      const aqi = aqiData.list[0].main.aqi;
      var airQuality;
      if(aqi == 1)
      {
        airQuality="Good. Minimal impact.";
      }
      else if (aqi==2) {
        airQuality="Fair. May cause minor breathing discomfort to sensitive people.";
      }
      else if (aqi==3) {
        airQuality="Moderate. May cause breathing discomfort to people with lung disease such as asthma, and discomfort to people with heart disease, children and older adults.";
      }
      else if (aqi==4) {
        airQuality="Poor. May cause breathing discomfort to people on prolonged exposure, and discomfort to people with heart disease.";
      }
      else {
        airQuality="Very Poor. May cause respiratory illness to the people on prolonged exposure. Effect may be more pronounced in people with lung and heart diseases."
      }
      const co=aqiData.list[0].components.co;
      const no=aqiData.list[0].components.no;
      const no2=aqiData.list[0].components.no2;
      const so2=aqiData.list[0].components.so2;
      const pm2_5=aqiData.list[0].components.pm2_5;
      const pm10=aqiData.list[0].components.pm10;
      res.render("aqiResult",{data:{airQuality:airQuality,
        co:co,
        no:no,
        no2:no2,
        so2:so2,
        pm2_5:pm2_5,
        pm10:pm10
      }});
    });
  }
  else {
    res.render("failure");
  }
  });
});
app.post("/cowin", function(req,res){
  const pin = req.body.pin;
  const date = req.body.date;
  const url="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+pin+"&date="+date;
  https.get(url,function(response){
    if(response.statusCode===200){
    response.on("data",function(data){
      const sessionData = JSON.parse(data);
      let centerID;
      let centerName;
      let centerAddress;
      let timeFrom;
      let timeTo;
      let feeType;
      let totalAvail;
      let availFirst;
      let availSecond;
      let fee;
      let minAge;
      let vaccineName;
      if(sessionData.sessions.length>0)
      {
        centerID = sessionData.sessions[0].center_id;
        centerName = sessionData.sessions[0].name;
        centerAddress = sessionData.sessions[0].address;
        timeFrom = sessionData.sessions[0].from;
        timeTo = sessionData.sessions[0].to;
        totalAvail = sessionData.sessions[0].available_capacity;
        availFirst = sessionData.sessions[0].available_capacity_dose1;
        availSecond = sessionData.sessions[0].available_capacity_dose2;
        feeType = sessionData.sessions[0].fee_type;
        fee = sessionData.sessions[0].fee;
        minAge = sessionData.sessions[0].min_age_limit;
        vaccineName = sessionData.sessions[0].vaccine;
        res.render("cowinResult",{data:{ centerID:centerID,
          centerName:centerName,
          centerAddress:centerAddress,
          timeFrom:timeFrom,
          timeTo:timeTo,
          feeType:feeType,
          totalAvail:totalAvail,
          availFirst:availFirst,
          availSecond:availSecond,
          fee:fee,
          minAge:minAge,
          vaccineName:vaccineName
        }});
      }
      else {
        res.render("cowinNoResult");
      }
      //res.write();
      //res.send("<h1>It is currently "+temp+" °C in Chennai with a bit of "+weatherDescription+".</h1>");
      // res.send(`
      // <h1>The temperature in `+req.body.cityName+` is <span>${temp}</span> °Celsius.</h1>
      // <h2>The weather in `+req.body.cityName+` is currently: ${weatherDescription}</h2>
      // <img src="${imageURL}">
      // <h2>Other relevent information:</h2>
      // <ul>
      //   <li>Feels like: `+feel+`</li>
      //   <li>Humidity: `+humidity+`</li>
      //   <li>Visibility: `+visibility+`</li>
      //   <li>Pressure: `+pressure+`</li>
      // </ul>
      // `);
    });
  }
  else {
    res.render("failure");
  }
  });
});
const port = process.env.PORT || 3000;
app.listen(port,function(){
  console.log(`Server is running on port ${port}`);
});

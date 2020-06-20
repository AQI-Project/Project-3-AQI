// var svgWidth = parseInt(d3.select("#table").style("width"));
// console.log(svgWidth)

console.log('wocao');

d3.json("getmyfiles/data.json", function(data) {  
  // console.log(data);
  console.log('test');

  var tbody = d3.select('tbody');
  var tableData=[];
  const dataY=[];

  data.forEach(function(x) {
    if (x.status === 'success'){
      tableData.push(x);
    };
    var results = x.data;
    // console.log(typeof(results));
    table(results, tbody);
  });

  tableData.forEach(function(element) {
    dataY.push(element.data);
  });

  // var current = dataY.filter(function(d){return d.current.pollution != null;});
  // console.log(current);

  // console.log(dataY);
  function removeTable(){
    d3.select('tbody').html('');
  };
  
  function lowercase(text){
    var chars = text.toLowerCase()
    return chars;
  };

  var listName=[];
  var ri = document.getElementsByClassName("table-head")
  // console.log(ri.item(0));
  for (var i=0; i < ri.length; i++){
    var cao = ri.item(i).innerHTML;
    listName.push(cao);
  };
  console.log(listName);

  // var string = listName.map(i =>`<label for=${i}>Enter a ${i}</label><input class="form-control" id=${i} type="text" >`);
  // var State = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[1]);
  // var Country = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[2]);


  var button = d3.selectAll('#filter-btn');
  var form = d3.selectAll('#form');
  button.on('click', runEnter);
  form.on('submit',runEnter);  //???? why enter does not work 

  function runEnter(){
    console.log('test');
    d3.event.preventDefault();
    removeTable();
    var tbody = d3.select('tbody');
    var inputId = document.getElementsByClassName('form-control'); // =>  array  returns a collection of all elements in the document 
    
    console.log(inputId);
    var filteredData = dataY;                                                       
      // var idName = inputId[i].id;    // return to city,state ...
      var x = d3.select("#" + 'city').property("value");
      var inputValue = x.toLowerCase().trim();
      console.log(inputValue);

      for (var i = 0; i < 3; i++){
        var filteredData = dataY.filter(table => table[listName[i]].toLowerCase().trim() === inputValue);
        if (filteredData.length > 0) {   //return to array
          filteredData.forEach(x=>{
            table(x, tbody);
          });
            break;  // ?? no break will show ‘not found’  , with break can not find ca
        }
        else {continue;}  // with or without this function same result
      };

      if(inputValue ===''){
        filteredData.forEach(x=>{
          table(x, tbody);
          console.log(x);
        });
      }
      else   // !==''
        if (filteredData.length == 0){   //  remember filteredData  ????
          d3.select('tbody')
            .append('tr')
            .append('td')
            .attr('colspan', 7)
            .html('<h3>No Records Found</h3>');
        }

  }; // runEnter end
}); // d3.json end

var tbody = d3.select('tbody');

function table(data, tbody){
  // append 1 row
  var row = tbody.append("tr")

  // add data for city, country, state
  var city = row.append('td').text(data.city);
  var state = row.append('td').text(data.state);
  var country = row.append('td').text(data.country);

  // add data for latitude and longitude
  try {
    var latitude = row.append('td').text(Math.round(data.location.coordinates[0] * 1000)/1000);
    var longitude = row.append('td').text(Math.round(data.location.coordinates[1] * 1000)/1000);
  } catch(err) { 
    var latitude = row.append('td').text(null);
    var longitude = row.append('td').text(null);
  };

  try {     //class='text-truncate'
    // var weather = row.append('td').text(`temperature :${data.current.weather.tp};\n` +`humidity:${data.current.weather.hu};\n`+ `wind speed:${data.current.weather.hu};\n`);
    var weather = row.append('td').html(`<span class='text-truncate'>temperature :${data.current.weather.tp} wocao</span>;`+'<br/>'+`<span class='text-truncate'>humidity:${data.current.weather.hu}</span>;`+`<br/>`+`<span class='text-truncate'>wind speed:${data.current.weather.hu}</span>;`);
    var pollution = row.append('td').html(`<span class='text-truncate'>AQI:${data.current.pollution.aqius}</span>;`+`<br/>` +`<span class='text-truncate'>main pollutant:${data.current.pollution.mainus}</span>;`);

  } catch(err) { 
    var weather = row.append('td').text(null);
    var pollution = row.append('td').text(null);
  };

  // add more <td> for more columns here
}; // end table function
  



























// table(dataY);
// // console.log(typeof(dataY[0].city));

// function removeTable(){
//   d3.select('tbody').html('');
// };

// function lowercase(text){
//   var chars = text.toLowerCase()
//   return chars;
// };

// // console.log(`------------------------`);

// var listName=[];
// var ri = document.getElementsByClassName("table-head")
// // console.log(ri.item(0));
// for (var i=0; i < ri.length; i++){
//   var cao = ri.item(i).innerHTML;
//   listName.push(cao);
// };
// console.log(listName);

// console.log(`------------------------`);

// //get the list for the filter
// var string = listName.map(i =>`<label for=${i}>Enter a ${i}</label><input class="form-control" id=${i} type="text" >`);
// var State = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[1]);
// var Country = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[2]);
// var aLocation = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[3]);
// var Weather = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[4]);
// var Pollution = d3.select('ul').append('li').attr("class", "filter list-group-item").html(string[5]);

// var inputId = document.getElementsByClassName('form-control'); // =>  array  returns a collection of all elements in the document 
// console.log(inputId[1].id);  //=> !!!!return to all html input value.

// var button = d3.selectAll('#filter-btn');
// var form = d3.selectAll('#form');
// button.on('click', runEnter);
// form.on('submit',runEnter);  //???? why enter does not work 

// function runEnter(){
//   d3.event.preventDefault();
//   removeTable();
//   var inputId = document.getElementsByClassName('form-control'); // =>  array  returns a collection of all elements in the document 
//   var filteredData = dataY;                                                       
//   for (var i = 0; i < inputId.length; i++) {                       //The Document Object Model (DOM) 
//     var idName = inputId[i].id;    // return to city,state ...
//     var x = d3.select("#" + idName).property("value");
//     var inputValue = x.toLowerCase().trim();
//     console.log(inputValue);
//     if (inputValue !== "") {   // there are table[idName] are undefined
//       // var filteredData = dataY.forEach(table => console.log(typeof(table[idName]))); // return to string
//       var filteredData = filteredData.filter(table => table[idName].toLowerCase().trim() === inputValue);
//     // !!!must use  filteredData = filteredData. after the first loop, it will loop again. otherwise only the last loop result.
//     };
//   };

//   // // jump out of loop
//   if (filteredData.length == 0) {
//     d3.select("tbody")
//       .append("tr")
//       .append("td")
//       .attr("colspan", 7)
//       .html("<h4>No Records Found</h4>");
//   };
//   console.log(filteredData);
//   table(filteredData);

// }; // runEnter end













// // from data.js
// var tableData=[]
// dataFinal.forEach( x=> {
//   if (x.status === 'success'){
//     tableData.push(x);
//   };
// });
// console.log(tableData);

// // YOUR CODE HERE!
// var dataY=[];
// tableData.forEach(function(element) {
//     dataY.push(element.data);
// });
// // console.log(dataY[1].city);
// // console.log(typeof(dataY));
// // console.log(dataY);

// // append the tr and td ; then text (value);
// var tbody = d3.select('tbody');
// function table(tableshow){
//   tableshow.forEach((element) => {
//         var row = tbody.append('tr');
//         // console.log(element)
//         Object.entries(element).slice(0,3).forEach(([key,value])=>{    //[key,value] can be data THEN value=data[1]
//           var cell = row.append('td');
//   //         // cell.text(`${JSON.stringify(Object.values(value))}`);
//           cell.text(`${value}`);
//         });
//         Object.entries(element).slice(3,4).forEach(([key,value])=>{
//           var cell = row.append('td');
//           // cell.text(`${JSON.stringify(Object.values(value)[1])}`); // otherwise the value is object
//           cell.text(`${Object.values(value)[1]}`);
//           // console.log(typeof(Object.values(value)[1]))  // return to object
//         });
//         Object.entries(element).slice(4,5).forEach(([key,value])=>{
//           var cell = row.append('td');
//           // console.log(Object.values(value)[0])  // return to weather, in td will be object
//           // cell.text(`${Object.entries(Object.values(value)[0]).slice(1,7)}`);
//           var sss = JSON.stringify(Object.values(value)[0]); //[0] return to weather
//           // console.log(typeof(sss));
//           cell.text(`${sss}`);
//           // console.log(typeof(Object.values(value)[1]))  // return to object
//         });
//         Object.entries(element).slice(4,5).forEach(([key,value])=>{
//           var cell = row.append('td');
//           // console.log(Object.values(value)[1])  // return to weather, in td will be object
//           // cell.text(`${Object.entries(Object.values(value)[1])}`);  //??? will have an undefined error. ?????previous one do not have
//           cell.text(`${JSON.stringify(Object.values(value)[1])}`);
//           // console.log(typeof(Object.values(value)[1]))  // return to object
//         });
//   });
// };






// // // var inputId123 = document.getElementsByClassName("form-control").item(1);
// // // console.log(inputId123);

// // Object.entries(tableshow).forEach(([key,value])=>{    //[key,value] can be oneword THEN value=data[1]
// //   var row = tbody.append('tr');
// //   var cell = row.append('td').attr('class','text-wrap').style("font-weight", "bold");
// //     cell.text(`${key[0].toUpperCase()+key.slice(1)}: ${value}`);
// // });



// // // // FUNCTION remove all the existing rows
// // function removeTable(){
// //     d3.select('tbody').html('');
// // };

// // //FUNCTION lowercase inputValue
// // function lowercase(text){
// //     var chars = text.toLowerCase()
// //     return chars;
// // };

// // // var made = d3.selectAll('.form-control');
// // // var ri = made.attr('id');
// // // // var goushi = made.map(x=>x.attr('id'))
// // // console.log(ri);

// // console.log(`------------------------`);

// // var button = d3.select('#filter-btn');
// // var form = d3.select('#form');
// // button.on('click', runEnter);
// // form.on('submit',runEnter);  //???? why enter does not work

// // // runEnter function
// // function runEnter(){
// //   d3.event.preventDefault();
// //   removeTable();
// //   var inputId = document.getElementsByClassName('form-control'); // =>  array  returns a collection of all elements in the document 
// //   var filteredData = tableData;                                                       
// //   for (var i = 0; i < inputId.length; i++) {                       //The Document Object Model (DOM) 
// //     var idName = inputId[i].id;
// //     var x = d3.select("#" + idName).property("value");
// //     var inputValue = x.toLowerCase().trim();
// //     console.log(inputValue);
// //     if (inputValue !== "") {
// //       var filteredData = filteredData.filter(table => table[idName].toLowerCase().trim() === inputValue);
// //     // !!!must use  filteredData = filteredData. after the first loop, it will loop again. otherwise only the last loop result.
// //     };
// //     console.log(inputId);
// //     console.log(idName);
// //   };

// //   // // jump out of loop

// //   if (filteredData.length == 0) {
// //     d3.select("tbody")
// //       .append("tr")
// //       .append("td")
// //       .attr("colspan", 7)
// //       .html("<h4>No Records Found</h4>");
// //   };

// //   console.log(filteredData);
// //   table(filteredData);
// // };

// console.log(`==================================`)




    










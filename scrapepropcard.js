#! /usr/local/bin/node

var fs = require('fs');
var $ = require('jquery').create();
var sprintf = require('sprintf').sprintf;

var pins = [
'964903489400000','964903575900000','964903660800000','964903665300000','964903666900000','964903671600000',
'964903677700000','964903684600000','964903685200000','964903693600000','964903694000000','964903834800000',
'964903840700000','964903853500000','964903861300000','964903869700000','964903885400000','964903905700000',
'964903922900000','964903927100000','964903946800000','964903958900000','964904073800000','964904248400000',
'964904254200000','964904261000000','964904326600000','964904331700000','964904398400000','964904421600000',
'964904427000000','964904466400000','964904473600000','964904500800000','964904509400000','964904517500000',
'964904536900000','964904550000000','964904583000000','964904629700000','964904631200000','964904639800000',
'964904679000000','964904698100000','964904740500000','964904752300000','964904760100000','964904770900000',
'964904934200000','964904948500000','964904953600000','964904964100000','964904964900000','964904973700000',
'964904982300000','964904990900000','964904991000000','964905306600000','964905315800000','964905323900000',
'964905324300000','964905405400000','964905421800000','964905427900000','964905500500000','964905505900000',
'964905525200000','964905538200000','9649055382C0001','9649055382C0002','9649055382C0003','9649055382C0004',
'964905610300000','964905615600000','964905714700000','964905730100000','964905807800000','964905814600000',
'964905828900000','964905831700000','964905919600000','964905922500000','964905925200000','964911797600000',
'964911882900000','964911884500000','964911892900000','964911899000000','964911994300000','964912086800000',
'964912092600000','964912187500000','964912377200000','964912388800000','964912394500000','964912436800000',
'964912450100000','964912454500000','964912459800000','964912486300000','964912526200000','964912529400000',
'964912540100000','964912545500000','964912563300000','964912570600000','964912615000000','964912623800000',
'964912638200000','964912644500000','964912655600000','964912657200000','964912660700000','964912662000000',
'964912697600000','964912711500000','964912716700000','964912732700000','964912747300000','964912752000000',
'964912779800000','964912780900000','964912798400000','964912807200000','964912813800000','964912823700000',
'964912830700000','964912859200000','964912866600000','964912873100000','964912891900000','964912902400000',
'964912917000000','964912920100000','964912944200000','964912949000000','964912956600000','964912960100000',
'964912981800000','964912999200000','964913037900000','964913125500000','964913131100000','964913188100000',
'964913209300000','964913210800000','964913215000000','964913260900000','964913267800000','964913358000000',
'964913361100000','964913372600000','964913421800000','964913430800000','964913438100000','964913468400000',
'964913478400000','964913510500000','964913529000000','964913531700000','964913534300000','964913539700000',
'964913540500000','964913545400000','964913556700000','964913559100000','964913563200000','964913571700000',
'964913578900000','964913587900000','964913589400000','964913601600000','964913625300000','964913633900000',
'964913642800000','964913647100000','964913686200000','964913689800000','964913720500000','964913726000000',
'964913736000000','964913740300000','964913788500000','964913805200000','964913809900000','964913810400000',
'964913887800000','964913891000000','964913895900000','964913903300000','964913984700000','964913993100000',
'964913999100000','964914020000000','964914065500000','964914076500000','964914087500000','964914107800000',
'964914172300000','964914189700000','964914255900000','964914272700000','964914332800000','964914348300000',
'964914351400000','964914359200000','964914408100000','964914435900000','964914438600000','964914533000000',
'964914619300000','964914621300000','964914650000000','964914705700000','964914755300000','964914920700000',
'964915009200000','964915017600000','964915024100000','964921093600000','964922000500000','964922001000000',
'964922031500000','964922037100000','964922040600000','964922048500000','964922050900000','964922064500000',
'964922075900000','964922081500000','964922111700000','964922115100000','964922116600000','964922120500000',
'964922144900000','964922165800000','964922171400000','964922204100000','964922215500000','964922247300000',
'964922252700000','964922255000000','964922305800000','964922325100000','964922331700000','964922410000000',
'964922414900000','964922422600000','964922429100000'
];

// var file = 'HouseSearch/propcards/964903660800000.html';

function parseAcres(string) {
  var a = string.match(/([^\s]+)\s*Acres/);
  if (a && a.length >= 2) {
    return a[1];
  }
  return string;
}

function parseBuildingStructuresTable($table) {
  var bldg = {};
  var fieldnames = [];
  var i;
  $table.find('tr').eq(1).find('>th').each(function() { // field names are the text contents of the 'th' elements in the 2nd 'tr'
    fieldnames.push($(this).text());
  });
  $table.find('tr').eq(2).each(function() { // field values are the text contents of the 'td' elements in the 3rd 'tr'
    var fieldvalues = [];
    $(this).find('td').each(function() {
      fieldvalues.push($(this).text());
    });
    for (i=0; i<fieldnames.length; ++i) {
      bldg[fieldnames[i]] = fieldvalues[i];
    }
  });
  return bldg;
}

function parseBuildingBuiltinsTable($table) {
  var builtins = {};
  $table.find('tr').slice(1).each(function() {        // only look at rows after 1st row (1st row is header)
    var fieldname  = $(this).find('td').eq(0).text(); // field name is text value of 1st 'td' in row
    var fieldvalue = $(this).find('td').eq(1).text(); // field value is text value of 2nd 'td' in row
    builtins[fieldname] = fieldvalue;
  });
  return builtins;
}

function getResBldgs($page) {

  //  div#pnlResBldg
  //  
  //    table (style, sqft, year built, etc)      # child 0
  //    div                                       # child 1
  //      table (refinement, description)
  //    div                                       # child 2
  //      table (built-ins, units)
  //    br                                        # child 3
  //    table (section, sqft, stories)            # child 4
  //    script
  //  
  //    table (style, sqft, year built, etc)      # child 0
  //    div                                       # child 1
  //      table (refinement, description)
  //    div                                       # child 2
  //      table (built-ins, units)
  //    br                                        # child 3
  //    table (section, sqft, stories)            # child 4
  //    script
  
  var children = $page.find('div#pnlResBldg').children();
  var resBldgs = [];

  var numBldgs = Math.floor(children.length / 5);
  var i;

  for (i=0; i<numBldgs; ++i) {
    bldg = parseBuildingStructuresTable($(children[5*i]));
    bldg.builtins = parseBuildingBuiltinsTable( $(children[5*i+2]).find('table') );
    resBldgs.push(bldg);
  }

  return resBldgs;
}

var loadprop = function(pin) {
  var file = 'HouseSearch/propcards/' + pin + '.html';
  var buffer = fs.readFileSync(file);
  var prop = {
    'pin'          : pin,
    'ownerHistory' : []
  };
  var $page = $(buffer.toString());
  //
  // property location:
  //
  prop.location = $page.find('span#lblSitus').text();

  //
  // total property value:
  //
  prop.totalValue = $page.find('span#lblTotalVal').text();

  //
  // total acres
  //
  prop.totalAcres = parseAcres( $page.find('span#lblAcres').text() );
    
  //
  // res bldgs
  //
  prop.resBldgs = getResBldgs($page);

  //
  // owner history
  //
  $page.find('table#gvOwnerHistory').find('>tr.TableRowStyle,>tr.TableAlternatingRowStyle').each(function(){
    var fields, date, price;
    fields = $(this).find('>td');
    if (fields.length > 2) {
      date  = $(fields[0]).text();
      price = $(fields[1]).text();
      prop.ownerHistory.push({
        'date'  : date,
        'price' : price
      });
    }
  });
  return prop;
};

function printprop(prop) {
  var i;
  console.log(sprintf("-------------------------------------------------------"));
  console.log(sprintf("     Address: %s", prop.location));
  console.log(sprintf("         PIN: %s", prop.pin));
  console.log(sprintf("       Acres: %s", prop.totalAcres));
  console.log(sprintf("   Tax Value: %s", prop.totalValue));
  if (prop.resBldgs.length > 0) {
    console.log(sprintf("    Bedrooms: %s", prop.resBldgs[0].builtins['Bedrooms(s)']));
    numBa = parseInt(prop.resBldgs[0].builtins['Full Bath(s)'], 10)
    numHaBa = parseInt(prop.resBldgs[0].builtins['Half Bath(s)'], 10)
    console.log(sprintf("   Bathrooms: %.1f", numBa + (numHaBa/2.0)));
  }
  console.log(sprintf("Sale History:    Date                Price"));
  console.log(sprintf("                 ========            ========="));
  for (i=0; i<prop.ownerHistory.length; ++i) {
      console.log(sprintf("                 %8s            %s", prop.ownerHistory[i].date, prop.ownerHistory[i].price));
  }
}

//prop = loadprop('963993288800000');
//printprop(prop);

for (i=0; i<pins.length; ++i) {
  prop = loadprop(pins[i]);
  printprop(prop);
}


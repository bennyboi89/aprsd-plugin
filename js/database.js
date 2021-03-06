

/****** Experimental ******/

var hist_call = "";
var hist_fromdate = null;
var hist_fromtime= null;
var hist_todate = null;
var hist_totime = null;


var hist = [];



/* Add items to click-on-map menu */
ctxtMenu.addCallback("MAP", function (m)
{
     if (!(isAdmin() || canUpdate()))
        return;
     m.add(null);
     m.add("Nytt enkelt objekt", function()
       { editSign(m.x, m.y); });
       m.add("Nytt redningsoppdrag", function(){
        addRescueMission(m.x, m.y);});
  });




/* Add items to sign menu */
ctxtMenu.addCallback("SIGN", function (m)
   {
     if (m.ident.substring(0,6) == '__sign' || !(isAdmin() || canUpdate()))
        return;
      m.add("Rediger enkelt objekt", function()
        { editSign(m.x, m.y, m.ident); });
      m.add("Slett enkelt objekt", function()
        { deleteSign(m.ident); });
   });




/* Add items to APRS item menu */
ctxtMenu.addCallback("ITEM", function (m)
   {
      var p = myOverlay.getPointObject(m.ident);
      if (p.flags == null || !p.flags.match("a"))
         return;
      m.add(null);

      m.add("Historikk...", function()
         { setTimeout('searchHistData("'+m.ident+'");', 100); });
      if (p != null && p.flags != null && p.flags.match("i")) {
          m.add("Hørt siste uke...", function()
            { setTimeout('searchPointsVia("'+m.ident+'", 7);', 100); });
          m.add("Hørt siste måned...", function()
            { setTimeout('searchPointsVia("'+m.ident+'", 30);', 100); });
      }
      m.add("APRS pakker", function()
         { rawAprsPackets(m.ident); });
   });





/* Add items to main menu */
ctxtMenu.addCallback("MAIN", function (m)
   {
      m.add(null);
      if (isAdmin() || canUpdate())
         m.add("Nytt enkelt objekt", function()
           { editSign(null, null); });
         m.add("Nytt redningsoppdrag", function(){
            addRescueMission(m.x, m.y);});
      m.add("Historikk...", function()
        { setTimeout('searchHistData(null);', 100); });
   });






function rawAprsPackets(ident)
{
   remotepopupwindow(document.getElementById("anchor"), server_url + 'srv/rawAprsPackets?ident='+ident, 50, 70, "aprspackets");
}




function searchPointsVia(call, days)
{
   var to = new Date();
   var from = new Date();
   from.setTime(from.getTime() - (24*60*60*1000) * days);
   getPointsXmlData(call, formatDate(from)+"/"+formatTime(from), formatDate(to)+"/"+formatTime(to));
}



function getPointsXmlData(stn, tfrom, tto)
{
  abortCall(lastXmlCall);
  mapupdate_suspend(120*1000);
  if (myOverlay != null)
    myOverlay.removePoint();
  myOverlay.loadXml('srv/hpoints?'+extentQuery() +
    '&station=' + stn + '&tfrom='+ tfrom + '&tto='+tto+ (clientses!=null? '&clientses='+clientses : ""));
}




function editSign(x, y, ident)
{
   var id = null;
   if (ident)
      id = ident.substring(2);
   var coord = myKaMap.pixToGeo(x, y);
   fullPopupWindow('Enkelt_objekt', server_url + 'srv/addSign' +
      (x==null ? "" : '?x=' + coord[0] + '&y='+ coord[1]) +
      (id == null? "" : '&edit=true&objid='+id),  570, (x==null ? 390 : 380));
}



function deleteSign(ident)
{
   var id = null;
   if (ident)
      id = ident.substring(2);
   fullPopupWindow('Slett_enkelt_objekt', server_url + 'srv/deleteSign' +
      (id == null? "" : '?objid='+id),  300, 200);


}

/*************************************************************
 * Popup window to add rescue mission info (logged in users only)
 * call to server: 'addmission'
 *************************************************************/

 function addRescueMission(x, y)
 {
   var coord = myKaMap.pixToGeo(x, y);
   fullPopupWindow('addRescueMission', server_url + 'srv/addMission' +
          (x==null ? "" : '&x=' + coord[0] + '&y='+ coord[1] ), 560, 300);
 }


 /*************************************************************
  * Function to delete a rescue mission(logged in users only)
  * call to server: 'deleteMission'
  *************************************************************/
  function deleteMission(ident)
  {
     var id = null;
     if (ident)
        id = ident.substring(2);
     fullPopupWindow('Slett_enkelt_objekt', server_url + 'srv/deleteMission' +
        (id == null? "" : '?objsrc='+id),  300, 200);


  }


/********************************************************************************************/


function searchHistData(call)
{
   if (hist_fromdate == null)
      hist_fromdate = formatDate(new Date());
   if (hist_todate == null || hist_todate == '-')
      hist_todate = formatDate(new Date());
   if (hist_fromtime == null)
      hist_fromtime = formatTime(new Date());
   if (hist_totime == null || hist_totime == '-')
      hist_totime = formatTime(new Date());
   if (call != null)
      hist_call = call;


   var x = popupwindow(document.getElementById("anchor"),
        ' <h1>Generere historisk spor</h1><hr><form>' +
        ' <span class="sleftlab">Stasjon: </span><input type="text"  size="10" id="findcall" value="'
             + hist_call + '"/><br> '+
        ' <span class="sleftlab">Tid start: </span><input type="text"  size="10" id="tfrom" value="'
                 + hist_fromdate +
              '"/>&nbsp;<input type="text"  size="4" id="tfromt" value="'
                 + hist_fromtime + '"/> <br> '+
        ' <span class="sleftlab">Tid slutt: </span><input type="text" size="10" id="tto" value="'
                 + hist_todate +
              '"/>&nbsp;<input type="text" size="4" id="ttot" value="'
                + hist_totime + '"/>&nbsp; <input type="checkbox" id="ttoopen"> Åpen slutt <br> '+
        '<hr>'+
        '<div id="searchlist"></div>' +
        '<hr>'+
        ' <input id="searchbutton" type="button"' +
        ' value="Søk" />'+

        ' <input id="addbutton" title="Legg spor til liste" type="button"' +
        ' value="Legg til" />'+

        ' <input id="showallbutton" title="Vis alle spor i liste" type="button"' +
        ' value="Vis alle" />'+

	' <input id="exportbutton" title="Eksporter spor (i liste) til GPX format" type="button"' +
        ' value="Eksport" />'+

        ' <input id="clearbutton" title="Nullstill liste" type="button"' +
        ' value="Nullstill" />'+

        '</form><br>' +
	'<iframe id="downloadframe" style="display:none"></iframe>', 50, 70, null)

        displayList();

        $('#ttoopen').click( function() {
          if ($('#ttoopen').attr('checked'))
              $('#tto,#ttot').prop('disabled',true);
          else
              $('#tto,#ttot').removeProp('disabled');
        });

        $('#searchbutton').click( function() {
           getItem();
           getHistXmlData( hist_call.toUpperCase(), hist_fromdate+"/"+hist_fromtime, hist_todate+"/"+hist_totime );
        });

        $('#addbutton').click( function() {
	  getItem();
          hist_call = hist_call.toUpperCase();
          hist.push({ call:hist_call, fromdate:hist_fromdate, todate:hist_todate,
                      fromtime: hist_fromtime, totime: hist_totime});
          displayList();
        });

        $('#showallbutton').click( function() {
          showAll();
        });

	$('#exportbutton').click( function() {
          exportGpx();
        });



        $('#clearbutton').click( function() {
          hist = [];
          displayList();
        });

        $('#tfrom,#tto').datepicker({ dateFormat: 'yy-mm-dd' });
        $(x).resizable();
}

/***************************************************************
Adding search for old rescue missions. NOT IMPLEMENTED YET
*****************************************************************/
function searchMissionData(call)
{
   if (hist_fromdate == null)
      hist_fromdate = formatDate(new Date());
   if (hist_todate == null || hist_todate == '-')
      hist_todate = formatDate(new Date());
   if (hist_fromtime == null)
      hist_fromtime = formatTime(new Date());
   if (hist_totime == null || hist_totime == '-')
      hist_totime = formatTime(new Date());
   if (call != null)
      hist_call = call;


   var x = popupwindow(document.getElementById("anchor"),
        ' <h1>Generere historisk spor</h1><hr><form>' +
        ' <span class="sleftlab">Stasjon: </span><input type="text"  size="10" id="findcall" value="'
             + hist_call + '"/><br> '+
        ' <span class="sleftlab">Tid start: </span><input type="text"  size="10" id="tfrom" value="'
                 + hist_fromdate +
              '"/>&nbsp;<input type="text"  size="4" id="tfromt" value="'
                 + hist_fromtime + '"/> <br> '+
        ' <span class="sleftlab">Tid slutt: </span><input type="text" size="10" id="tto" value="'
                 + hist_todate +
              '"/>&nbsp;<input type="text" size="4" id="ttot" value="'
                + hist_totime + '"/>&nbsp; <input type="checkbox" id="ttoopen"> Åpen slutt <br> '+
        '<hr>'+
        '<div id="searchlist"></div>' +
        '<hr>'+
        ' <input id="searchbutton" type="button"' +
        ' value="Søk" />'+

        ' <input id="addbutton" title="Legg spor til liste" type="button"' +
        ' value="Legg til" />'+

        ' <input id="showallbutton" title="Vis alle spor i liste" type="button"' +
        ' value="Vis alle" />'+

	' <input id="exportbutton" title="Eksporter spor (i liste) til GPX format" type="button"' +
        ' value="Eksport" />'+

        ' <input id="clearbutton" title="Nullstill liste" type="button"' +
        ' value="Nullstill" />'+

        '</form><br>' +
	'<iframe id="downloadframe" style="display:none"></iframe>', 50, 70, null)

        displayList();

        $('#ttoopen').click( function() {
          if ($('#ttoopen').attr('checked'))
              $('#tto,#ttot').prop('disabled',true);
          else
              $('#tto,#ttot').removeProp('disabled');
        });

        $('#searchbutton').click( function() {
           getItem();
           getHistXmlData( hist_call.toUpperCase(), hist_fromdate+"/"+hist_fromtime, hist_todate+"/"+hist_totime );
        });

        $('#addbutton').click( function() {
	  getItem();
          hist_call = hist_call.toUpperCase();
          hist.push({ call:hist_call, fromdate:hist_fromdate, todate:hist_todate,
                      fromtime: hist_fromtime, totime: hist_totime});
          displayList();
        });

        $('#showallbutton').click( function() {
          showAll();
        });

	$('#exportbutton').click( function() {
          exportGpx();
        });



        $('#clearbutton').click( function() {
          hist = [];
          displayList();
        });

        $('#tfrom,#tto').datepicker({ dateFormat: 'yy-mm-dd' });
        $(x).resizable();
}


function displayList()
{
   var txt = "";
   for (i=0; i<hist.length; i++)
     txt += '<img title="remove" src="images/edit-delete.png" height="14" onclick="deleteItem('+i+');"> '+
            '<img title="edit" src="images/edit.png" height="14" onclick="editItem('+i+');"> '+
            hist[i].call + ' : ' + hist[i].fromdate+" "+ hist[i].fromtime + ' - ' +
            hist[i].todate + ' ' + hist[i].totime + '<br>'
   document.getElementById("searchlist").innerHTML = txt;
}



Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};



function getItem()
{
    hist_call     = $('#findcall').val();
    hist_fromdate = $('#tfrom').val();
    hist_fromtime = $('#tfromt').val();
    if ($('#ttoopen').is(':checked'))
       hist_todate = hist_totime = '-';
    else
    {
       hist_todate   = $('#tto').val();
       hist_totime   = $('#ttot').val();
    }
}



function deleteItem(idx)
{
   hist.remove(idx);
   displayList();
}



function editItem(idx)
{
   $('#findcall').val(hist[idx].call);
   $('#tfrom').val(hist[idx].fromdate);
   $('#tfromt').val(hist[idx].fromtime);
   if (hist[idx].todate == '-') {
       $('#ttoopen').attr('checked', true);
       $('#tto,#ttot').prop('disabled',true);
       $('#tto').val(formatDate(new Date()));
       $('#ttot').val(formatTime(new Date()));
   }
   else {
       $('#ttoopen').attr('checked', false);
       $('#tto,#ttot').removeProp('disabled');
       $('#tto').val(hist[idx].todate);
       $('#ttot').val(hist[idx].totime);
   }
   getItem();
   deleteItem(idx);
}



function extentQuery()
{
   var ext = myKaMap.getGeoExtents();
   var flt = "";
   if (filterProfiles.selectedProf() != null)
       flt = "&filter="+filterProfiles.selectedProf();
   return "x1="  + roundDeg(ext[0]) + "&x2="+ roundDeg(ext[1]) +
       "&x3=" + roundDeg(ext[2]) + "&x4="+ roundDeg(ext[3]) + flt ;
}



function showAll()
{
  abortCall(lastXmlCall);
  mapupdate_suspend(120*1000);
  if (myOverlay != null)
    myOverlay.removePoint();

  for (i=0; i<hist.length; i++)
    myOverlay.loadXml('srv/htrail?'+extentQuery() + '&scale='+currentScale+
      '&station=' + hist[i].call + '&tfrom='+ hist[i].fromdate+"/"+hist[i].fromtime +
      '&tto='+  hist[i].todate+"/"+hist[i].totime + (clientses!=null? '&clientses='+clientses : ""));
}



function getHistXmlData(stn, tfrom, tto)
{
   abortCall(lastXmlCall);
   mapupdate_suspend(120*1000);
   if (myOverlay != null)
      myOverlay.removePoint();
   myOverlay.loadXml('srv/htrail?'+extentQuery() + '&scale='+currentScale+
     '&station=' + stn + '&tfrom='+ tfrom + '&tto='+tto+ (clientses!=null? '&clientses='+clientses : ""));
}



function exportGpx()
{
    parms = 'ntracks='+hist.length;
    for (i=0; i<hist.length; i++)
       parms += '&station' + i + '=' + hist[i].call + '&tfrom' + i + '=' + hist[i].fromdate+"/"+hist[i].fromtime +
                '&tto' + i + '='+  hist[i].todate+"/"+hist[i].totime;

    document.getElementById("downloadframe").src ='srv/gpx?' + parms;
}



function formatDate(d)
{
    return ""+d.getFullYear() + "-" +
       (d.getMonth()<9 ? "0" : "") + (d.getMonth()+1) + "-" +
       (d.getDate()<10 ? "0" : "")  + d.getDate();
}




function formatTime(d)
{
    return "" +
       (d.getHours()<10 ? "0" : "") + d.getHours() + ":" +
       (d.getMinutes()<10 ? "0" : "") + d.getMinutes();
}

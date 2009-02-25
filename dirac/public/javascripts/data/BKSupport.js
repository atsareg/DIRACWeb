
function bkRight(){
  function createField(id,label){
    var txtField = new Ext.form.TextField({
      anchor:'90%',
      fieldLabel:label,
      id:id,
      name:id,
      readOnly:true
    });
    return txtField;
  }
  var fSet0 = new Ext.Button({
    cls:"x-btn-text-icon",
    handler:function(){
      bkSaveDialog()
    },
    icon:gURLRoot+'/images/iface/save.gif',
    minWidth:'170',
    tooltip:'Click the button if you want to save records to a file',
    text:'Save dialog'
  });
  var fSet1 = {
    autoHeight:true,
    defaultType:'textfield',
    items:[
      createField('cName','Configuration Name'),
      createField('cVersion','Configuration Version'),
      createField('simCond','Simulation Conditions'),
      createField('procPass','Processing pass'),
      createField('eType','Event Type'),
      createField('fType','File Type'),
    ],
    labelAlign:'top',
    xtype:'fieldset'
  }
  var fSet2 = {
    autoHeight:true,
    defaultType:'textfield',
    items:[
      createField('nof','Number Of Files'),
      createField('noe','Number Of Events'),
      createField('fSize','File(s) Size')
    ],
    labelAlign:'top',
    title:'Statistics',
    xtype:'fieldset'
  }
  var panel = new Ext.Panel({
    autoScroll:true,
    buttonAlign:'center',
    buttons:[fSet0],
    collapsible:false,
//    disabled:true,
    id:'bkRight',
    split:true,
    region:'east',
    margins:'2 0 2 0',
    cmargins:'2 2 2 2',
    bodyStyle:'padding: 5px',
    width: 200,
    labelAlign:'top',
    minWidth: 200,
    items:[fSet1,fSet2],
    title:'Bookkeeping info',
  });
  return panel
}
function saveFile(panel){
  Ext.util.FileOps = function(obj, name){
    alert('This code was posted in \[CODE\] tags');
  };
  Ext.util.FileOps.downloadFile = function(url) {
    var id = Ext.id();
    var frame = document.createElement('iframe');
    frame.id = id;
    frame.name = id;
    frame.className = 'x-hidden';
    if(Ext.isIE) {
      frame.src = Ext.SSL_SECURE_URL;
    }
    document.body.appendChild(frame);
    if(Ext.isIE) {
      document.frames[id].name = id;
    }
    var form = Ext.DomHelper.append(document.body, {
      tag:'form',
      method:'post',
      action:url,
      target:id
    });
    document.body.appendChild(form);
    var callback = function() {
      Ext.EventManager.removeListener(frame, 'load', callback, this);
      setTimeout(function() {document.body.removeChild(form);}, 100);
      setTimeout(function() {document.body.removeChild(frame);}, 110);
    };
    Ext.EventManager.on(frame, 'load', callback, this);
    form.submit();
  };
  try{
    var table = Ext.getCmp('DataMonitoringTable');
    if(table.store.baseParams.root){
      var root = table.store.baseParams.root;
    }else{
      alert('Error: There are no records in the table');
      return
    }
  }catch(e){
    alert('Error: There are no records in the table');
    return
  }
  var params = 'root=' + root;
  try{
    var type = 'txt';
    for(i=0;i<document.filetypeHTML.radiobutton.length;i++) {
      if(document.filetypeHTML.radiobutton[i].checked) {
        type = document.filetypeHTML.radiobutton[i].value;
      }
    }
    var records = 'all';
    for(i=0;i<document.recordsHTML.radio.length;i++) {
      if(document.recordsHTML.radio[i].checked) {
        records = document.recordsHTML.radio[i].value;
      }
    }
    var start = 0;
    var end = table.store.totalLength;
    if(records == 'recs'){
      start = document.recordsHTML.textfield1.value;
      if(start == ''){
        alert('Initial record index is absent');
        return
      }
      end = document.recordsHTML.textfield2.value;
      if(end == ''){
        alert('Final record index is absent');
        return
      }
    }
  }catch(e){
    alert('Error: Can not get values from the form');
    return
  }
  params = params + '&type=' + type + '&start=' + start + '&limit=' + end;
  Ext.util.FileOps.downloadFile('download?' + params);
}
function bkSaveDialog(){
  try{
    var table = Ext.getCmp('DataMonitoringTable');
    if(!table.store.totalLength){
      alert('Error: There are no records in the table');
      return
    }
  }catch(e){
    alert('Error: There are no records in the table');
    return
  }
  var filetypeHTML = '<form id="filetypeHTML" name="filetypeHTML" method="post" action="">';
  filetypeHTML = filetypeHTML + '<table width="350" border="0" cellspacing="5" cellpadding="0">';
  filetypeHTML = filetypeHTML + '<tr><td width="20"><label valign="middle">';
  filetypeHTML = filetypeHTML + '<input name="radiobutton" type="radio" value="txt" tabindex="1" checked="checked"/></label>';
  filetypeHTML = filetypeHTML + '</td><td>Save as a text file (*.txt) </td>';
  filetypeHTML = filetypeHTML + '</tr><tr><td><label>';
  filetypeHTML = filetypeHTML + '<input name="radiobutton" type="radio" value="py" tabindex="2" /></label>';
  filetypeHTML = filetypeHTML + '</td><td>Save as a python file (*.py)</td></tr></table></form>';
  var recordsHTML = '<form id="recordsHTML" name="recordsHTML" method="post" action="">';
  recordsHTML = recordsHTML + '<table width="350" border="0" cellspacing="5" cellpadding="0"><tr><td width="20"><label>';
  recordsHTML = recordsHTML + '<input name="radio" id="radioAll" type="radio" tabindex="3" value="all" checked="checked" onChange="rClick(\'All\')" /></label>';
  recordsHTML = recordsHTML + '</td><td colspan="5">All</td></tr><tr><td><label>';
  recordsHTML = recordsHTML + '<input name="radio" id="radioR" type="radio" tabindex="4" value="recs" onChange="rClick(\'radioR\')" /></label>';
  recordsHTML = recordsHTML + '</td><td>Records</td><td align="right">From:</td><td><label>';
  recordsHTML = recordsHTML + '<input id="textF1" name="textfield1" type="text" size="10" disabled="disabled" /></label>';
  recordsHTML = recordsHTML + '</td><td align="right">To:</td><td><label>';
  recordsHTML = recordsHTML + '<input id="textF2" name="textfield2" type="text" size="10" disabled="disabled" /></label>';
  recordsHTML = recordsHTML + '</td></tr></table></form>';
  var panel = new Ext.Panel({
    labelAlign: 'top',
    bodyStyle:'padding:5px',
    buttonAlign:'center',
    buttons:[{
      cls:"x-btn-text-icon",
      handler:function(){
        saveFile(panel);
      },
      icon:gURLRoot+'/images/iface/save.gif',
      minWidth:'150',
      tooltip:'Will open a standard browser save file dialog',
      text:'Save'
    },{
      cls:"x-btn-text-icon",
      handler:function(){
        var parent = panel.findParentByType('window');
        parent.close();
      },
      icon:gURLRoot+'/images/iface/reset.gif',
      minWidth:'100',
      tooltip:'Click here to discard changes and close the window',
      text:'Cancel'
    },{
      cls:"x-btn-text-icon",
      handler:function(){
        getBKInfo('textF1','textF2');
      },
      icon:gURLRoot+'/images/iface/info.gif',
      id:'infoButtonRec',
      minWidth:'100',
      text:'Info',
      tooltip:'Get statistical information for the chosen entries'
    }],
    items:[{
      autoHeight:true,
      html:filetypeHTML,
      title:'File Type',
      xtype:'fieldset'    
    },{
      autoHeight:true,
      html:recordsHTML,
      title:'Records',
      xtype:'fieldset'
    }]
  });
  var window = displayWin(panel,'Save dialog','true',true);
  window.setSize(400,265);
}
function getBKInfo(first,last){
  var table = Ext.getCmp('DataMonitoringTable');
  var root = '';
  try{
    if(table.store.baseParams.level){
      if(table.store.baseParams.level == 'showFiles'){
        root = table.store.baseParams.root;
      }else{
        alert('Unable to get table.store.baseParams.root value');
        return;
      }
    }
  }catch(e){
    alert('Unable to get table.store.baseParams.level value');
    return;
  }
  var len = 0;
  try{
    if(table.store.totalLength){
      len = table.store.totalLength;
    }
  }catch(e){
    alert('Unable to get table.store.totalLength value');
    return
  }
  var t1 = document.getElementById(first);
  var t2 = document.getElementById(last);
  var all = document.getElementById('radioAll');
  if(all.checked){
    t1 = 0;
    t2 = len;
  }else{
    if(t1.value == ''){
      alert('Field "From" is empty');
      return
    }else if(t1.value > len){
      alert('The value in the field "From" is bigger than the total number of entries');
      return
    }else{
      t1 = t1.value;
    }
    if(t2.value == ''){
      alert('Field "To" is empty');
      return
    }else if(t2.value > len){
      alert('The value in the field "To" is bigger than the total number of entries');
      return
    }else{
      t2 = t2.value;
    }
  }
  var url ='info?&root=' + root + '&start=' + t1 + '&limit=' + t2;
  var panel = new Ext.Panel({autoLoad:url,bodyStyle:'padding: 5px'});
  var window = displayWin(panel,'Statistics','',true);
  window.setSize(200,100);
  window.center();
}
function rClick(radioID){
  var t1 = document.getElementById('textF1');
  var t2 = document.getElementById('textF2');
  if(radioID == 'radioR'){
    t1.disabled = false;
    t2.disabled = false;
  }else if(radioID == 'radioP'){
    t1.disabled = true;
    t2.disabled = true;
    t1.value = '';
    t2.value = '';
  }else{
    t1.disabled = true;
    t2.disabled = true;
    t1.value = '';
    t2.value = '';
  }
}
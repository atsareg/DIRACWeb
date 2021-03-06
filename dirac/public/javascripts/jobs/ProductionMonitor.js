var dataSelect = ''; // Required to store the data for filters fields. Object.
var dataMngr = ''; // Required to connect form and table. Object.
var tableMngr = ''; // Required to handle configuration data for table. Object.
var testObject = {}; // Used to store values between refresh action
var heartbeat = '';
var refreshRate = 0;
var tableID = 'tmpID';
var idObject = new Array();
// Main routine
function initProductionMonitor(reponseSelect){
  dataSelect = reponseSelect;
  dataSelect.globalSort = '';
  var record = initRecord();
  var store = initStore(record,{'groupBy':'TransformationFamily'});
  store.addListener('beforeload',function(store){
    if(store.totalLength){
      testObject = {}
      for(var i = 0; i < store.totalLength; i++){
        var record = store.getAt(i);
        try{
          testObject[record.data.TransformationID] = {};
          testObject[record.data.TransformationID]['Jobs_Created'] = record.data['Jobs_Created'];
          testObject[record.data.TransformationID]['Jobs_Done'] = record.data['Jobs_Done'];
          testObject[record.data.TransformationID]['Jobs_Failed'] = record.data['Jobs_Failed'];
          testObject[record.data.TransformationID]['Jobs_Running'] = record.data['Jobs_Running'];
          testObject[record.data.TransformationID]['Jobs_Stalled'] = record.data['Jobs_Stalled'];
          testObject[record.data.TransformationID]['Jobs_Submitted'] = record.data['Jobs_Submitted'];
          testObject[record.data.TransformationID]['Jobs_Waiting'] = record.data['Jobs_Waiting'];
          testObject[record.data.TransformationID]['Jobs_Completed'] = record.data['Jobs_Completed'];
          testObject[record.data.TransformationID]['Files_PercentProcessed'] = record.data['Files_PercentProcessed'];
          testObject[record.data.TransformationID]['Files_Total'] = record.data['Files_Total'];
          testObject[record.data.TransformationID]['Files_Unused'] = record.data['Files_Unused'];
          testObject[record.data.TransformationID]['Files_Assigned'] = record.data['Files_Assigned'];
          testObject[record.data.TransformationID]['Files_Processed'] = record.data['Files_Processed'];
          testObject[record.data.TransformationID]['Files_Problematic'] = record.data['Files_Problematic'];
        }catch(e){}
      }
    }
  });
  Ext.onReady(function(){
    heartbeat = new Ext.util.TaskRunner();
    Ext.override(Ext.PagingToolbar, {
      onRender :  Ext.PagingToolbar.prototype.onRender.createSequence(function(ct, position){
        this.loading.removeClass('x-btn-icon');
        this.loading.setText('Refresh');
        this.loading.addClass('x-btn-text-icon');
      })
    });
    renderData(store);
  });
}
function diffValues(value,metaData,record,rowIndex,colIndex,store){
  var id = record.data.TransformationID;
  if(id && testObject[id]){
    var name = this.name;
    try{
      var diff = value - testObject[id][name];
      var test = diff + '';
      if(test.indexOf(".") > 0){
        diff = diff.toFixed(1);
      }
      if(diff > 0){
        return value + ' <font color="#00CC00">(+' + diff + ')</font>';
      }else if(diff < 0){
        return value + ' <font color="#FF3300">(' + diff + ')</font>';
      }else{
        return value;
      }
    }catch(e){
      return value;
    }
  }else{
    return value;
  }
}
// function describing data structure, should be individual per page 
function initRecord(){
  var record = new Ext.data.Record.create([
    {name:'TransformationIDcheckBox',mapping:'TransformationID'},
    {name:'TransformationID'},
    {name:'StatusIcon',mapping:'Status'},
    {name:'Status'},
    {name:'TransformationName'},
    {name:'TransformationGroup'},
    {name:'GroupSize'},
    {name:'InheritedFrom'},
    {name:'MaxNumberOfJobs'},
    {name:'EventsPerJob'},
    {name:'AuthorDN'},
    {name:'AuthorGroup'},
    {name:'Type'},
    {name:'Plugin'},
    {name:'AgentType'},
    {name:'FileMask'},
    {name:'Description'},
    {name:'LongDescription'},
    {name:'CreationDate',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'LastUpdate',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'Files_Total'},
    {name:'Files_PercentProcessed'},
    {name:'Files_Unused'},
    {name:'Files_Assigned'},
    {name:'Files_Processed'},
    {name:'Files_Problematic'},
    {name:'Jobs_Created'},
    {name:'Jobs_Submitted'},
    {name:'Jobs_Waiting'},
    {name:'Jobs_Running'},
    {name:'Jobs_Done'},
    {name:'Jobs_Failed'},
    {name:'Jobs_Stalled'},
    {name:'Jobs_Completed'},
    {name:'TransformationFamily',type:'float'}
  ]);
  return record
}
// Initialisation of selection sidebar, all changes with selection items should goes here
function initSidebar(){
  var prodSelect = createMenu('prodStatus','Status'); // Initializing Production Status Menu
  var agentSelect = createMenu('agentType','AgentType'); // Initializing Agent Type Menu
  var prodType = createMenu('productionType','Type');
  var transGroup = createMenu('transformationGroup','Group');
  var plugin = createMenu('plugin','Plugin');
  var dateSelect = dateSelectMenu(); // Initializing date dialog
  var id = genericID('productionID','ProductionID'); // Initialize field for JobIDs
  var requestID = genericID('requestID','RequestID');
  var select = selectPanel(); // Initializing container for selection objects
//  select.buttons[2].hide(); // Remove refresh button
  // Insert object to container BEFORE buttons:
  select.insert(0,prodSelect);
  select.insert(1,agentSelect);
  select.insert(2,prodType);
  select.insert(3,transGroup);
  select.insert(4,plugin);
  select.insert(5,dateSelect);
  select.insert(6,id);
  select.insert(7,requestID);
  var stat = statPanel('Current Statistics','current','statGrid');
  var glStat = statPanel('Global Statistics','global','glStatGrid');
  var bar = sideBar();
  bar.insert(0,select);
  bar.insert(1,stat);
  bar.insert(2,glStat);
  bar.setTitle('ProductionMonitor');
  return bar
}
function initData(store){
  var columns = [
    {header:'',id:'checkBox',width:26,sortable:false,dataIndex:'TransformationIDcheckBox',renderer:chkBox,hideable:false,fixed:true,menuDisabled:true},
    {header:'ID',width:60,sortable:true,dataIndex:'TransformationID',align:'left',hideable:false},
    {header:'Request',sortable:true,dataIndex:'TransformationFamily',align:'left',hidden:true},
    {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
    {header:'Status',width:60,sortable:true,dataIndex:'Status',align:'left'},
    {header:'AgentType',width:60,sortable:true,dataIndex:'AgentType',align:'left'},
    {header:'Type',sortable:true,dataIndex:'Type',align:'left'},//,hidden:true},
    {header:'Group',sortable:true,dataIndex:'TransformationGroup',align:'left',hidden:true},
    {header:'Name',sortable:true,dataIndex:'TransformationName',align:'left'},
    {header:'Files',sortable:true,dataIndex:'Files_Total',align:'left',renderer:diffValues},
    {header:'Processed (%)',sortable:true,dataIndex:'Files_PercentProcessed',align:'left',renderer:diffValues},
    {header:'Files Processed',sortable:true,dataIndex:'Files_Processed',align:'left',hidden:true,renderer:diffValues},
    {header:'Files Assigned',sortable:true,dataIndex:'Files_Assigned',align:'left',hidden:true,renderer:diffValues},
    {header:'Files Problematic',sortable:true,dataIndex:'Files_Problematic',align:'left',hidden:true,renderer:diffValues},
    {header:'Files Unused',sortable:true,dataIndex:'Files_Unused',align:'left',hidden:true,renderer:diffValues},
    {header:'Created',sortable:true,dataIndex:'Jobs_Created',align:'left',renderer:diffValues},
    {header:'Submitted',sortable:true,dataIndex:'Jobs_Submitted',align:'left',renderer:diffValues},
    {header:'Waiting',sortable:true,dataIndex:'Jobs_Waiting',align:'left',renderer:diffValues},
    {header:'Running',sortable:true,dataIndex:'Jobs_Running',align:'left',renderer:diffValues},
    {header:'Done',sortable:true,dataIndex:'Jobs_Done',align:'left',renderer:diffValues},
    {header:'Completed',sortable:true,dataIndex:'Jobs_Completed',align:'left',renderer:diffValues},
    {header:'Failed',sortable:true,dataIndex:'Jobs_Failed',align:'left',renderer:diffValues},
    {header:'Stalled',sortable:true,dataIndex:'Jobs_Stalled',align:'left',renderer:diffValues},
    {header:'InheritedFrom',sortable:true,dataIndex:'InheritedFrom',align:'left',hidden:true},
    {header:'GroupSize',sortable:true,dataIndex:'GroupSize',align:'left',hidden:true},
    {header:'FileMask',sortable:true,dataIndex:'FileMask',align:'left',hidden:true},
    {header:'Plugin',sortable:true,dataIndex:'Plugin',align:'left',hidden:true},
    {header:'EventsPerJob',sortable:true,dataIndex:'EventsPerJob',align:'left',hidden:true},
    {header:'MaxNumberOfJobs',sortable:true,dataIndex:'MaxNumberOfJobs',align:'left',hidden:true},
    {header:'AuthorDN',sortable:true,dataIndex:'AuthorDN',align:'left',hidden:true},
    {header:'AuthorGroup',sortable:true,dataIndex:'AuthorGroup',align:'left',hidden:true},
    {header:'Description',sortable:true,dataIndex:'Description',align:'left',hidden:true},
    {header:'LongDescription',sortable:true,dataIndex:'LongDescription',align:'left',hidden:true},
    {header:'CreationDate [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-j H:i'),dataIndex:'CreationDate'},
    {header:'LastUpdate [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-j H:i'),dataIndex:'LastUpdate'}
  ];
  var tbar = [
    {
      cls:"x-btn-text-icon",
      handler:function(){selectAll('all')},
      icon:gURLRoot+'/images/iface/checked.gif',
      text:'Select All',
      tooltip:'Click to select all rows'
    },{
      cls:"x-btn-text-icon",
      handler:function(){selectAll('none')},
      icon:gURLRoot+'/images/iface/unchecked.gif',
      text:'Select None',
      tooltip:'Click to uncheck selected row(s)'
    },
    '->',
    {handler:function(){action('production','start')},text:'Start',tooltip:'Click to start selected production(s)'},
    {handler:function(){action('production','stop')},text:'Stop',tooltip:'Click to kill selected production(s)'},
    {handler:function(){action('production','flush')},text:'Flush',tooltip:'Click to flush selected production(s)'},
    {handler:function(){action('production','complete')},text:'Complete',tooltip:'Click to set selected production(s) as complete'},
    {handler:function(){action('production','clean')},text:'Clean',tooltip:'Click to clean selected production(s)'}
  ];
  var view = new Ext.grid.GroupingView({
    groupTextTpl:'<tpl>{text}</tpl>'
  })
  store.setDefaultSort('TransformationFamily','DESC'); // Default sorting
  var autorefreshMenu = [
    {checked:setChk(900000),checkHandler:function(){setRefresh(900000,store);},group:'refresh',text:'15 Minutes'},
    {checked:setChk(1800000),checkHandler:function(){setRefresh(1800000,store);},group:'refresh',text:'30 Minutes'},
    {checked:setChk(3600000),checkHandler:function(){setRefresh(3600000,store);},group:'refresh',text:'One Hour'},
    {checked:setChk(0),checkHandler:function(){setRefresh(0);},group:'refresh',text:'Disabled'},
  ];
  tableMngr = {'store':store,'columns':columns,'tbar':tbar,'autorefresh':autorefreshMenu,'view':view};
  var t = table(tableMngr);
  t.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('main',table,rowIndex,columnIndex);
  });
  idObject.push(store);
  tableID = t.id;
  return t
}
function setChk(value){
  if(value == refreshRate){
    return true
  }else{
    return false
  } 
}
function setRefresh(time,store){
  var stamp = Ext.getCmp('stampTableButton');
  if(time == 900000 || time == 3600000 || time == 1800000){
    refreshRate = time;
    heartbeat.start({
      run:function(){
        if(tableID != 'tmpID'){
          var table = Ext.getCmp(tableID);
          var bbar = table.getBottomToolbar();
          if(bbar){
            store.baseParams = {'limit':bbar.pageSize,'start':bbar.cursor};
          }
        }
        store.load();
        if(stamp){
          var d = new Date();
          var hh = d.getHours();
          if(hh < 10){
            hh = '0' + hh;
          }
          var mm = d.getMinutes()
          if(mm < 10){
            mm = '0' + mm;
          }
          stamp.setText('Updated: ' + hh + ":" + mm);
          stamp.show();
        }
      },
      interval:time
    });
  }else{
    if(stamp){
      stamp.hide();
    }
    refreshRate = 0;
    heartbeat.stopAll();
  }
}
function renderData(store){
  var leftBar = initSidebar();
  var mainContent = initData(store);
  renderInMainViewport([ leftBar, mainContent ]);
  dataMngr = {'form':leftBar.items.items[0],'store':store}
}

function extendTransformation(id){
  Ext.Msg.prompt('Extend transformation','Please enter the number of tasks',function(btn,tasks){
    if( btn == 'ok'){
      if (tasks){
        Ext.Ajax.request({
          success:function(response){
            var jsonData = Ext.util.JSON.decode(response.responseText);
            if(jsonData['success'] == 'false'){
              alert('Error: ' + jsonData['error']);
              return;
            }else{
              if(jsonData.showResult){
                var html = '';
                for(var i = 0; i < jsonData.showResult.length; i++){
                  html = html + jsonData.showResult[i] + '<br>';
                }
                Ext.Msg.alert('Result:',html);
              }
              if(dataMngr){
                if(dataMngr.store){
                  if(dataMngr.store.autoLoad){
                    if(dataMngr.store.autoLoad.params){
                      if(dataMngr.store.autoLoad.params.limit){
                        dataMngr.store.load({params:{start:0,limit:dataMngr.store.autoLoad.params.limit}});
                      }
                    }
                  }
                }
              }
            }
          },
          failure:function(response){
            AJAXerror(response.responseText)
          },
          method:'POST',
          params:{'extend':id,'tasks':tasks},
          url:'action'
        })
      }else{
        this.hide();
      }
    }else{
      this.hide();
    }
  });   
}  

function setMenuItems(selections){
  if(selections){
    var id = selections.TransformationID;
    var status = selections.Status;
    var submited = selections.Jobs_Submitted;
    var family = selections.TransformationFamily;
    var type = selections.Type;
  }else{
    return
  }
  var subMenu = [
    {handler:function(){action('production','start',id)},text:'Start'},
    {handler:function(){action('production','stop',id)},text:'Stop'},
    {handler:function(){extendTransformation(id)},text:'Extend'},
    {handler:function(){action('production','flush',id)},text:'Flush'},
    {handler:function(){action('production','complete',id)},text:'Complete'},
    {handler:function(){action('production','clean',id)},text:'Clean'},
  ];
  var subMenu1 = [
    {handler:function(){AJAXrequest('fileProcessed',id)},text:'Processed'},
    {handler:function(){AJAXrequest('fileNotProcessed',id)},text:'Not Processed'},
    {handler:function(){AJAXrequest('fileAllProcessed',id)},text:'All'},
  ];
  if(dirac.menu){
    dirac.menu.add(
      {handler:function(){jump('job',id,submited)},text:'Show Jobs'},
      {handler:function(){jump('request',family,1)},text:'Show Request'},
      {handler:function(){AJAXrequest('log',id)},text:'Logging Info'},
      {handler:function(){runStatus(id)},text:'Run Status'},
      {handler:function(){AJAXrequest('fileStat',id)},text:'File Status'},
      {text:'File Retries',menu:({items:subMenu1})},
      {handler:function(){AJAXrequest('dataQuery',id)},text:'Input Data Query'},
      {handler:function(){AJAXrequest('additionalParams',id)},text:'Additional Params'},
      {handler:function(){AJAXrequest('elog',id)},text:'Show Details'},
      '-',
      {text:'Actions',menu:({items:subMenu})}
    );
  }
  if(status == 'Active'){
    dirac.menu.items.items[10].menu.items.items[1].enable();
    dirac.menu.items.items[10].menu.items.items[0].disable();
  }else if(status == 'New'){
    dirac.menu.items.items[10].menu.items.items[1].disable();
    dirac.menu.items.items[10].menu.items.items[0].enable();
  }else{
    dirac.menu.items.items[10].menu.items.items[1].disable();
    dirac.menu.items.items[10].menu.items.items[0].enable();
  }
  if(type == 'MCSimulation'){
    dirac.menu.items.items[4].disable();
    dirac.menu.items.items[5].disable();
    dirac.menu.items.items[6].disable();
  }
  if((type != 'DataReconstruction')&&(type != 'DataStripping')&&(type != 'Replication')&&( type != 'Merge') ){
    dirac.menu.items.items[3].disable();
  }
};

function AJAXsuccess(value,id,response){
  try{
    gMainLayout.container.unmask();
  }catch(e){}
  var jsonData = Ext.util.JSON.decode(response);
  if(jsonData['success'] == 'false'){
    alert('Error: ' + jsonData['error']);
    return
  }
  var result = jsonData.result;
  if(value == 'log'){
    var reader = {};
    var columns = [];
    reader = new Ext.data.ArrayReader({},[
      {name:'message'},
      {name:'author'},
      {name:'date',type:'date',dateFormat:'Y-n-j H:i:s'}
    ]);
    columns = [
        {header:'Message',sortable:true,dataIndex:'message',align:'left'},
        {header:'Date [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-j h:i'),dataIndex:'date'},
        {header:'Author',sortable:true,dataIndex:'author',align:'left'}
    ];
    var store = new Ext.data.Store({
      data:result,
      reader:reader
    }),
    panel = new Ext.grid.GridPanel({
      columns:columns,
      store:store,
      stripeRows:true,
      viewConfig:{forceFit:true}
    });
    panel.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('nonMain',table,rowIndex,columnIndex);
    });
  }else if((value == 'additionalParams')||(value == 'dataQuery')){
    var reader = new Ext.data.ArrayReader({},[
      {name:'name'},
      {name:'value'}
    ]);
    var columns = [
      {header:'Name',sortable:true,dataIndex:'name',align:'left'},
      {header:'Value',sortable:true,dataIndex:'value',align:'left'}
    ];
    var store = new Ext.data.Store({
      data:result,
      reader:reader
    }),
    panel = new Ext.grid.GridPanel({
      columns:columns,
      store:store,
      stripeRows:true,
      viewConfig:{forceFit:true}
    });
    panel.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('nonMain',table,rowIndex,columnIndex);
    });
  }else if((value == 'fileStat') || (value == 'fileProcessed') || (value == 'fileNotProcessed') || (value == 'fileAllProcessed')){
    var reader = {};
    var columns = [];
    reader = new Ext.data.ArrayReader({},[
      {name:'status'},
      {name:'count'},
      {name:'percent'}
    ]);
    if(value == 'fileStat'){
      columns = [
        {header:'Status',sortable:true,dataIndex:'status',align:'left'},
        {header:'Count',sortable:true,dataIndex:'count',align:'left'},
        {header:'Percentage',sortable:true,dataIndex:'percent',align:'left'}
      ];
    }else{
      columns = [
        {header:'Retries',sortable:true,dataIndex:'status',align:'left'},
        {header:'Count',sortable:true,dataIndex:'count',align:'left'},
        {header:'Percentage',sortable:true,dataIndex:'percent',align:'left'}
      ];
    }
    var store = new Ext.data.Store({
      data:result,
      reader:reader 
    }),
    panel = new Ext.grid.GridPanel({
      columns:columns,
      store:store,
      stripeRows:true,
      viewConfig:{forceFit:true}
    });
    panel.addListener('cellclick',function(table,rowIndex,columnIndex){
      if(value == 'fileStat'){
        var record = table.getStore().getAt(rowIndex); // Get the Record for the row
        try{
          if(record.data.status){
            var stat = record.data.status;
          }
        }catch(e){
          return
        }
        var columnName = table.getColumnModel().getColumnId(columnIndex); // Get the name for the column
        var fieldName = table.getColumnModel().getDataIndex(columnIndex); // Get field name for the column
        if(record.data){
          var v = record.get(fieldName);
        }
        var coords = Ext.EventObject.xy;
        var menu = new Ext.menu.Menu();
        menu.add(
          {handler:function(){showFileStat(stat,id)},text:'Show Files'},
          '-',
          {handler:function(){Ext.Msg.minWidth = 360;Ext.Msg.alert('Cell value is:',v);},text:'Show value'}
        );
        menu.showAt(coords);
      }else{
        showMenu('nonMain',table,rowIndex,columnIndex);
      }
    });
  }else if(value == 'elog'){
    var html = '<pre>' + result + '</pre>';
    panel = new Ext.Panel({border:0,autoScroll:true,html:html,layout:'fit'})
  }
  var titleID = 'Production: ' + id;
  displayWin(panel,titleID)
}
function jump(type,id,submited){
  if(submited == 0){
    alert('Nothing to display');
    return
  }
  if(type == 'request'){
    var url = document.location.protocol + '//' + document.location.hostname + gURLRoot + '/' + gPageDescription.selectedSetup;
    var hash = DEncode.encode( {'idF':id} );
    url = url + '/' + gPageDescription.userData.group + '/Production/ProductionRequest/display#' + hash;
  }else if(type == 'run'){
    var url = document.location.protocol + '//' + document.location.hostname + gURLRoot + '/' + gPageDescription.selectedSetup;
    url = url + '/' + gPageDescription.userData.group + '/jobs/JobMonitor/display?runNumber=' + id;
  }else{
    var url = document.location.protocol + '//' + document.location.hostname + gURLRoot + '/' + gPageDescription.selectedSetup;
    url = url + '/' + gPageDescription.userData.group + '/jobs/JobMonitor/display?prod=' + id;
  }
  window.open(url)
}
function afterDataLoad(){
  var msg = [];
  if(dataMngr){
    if(dataMngr.store){
      if(dataMngr.store.extra_msg){
         msg = dataMngr.store.extra_msg;
      }
    }
  }
  var statPanel = Ext.getCmp('statGrid');
  if((statPanel)&&(msg)){
    var data = [];
    var j = 0;
    for( var i in msg ){
      data[j] = [i,msg[i]];
      j = j + 1;
    }
    statPanel.store.loadData(data);
  }
}
function showFileStat(stat,id){
  var params = {'getFileStatus':stat,'prodID':id};
  var title = 'Files with status ' + stat + ' for production: ' + id;
  var record = new Ext.data.Record.create([
    {name:'LFN'},
    {name:'TransformationID'},
    {name:'FileID'},
    {name:'Status'},
    {name:'TaskID'},
    {name:'TargetSE'},
    {name:'UsedSE'},
    {name:'ErrorCount'},
    {name:'LastUpdate',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'InsertedTime',type:'date',dateFormat:'Y-n-j H:i:s'}
  ]);
  var columns = [
    {header:'LFN',sortable:true,dataIndex:'LFN',align:'left'},
    {header:'TransformationID',sortable:true,dataIndex:'TransformationID',align:'left'},
    {header:'FileID',sortable:true,dataIndex:'FileID',align:'left'},
    {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
    {header:'TaskID',sortable:true,dataIndex:'TaskID',align:'left'},
    {header:'TargetSE',sortable:true,dataIndex:'TargetSE',align:'left'},
    {header:'UsedSE',sortable:true,dataIndex:'UsedSE',align:'left'},
    {header:'ErrorCount',sortable:true,dataIndex:'ErrorCount',align:'left'},
    {header:'LastUpdate',sortable:true,dataIndex:'LastUpdate',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
    {header:'InsertedTime',sortable:true,dataIndex:'InsertedTime',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
  ];
  var store = initStore(record,{'url':'showFileStatus','params':params});
  store.removeListener('beforeload',storeLoadFunction);
  var tableMngr = {'store':store,'columns':columns,'id':'fileStatusTable'};
  var panel = table(tableMngr);
  panel.addListener('cellclick',function(table,rowIndex,columnIndex){
    showMenu('nonMain',table,rowIndex,columnIndex);
  });
  var win = displayWin(panel,title,true);
  win.setWidth(600);
}
function runStatus(id){
  var params = {'getRunStatus':id};
  var title = 'Run status for production: ' + id;
  var record = new Ext.data.Record.create([
    {name:'Status'},
    {name:'StatusIcon',mapping:'Status'},
    {name:'TransformationID'},
    {name:'LastUpdate',type:'date',dateFormat:'Y-n-j H:i:s'},
    {name:'Files_PercentProcessed',type:'float'},
    {name:'Files_Total'},
    {name:'Files_Assigned'},
    {name:'RunNumber'},
    {name:'SelectedSite'},
    {name:'Files_Processed'},
    {name:'Files_Unused'},
    {name:'Files_Problematic'}
  ]);
// Make a processed counter like bar
  var columns = [
    {header:'RunNumber',sortable:true,dataIndex:'RunNumber',align:'left'},
    {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
    {header:'Status',sortable:true,dataIndex:'Status',align:'left'},
    {header:'SelectedSite',sortable:true,dataIndex:'SelectedSite',align:'left'},
    {header:'Files',sortable:true,dataIndex:'Files_Total',align:'left',renderer:diffRuns},
    {header:'Processed (%)',sortable:true,dataIndex:'Files_PercentProcessed',align:'left',renderer:diffRuns},
    {header:'Unused',sortable:true,dataIndex:'Files_Unused',align:'left',renderer:diffRuns},
    {header:'Assigned',sortable:true,dataIndex:'Files_Assigned',align:'left',renderer:diffRuns},
    {header:'Processed',sortable:true,dataIndex:'Files_Processed',align:'left',renderer:diffRuns},
    {header:'Problematic',sortable:true,dataIndex:'Files_Problematic',align:'left',renderer:diffRuns},
    {header:'LastUpdate',sortable:true,dataIndex:'LastUpdate',align:'left',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
  ];
  var store = initStore(record,{'url':'showRunStatus','params':params});
  store.removeListener('beforeload',storeLoadFunction);
  runObject = {}
  store.addListener('beforeload',function(store){
    if(store.totalLength){
      for(var i = 0; i < store.totalLength; i++){
        var record = store.getAt(i);
        try{
          runObject[record.data.RunNumber] = {};
          runObject[record.data.RunNumber]['Files_Total'] = record.data['Files_Total'];
          runObject[record.data.RunNumber]['Files_PercentProcessed'] = record.data['Files_PercentProcessed'];
          runObject[record.data.RunNumber]['Files_Unused'] = record.data['Files_Unused'];
          runObject[record.data.RunNumber]['Files_Assigned'] = record.data['Files_Assigned'];
          runObject[record.data.RunNumber]['Files_Processed'] = record.data['Files_Processed'];
          runObject[record.data.RunNumber]['Files_Problematic'] = record.data['Files_Problematic'];
        }catch(e){}
      }
    }
  });
  function diffRuns(value,metaData,record,rowIndex,colIndex,store){
    var id = record.data.RunNumber;
    if(id && runObject[id]){
      var name = this.name;
      try{
        var diff = value - runObject[id][name];
        var test = diff + '';
        if(test.indexOf(".") > 0){
          diff = diff.toFixed(1);
        }
        if(diff > 0){
          return value + ' <font color="#00CC00">(+' + diff + ')</font>';
        }else if(diff < 0){
          return value + ' <font color="#FF3300">(' + diff + ')</font>';
        }else{
          return value;
        }
      }catch(e){
        return value;
      }
    }else{
      return value;
    }
  }
  var gridID = Ext.id();
  var tableMngr = {'store':store,'columns':columns,'id':gridID};
  var panel = table(tableMngr);
  panel.addListener('cellclick',function(table,rowIndex,columnIndex){
    var record = table.getStore().getAt(rowIndex); // Get the Record for the row
    try{
      if(record.data.RunNumber){
        var runID = record.data.RunNumber;
        run = runID + '&prod=' + id;
      }
    }catch(e){
      return
    }
    var columnName = table.getColumnModel().getColumnId(columnIndex); // Get the name for the column
    var fieldName = table.getColumnModel().getDataIndex(columnIndex); // Get field name for the column
    if(record.data){
      var v = record.get(fieldName);
      try{
        v = v.format('l, \\t\\he jS \\of F Y H:i [\\U\\TC]');
      }catch(e){}
    }
    var coords = Ext.EventObject.xy;
    var menu = new Ext.menu.Menu();
    var siteMenu = [
      {handler:function(){setSite(id,runID,'LCG.CERN.ch',table.store)},text:'LCG.CERN.ch'},
      {handler:function(){setSite(id,runID,'LCG.CNAF.it',table.store)},text:'LCG.CNAF.it'},
      {handler:function(){setSite(id,runID,'LCG.GRIDKA.de',table.store)},text:'LCG.GRIDKA.de'},
      {handler:function(){setSite(id,runID,'LCG.IN2P3.fr',table.store)},text:'LCG.IN2P3.fr'},
      {handler:function(){setSite(id,runID,'LCG.NIKHEF.nl',table.store)},text:'LCG.NIKHEF.nl'},
      {handler:function(){setSite(id,runID,'LCG.PIC.es',table.store)},text:'LCG.PIC.es'},
      {handler:function(){setSite(id,runID,'LCG.RAL.uk',table.store)},text:'LCG.RAL.uk'},
      {handler:function(){setSite(id,runID,'LCG.SARA.nl',table.store)},text:'LCG.SARA.nl'}
    ];
    menu.add(
      {handler:function(){jump('run',run,1)},text:'Show Jobs'},
      {handler:function(){setRunStatus('Flush',id,runID,table.store)},text:'Flush'},
      {menu:({items:siteMenu}),text:'Set Site'},
      '-',
      {handler:function(){Ext.Msg.minWidth = 360;Ext.Msg.alert('Cell value is:',v);},text:'Show value'}
    );
    menu.showAt(coords);
  });
  idObject.push(store);
//  idObject.push(panel.id);
  var win = displayWin(panel,title,false);
  win.setWidth(600);
}
function setSite(prodID,runID,site,store){
  x = getT1();
  var title = 'Set Site ' + site;
  var msg = 'Are you sure you want to set site ' + site + ' for the run ' + runID + ' in production ' + prodID + ' ?';
  Ext.Msg.confirm(title,msg,function(btn){
    if(btn == 'yes'){
      var params = {'setSite':'True','runID':runID,'prodID':prodID,'site':site};
      Ext.Ajax.request({
        failure:function(response){
          AJAXerror(response.responseText);
        },
        method:'POST',
        params:params,
        success:function(response){
          store.load();
        },
        url:'action'
      });
    }
  });
}
function setRunStatus(status,prodID,runID,store){
  var title = 'Flush ' + runID;
  var msg = 'Are you sure you want to ' + status + ' this run: ' + runID + ' ?';
  Ext.Msg.confirm(title,msg,function(btn){
    if(btn == 'yes'){
      var params = {'setRunStatus':'True','runID':runID,'prodID':prodID,'status':status};
      Ext.Ajax.request({
        failure:function(response){
          AJAXerror(response.responseText);
        },
        method:'POST',
        params:params,
        success:function(response){
          store.load();
        },
        url:'action'
      });
    }
  });
}
function getT1(){
  Ext.Ajax.request({
    failure:function(response){
      AJAXerror(response.responseText);
    },
    method:'POST',
    params:{'getT1':'True'},
    success:function(response){
      var jsonData = Ext.util.JSON.decode(response.responseText);
      if(jsonData['success'] == 'false'){
        alert('Error: ' + jsonData['error']);
        return;
      }else{
        var tier1 = jsonData['result'].split(', ');
        return tier1
      }
    },
    url:'action'
  });
}

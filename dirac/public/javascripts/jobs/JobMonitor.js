var dataSelect = ''; // Required to store the data for filters fields. Object.
var dataMngr = ''; // Required to connect form and table. Object.
var tableMngr = ''; // Required to handle configuration data for table. Object.
// Main routine
function initJobMonitor(reponseSelect){
  dataSelect = reponseSelect;
  var record = initRecord();
  var store = initStore(record);
  Ext.onReady(function(){
    renderData(store);
  });
}
// function describing data structure, should be individual per page
function initRecord(){
  var record = new Ext.data.Record.create([
    {name:'SystemPriority', type: 'float'},
    {name:'ApplicationNumStatus'},
    {name:'JobID', type: 'float'},
    {name:'LastSignOfLife',type:'date',dateFormat:'Y-n-j h:i:s'},
    {name:'VerifiedFlag'},
    {name:'RetrievedFlag'},
    {name:'Status'},
    {name:'StartExecTime',type:'date',dateFormat:'Y-n-j h:i:s'},
    {name:'RescheduleCounter'},
    {name:'JobSplitType'},
    {name:'MinorStatus'},
    {name:'ApplicationStatus'},
    {name:'SubmissionTime',type:'date',dateFormat:'Y-n-j h:i:s'},
    {name:'JobType'},
    {name:'MasterJobID'},
    {name:'KilledFlag'},
    {name:'RescheduleTime'},
    {name:'DIRACSetup'},
    {name:'FailedFlag'},
    {name:'CPUTime'},
    {name:'OwnerDN'},
    {name:'JobGroup'},
    {name:'JobName'},
    {name:'AccountedFlag'},
    {name:'OSandboxReadyFlag'},
    {name:'LastUpdateTime',type:'date',dateFormat:'Y-n-j h:i:s'},
    {name:'Site'},
    {name:'HeartBeatTime',type:'date',dateFormat:'Y-n-j h:i:s'},
    {name:'OwnerGroup'},
    {name:'ISandboxReadyFlag'},
    {name:'UserPriority'},
    {name:'Owner'},
    {name:'DeletedFlag'},
    {name:'TaskQueueID'},
    {name:'JobType'},
    {name:'JobIDcheckBox',mapping:'JobID'},
    {name:'StatusIcon',mapping:'Status'},
    {name:'OwnerGroup'}
  ]);
  return record
}
// Initialisation of selection sidebar, all changes with selection items should goes here
function initSidebar(){
  var siteSelect = selectSiteMenu(); // Initializing Site Menu
  var ownerSelect = selectOwnerMenu(); // Initializing Owner Menu
  var appSelect = selectAppMenu(); // Initializing Application status Menu
  var statSelect = selectStatusMenu(); // Initializing JobStatus Menu
  var minSelect = selectMinorStatus(); // Initializing Minor Status Menu
  var prodSelect = selectProdMenu(); // Initializing JobGroup Menu
  var id = selectID(); // Initialize field for JobIDs
  var dateSelect = dateTimeWidget(); // Initializing date dialog
  var select = selectPanel(); // Initializing container for selection objects
  // Insert object to container BEFORE buttons:
  select.insert(0,siteSelect);
  select.insert(1,statSelect);
  select.insert(2,minSelect);
  select.insert(3,appSelect);
  select.insert(4,ownerSelect);
  select.insert(5,prodSelect);
  select.insert(6,id);
  select.insert(7,dateSelect);
  var sortGlobal = sortGlobalPanel(); // Initializing the global sort panel
  var stat = statPanel('Current Statistics','current','statGrid');
  var glStat = statPanel('Global Statistics','global','glStatGrid');
  var bar = sideBar();
  bar.insert(0,select);
  bar.insert(1,sortGlobal);
  bar.insert(2,stat);
  bar.insert(3,glStat);
  bar.setTitle('JobMonitoring');
  return bar
}
function initData(store){
  var columns = [
    {header:'',name:'checkBox',id:'checkBox',width:26,sortable:false,dataIndex:'JobIDcheckBox',renderer:chkBox,hideable:false,fixed:true,menuDisabled:true},
    {header:'JobId',sortable:true,dataIndex:'JobID',align:'left',hideable:false},
    {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
    {header:'Status',width:60,sortable:true,dataIndex:'Status',align:'left'},
    {header:'MinorStatus',sortable:true,dataIndex:'MinorStatus',align:'left'},
    {header:'ApplicationStatus',sortable:true,dataIndex:'ApplicationStatus',align:'left'},
    {header:'Site',sortable:true,dataIndex:'Site',align:'left'},
    {header:'JobName',sortable:true,dataIndex:'JobName',align:'left'},
    {header:'LastUpdate [UTC]',sortable: true,renderer:Ext.util.Format.dateRenderer('Y-m-d H:i'),dataIndex:'LastUpdateTime'},
    {header:'LastSignOfLife [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-d H:i'),dataIndex:'LastSignOfLife'},
    {header:'SubmissionTime [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-d H:i'),dataIndex:'SubmissionTime'},
    {header:'DIRACSetup',sortable:true,dataIndex:'DIRACSetup',align:'left',hidden:true},
    {header:'FailedFlag',sortable:true,dataIndex:'FailedFlag',align:'left',hidden:true},
    {header:'CPUTime',sortable:true,dataIndex:'CPUTime',align:'left',hidden:true},
    {header:'OwnerDN',sortable:true,dataIndex:'OwnerDN',align:'left',hidden:true},
    {header:'JobGroup',sortable:true,dataIndex:'JobGroup',align:'left',hidden:true},
    {header:'JobType',sortable:true,dataIndex:'JobType',align:'left',hidden:true},
    {header:'AccountedFlag',sortable:true,dataIndex:'AccountedFlag',align:'left',hidden:true},
    {header:'OSandboxReadyFlag',sortable:true,dataIndex:'OSandboxReadyFlag',align:'left',hidden:true},
    {header:'Owner',sortable:true,dataIndex:'Owner',align:'left'},
    {header:'TaskQueueID',sortable:true,dataIndex:'TaskQueueID',align:'left',hidden:true},
    {header:'OwnerGroup',sortable:true,dataIndex:'OwnerGroup',align:'left',hidden:true}
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
    },'->',{
      cls:"x-btn-text-icon",
      handler:function(){action('job','kill')},
      icon:gURLRoot+'/images/iface/close.gif',
      text:'Kill',
      tooltip:'Click to kill selected job(s)'
    },{
      cls:"x-btn-text-icon",
      handler:function(){action('job','delete')},
      icon:gURLRoot+'/images/iface/delete.gif',
      text:'Delete',
      tooltip:'Click to delete selected job(s)'
    }
  ];
  try{
    if(gPageDescription.userData.group == 'diracAdmin'){
      var resetButton = {
        handler:function(){action('job','reset')},
        text:'Reset',
        tooltip:'Click to reset selected job(s)'
      };
      var a = tbar.slice(), b = a.splice( 3 );
      a[3] = resetButton;
      tbar = a.concat( b );
    }
  }catch(e){}
  try{
    if(gPageDescription.userData.group != 'lhcb_prod'){
      var rescheduleButton = {
        cls:"x-btn-text-icon",
        handler:function(){action('job','reschedule')},
        icon:gURLRoot+'/images/iface/reschedule.gif',
        text:'Reschedule',
        tooltip:'Click to reschedule selected job(s)'
      };
      if(gPageDescription.userData.group == 'diracAdmin'){
        var a = tbar.slice(), b = a.splice( 4 );
        a[4] = rescheduleButton;
      }else{
        var a = tbar.slice(), b = a.splice( 3 );
        a[3] = rescheduleButton;
      }
      tbar = a.concat( b );
    }
  }catch(e){}
  store.setDefaultSort('JobID','DESC'); // Default sorting
  tableMngr = {'store':store,'columns':columns,'tbar':tbar};
  var t = table(tableMngr);
  t.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('main',table,rowIndex,columnIndex);
  });
  var arrayID = new Array();
  t.on('headerclick',function(){
    arrayID = [];
    var inputs = document.getElementsByTagName('input');
    if(inputs.length > 0){
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type && inputs[i].type == 'checkbox'){
          if(inputs[i].checked){
            arrayID.push(inputs[i].id);
          }
        }
      }
    }
  });
  t.on('sortchange',function(){
    if(arrayID.length > 0){
      var length = arrayID.length;
      for(var i = 0; i < length; i++){
        var j = arrayID.shift();
        document.getElementById(j).checked = true;
      }
    }
  });
  return t
}
function renderData(store){
  var leftBar = initSidebar();
  var mainContent = initData(store);
  renderInMainViewport([ leftBar, mainContent ]);
  dataMngr = {'form':leftBar.items.items[0],'store':store}
  addMenu();
}
function addMenu(){
  var topBar = Ext.getCmp('diracTopBar');
  if(topBar){
    var button = new Ext.Toolbar.Button({
      text:'Tools',
      menu:[
//        {handler:function(){submitJobNew()},text:'Job Launchpad'},
//        {handler:function(){launchJob()},text:'Launchpad in progress'},
        {handler:function(){showURL()},text:'Full URL'},
        {menu:{items:[
          {handler:function(){showJobID(', ')},text:'Comma separated'},
          {handler:function(){showJobID('; ')},text:'Semicolon separated'}
        ]},text:'Show selected JobIDs'}
      ]
    });
    topBar.insertButton(6,button);
  }
}
function setMenuItems(selections){
  if(selections){
    var id = selections.JobID;
    var status = selections.Status;
  }else{
    return
  }
  if(dirac.menu){
    dirac.menu.add(
      {handler:function(){AJAXrequest('getJDL',id)},text:'JDL'},
      '-',
      {handler:function(){AJAXrequest('getBasicInfo',id)},text:'Attributes'},
      {handler:function(){AJAXrequest('getParams',id)},text:'Parameters'},
      {handler:function(){AJAXrequest('LoggingInfo',id)},text:'Logging info'},
      '-',
      {handler:function(){AJAXrequest('getStandardOutput',id)},text:'Peek StandardOutput'},
      {handler:function(){AJAXrequest('LogURL',id)},text:'Get LogFile'},
      {handler:function(){AJAXrequest('getPending',id)},text:'Get PendingRequest'},
      {handler:function(){AJAXrequest('getStagerReport',id)},text:'Get StagerReport'},
      {text:'Get Sandbox',icon:gURLRoot + '/images/iface/addfile.gif',menu:({items:[
         {handler:function(){showInputSandbox(id,'Input')},text:'Input'},
         {handler:function(){showInputSandbox(id,'Output')},text:'Output'},
       ]})},
      '-',
      {text:'Actions',icon:gURLRoot + '/images/iface/action.gif',menu:({items:[
        {handler:function(){action('job','kill',id)},icon:gURLRoot + '/images/iface/close.gif',text:'Kill'},
        {handler:function(){action('job','delete',id)},icon:gURLRoot + '/images/iface/delete.gif',text:'Delete'}
      ]})},
      {text:'Pilot', menu:({items:[
        {handler:function(){AJAXrequest('pilotStdOut',id)},text:'Get StdOut'},
        {handler:function(){AJAXrequest('pilotStdErr',id)},text:'Get StdErr'}
      ]})}
    );
    if(gPageDescription.userData.group != 'lhcb_prod'){
      var reset = new Ext.menu.Item({handler:function(){action('job','reset',id)},text:'Reset'});
      var reschedule = new Ext.menu.Item({handler:function(){action('job','reschedule',id)},icon:gURLRoot + '/images/iface/reschedule.gif',text:'Reschedule'});
      if(gPageDescription.userData.group == 'diracAdmin'){
        dirac.menu.items.items[12].menu.insert(0,reset);
        dirac.menu.items.items[12].menu.insert(1,reschedule);
      }else{
        dirac.menu.items.items[12].menu.insert(0,reschedule);
      }
    }
    if((status == 'Done')||(status == 'Completed')||(status == 'Failed')){
      dirac.menu.items.items[10].menu.items.items[1].enable();
    }else{
      dirac.menu.items.items[10].menu.items.items[1].disable();
    }
    if((status == 'Done')||(status == 'Failed')){
      dirac.menu.items.items[9].enable();
    }else{
      dirac.menu.items.items[9].disable();
    }
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
  var panel = {};
  if((value == 'getJDL')||(value == 'getStandardOutput')||(value == 'pilotStdOut')||(value == 'pilotStdErr')||(value == 'getStagerReport')){
    var html = '<pre>' + result + '</pre>';
    panel = new Ext.Panel({border:0,autoScroll:true,html:html,layout:'fit'})
  }else if(value == 'LogURL'){
    result = result.replace(/"/g,"");
    result = result.replace(/\\/g,"");
    var html = '<iframe id="www_frame" src =' + result + '></iframe>';
    panel = new Ext.Panel({border:0,autoScroll:false,html:html});
    panel.on('resize',function(){
      var wwwFrame = document.getElementById('www_frame');
      wwwFrame.height = panel.getInnerHeight() - 4;
      wwwFrame.width = panel.getInnerWidth() - 4;
    })
  }else{
    var reader = {};
    var columns = [];
    if((value == 'getBasicInfo')||(value == 'getParams')){
      reader = new Ext.data.ArrayReader({},[
        {name:'name'},
        {name:'value'}
      ]);
      columns = [
        {header:'Name',sortable:true,dataIndex:'name',align:'left'},
        {header:'Value',sortable:true,dataIndex:'value',align:'left'}
      ];
    }else if(value == 'getPending'){
      reader = new Ext.data.ArrayReader({},[
        {name:'type'},
        {name:'operation'},
        {name:'status'},
        {name:'order'},
        {name:'targetSE'},
        {name:'file'}
      ]);
      columns = [
        {header:'Type',sortable:true,dataIndex:'type',align:'left'},
        {header:'Operation',sortable:true,dataIndex:'operation',align:'left'},
        {header:'Status',sortable:true,dataIndex:'status',align:'left'},
        {header:'Order',sortable:true,dataIndex:'order',align:'left'},
        {header:'Targert SE',sortable:true,dataIndex:'targetSE',align:'left'},
        {header:'File',sortable:true,dataIndex:'file',align:'left'}
      ];
      var mark = 0;
      for(var i = 0; i < result.length; i++){
        if(result[i][0] == 'PendingRequest'){
          var intermed = result[i][1].split('\n');
          mark = 1;
        }
      }
      if(mark == 0){
        alert('Error: No pending request(s) found');
        return
      }else{
        for(var j = 0; j < intermed.length; j++){
          intermed[j] = intermed[j].split(':');
        }
        result = intermed;
      }
    }else if(value == 'LoggingInfo'){
      reader = new Ext.data.ArrayReader({},[
        {name:'status'},
        {name:'minorstatus'},
        {name:'applicationstatus'},
        {name:'datetime',type:'date',dateFormat:'Y-n-j h:i:s'},
        {name:'source'}
      ]);
      columns = [
        {header:'Source',sortable:true,dataIndex:'source',align:'left'},
        {header:'Status',sortable:true,dataIndex:'status',align:'left'},
        {header:'MinorStatus',sortable:true,dataIndex:'minorstatus',align:'left'},
        {header:'ApplicationStatus',sortable:true,dataIndex:'applicationstatus',align:'left'},
        {header:'DateTime',sortable:true,dataIndex:'datetime',align:'left'}
      ];
    }
    var store = new Ext.data.Store({
      data:result,
      reader:reader
    });
    panel = new Ext.grid.GridPanel({
      anchor:'100%',
      columns:columns,
      store:store,
      stripeRows:true,
      viewConfig:{forceFit:true}
    });
    panel.addListener('cellclick',function(table,rowIndex,columnIndex){
      showMenu('nonMain',table,rowIndex,columnIndex);
    });
  }
  id = setTitle(value,id);
  displayWin(panel,id);
}
function showInputSandbox(id,type){
  var setup = gPageDescription.selectedSetup;
  var group = gPageDescription.userData.group;
  window.open('https://volhcb12.cern.ch/DIRAC/'+setup+'/'+group+'/jobs/JobAdministrator/getSandbox?jobID='+id+'&sandbox='+type,'Input Sandbox file','width=400,height=200')
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
    msg = createStateMatrix(msg);
    statPanel.store.loadData(msg);
  }
}

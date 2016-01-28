define(['jQuery', 
  'Backbone', 
  'homeModel', 
  'boardModel', 
  'missionStatementModel', 
  'contactUsModel', 
  'affiliationsModel', 
  'membershipApplicationModel', 
  'newsModel', 
  'meetingsModel',
  'eventsModel',  
  'interestGroupsModel',  
  'scholarshipsModel',  
  'util', 
  'regEx', 
  'basePath', 
  'exception'], 
  function($, 
    Backbone, 
    homeModel, 
    boardModel, 
    missionStatementModel, 
    contactUsModel, 
    affiliationsModel, 
    membershipApplicationModel,
    newsModel,
    meetingsModel,
    eventsModel,
    interestGroupsModel,
    scholarshipsModel,
    util, 
    regEx, 
    basePath, 
    exception, 
    undefined){

  'use strict';
  var w = window, d = document;
  var Collection = Backbone.Collection.extend({});
  var _View = Backbone.View.extend({
    collection:new Collection(),
    el:'div',
    model:null,
    nav:{
        id:[],
        data:[],
        tagsXml:[],
        tagsXmlChildsCommon:[],
        modelCid:[],
        templateId:[]
    },
    imagesToPreload:[
      'images/BookSaleFor2016_2015Nov04.png',
      'images/bridgeBigCenter.png'
    ],
    events:{ // events depends on defining _View.el 
      'click #navBarTop':'listenerNavBar',
      'click #headColRightLogo, #cfuwAddressURL':'listenerOpenSmallWindow',
      'click #footerTopRow ul li':'listenerNavFooter',
      'click #btnFormContactUsSend':'listenerFormSubmit'
    },       
    newWindow:0,
    selectorViewContainer:'#boardMembers',
    idViewContainer:'boardMembers',
    $nodeViewContainer:null, // assigned during initialize
    selectorViewTitle:'#pageTitle',
    $nodeViewTitle:null,
    selectorViewNavBar:'#navBarTop',
    $nodeViewNavBar:null,
    idViewTitle:'pageTitle',
    selectorViewCfuwBackground:'#pageBackgroundImage',
    selectorViewPageTitle:'#templatePageTitle',
    $nodeViewPageTitle:null,
    $nodeViewCfuwBackground:null,
    cssClassBackgroundOpacity:'jsOpacity',
    cssClassShowBookSale:'jsBookSale',
    cssClassWhiteBackground:'jsCfuwBackgroundColor',
    blnSetBackgroundOpacity:false,
    blnSetBackgroundWhite:false,
    blnSetCfuwCascadingTopBackground:false,
    initialize:function(options){ // initialize application's instance vars
      var hash = options; 
      this.$nodeViewContainer = $(this.selectorViewContainer);
      this.$nodeViewCfuwBackground = $(this.selectorViewCfuwBackground);
      this.$nodeViewPageTitle = $(this.selectorViewPageTitle);

      for(var name in hash){ // initilize _View mappings. Format JSON from XML
        this.nav.id.push(hash[name].control);
        this.nav.data.push(hash[name].data);     
        this.nav.modelCid.push(hash[name].modelCid);
        !!hash[name].tagsXml ? this.nav.tagsXml.push(hash[name].tagsXml) : '';          
        !!hash[name].tagsXmlChildsCommon ? this.nav.tagsXmlChildsCommon.push(hash[name].tagsXmlChildsCommon) : '';
        !!hash[name].templateId ? this.nav.templateId.push(hash[name].templateId) : '';
      }

      this.setCustomListeners({
        id:'boardMembers',
        nameEvent:'http:response',
        fncListener:this.listenerEmailSuccess
      });
      this.preLoadResources();
      this.setRelativeToDomain({id:'linkStylesheet', attribute:'href', domains:['CFUW_Dev', '127.0.0.1']});     
    },
    preLoadResources:function(){
      var imagePaths = this.imagesToPreload;           
      var images = [];      
      for(var i = 0, len = imagePaths.length; i < len; i++){
        images[i] = new Image();
        images[i].src = imagePaths[i];
      }
    },
    setRelativeToDomain:function(options){
      var strNodeId = options.id;
      var arrayDomains= options.domains;
      var strAttribute= options.attribute;
      var strDomain = w.location.toString();
      var strAttributeHref = null;
      var nodeLinkStylesheet = null;
      var blnInDomainList = false;

      for(var i = 0, len = arrayDomains.length; i < len; i++){
        blnInDomainList = regEx.fnc.blnIsInString(strDomain, arrayDomains[i]);
        if(blnInDomainList === true){
          break; // optimization: found match exit for
        }
      }
      
      if(blnInDomainList){ // default in index.html is minified.css
        nodeLinkStylesheet = d.getElementById(strNodeId);
        strAttributeHref = nodeLinkStylesheet.getAttribute(strAttribute);
        strAttributeHref = regEx.fnc.strReplace(strAttributeHref, 'minified', 'styles'); 
        nodeLinkStylesheet.setAttribute(strAttribute, strAttributeHref); // append version in query string
      }
    },
    renderDefault:function(paramBlnRenderDefault){
      var $nodeContainer = this.$nodeViewContainer;
      var strJsCssClass = this.cssClassBackgroundOpacity;
      
      $nodeContainer.html(''); // reset... empty HTML so that container has no height

      if(paramBlnRenderDefault === true){  // show book sale image
        $nodeContainer.removeClass(this.cssClassWhiteBackground);
        $nodeContainer.addClass(this.cssClassShowBookSale);
        $(this.selectorViewCfuwBackground).removeClass(strJsCssClass);
        $(this.selectorViewCfuwBackground).css({'height':'793px'});
        $('#boardMembers>*').html('');
        $('#boardMembers').css({'top':'-778px'}); // set inline style because boardMembers top is set dynamically in View code
        $nodeContainer.removeClass('col-xs-10').addClass('col-xs-12');
        $nodeContainer.removeClass('jsContainerPageText').removeClass('jsCfuwTopImageFade');
      }

      this.setFooterPosition();

    },
    render:function(options){  
      d.getElementById('navBarTop').scrollIntoView();    
      if(!options){ // node clicked that we are not monitoring
        this.renderDefault(true); // true for render book sale
        return void(0);
      }else{ // TODO: this is hack to fix a bug, this block was causing underscore to throw exceptions
        var $nodeContainer = this.$nodeViewContainer;
        
        $nodeContainer.addClass(this.cssClassWhiteBackground);
        $nodeContainer.removeClass(this.cssClassShowBookSale);
        $nodeContainer.removeClass('col-xs-12').addClass('col-xs-10');
        this.optimizePageHeight();
      } // End oughter else

      this.setFooterPosition();
      
      var strModelId = options.idModel;
      var hashCssClassToSet = this.collection.where({'cid':strModelId})[0].get('hashCssClassToSet') || '';
      var json = this.collection.where({'cid':strModelId})[0].get('arryTemplateData');
      var jsonPageViewTitle = this.collection.where({'cid':strModelId})[0].get('pageTitle');      
      var blnSetBackgroundOpacity = this.blnSetBackgroundOpacity;
      var blnSetBackgroundWhite = this.blnSetBackgroundWhite;
      var blnAddPadding = this.blnAddPaddingTopSmallest;

      var strSelectorTemplate = '#'+ options.idTemplate;
      var $nodeTemplate = $(strSelectorTemplate);
     
      var html = $nodeTemplate.html();
      var $nodeTemplateTitle = this.$nodeViewPageTitle;
      
      var htmlTitle = $nodeTemplateTitle.html();
      var _template = _.template(html);
      var _templateTitle = _.template(htmlTitle);
      var strHtml = ''; 

      json['strNameTitle'] = jsonPageViewTitle;

      if(!!json){ // TODO: this should be a method call, removing if structure block contents

        for(var i = 0, len = json.length; i < len; i++){    
          strHtml += _template(json[i]);           
        }

        var $nodeExist = this.$nodeViewContainer;
        $nodeExist.html(strHtml);
        strHtml = _templateTitle(json[0]);

        $('#colMainCenter').removeClass(this.cssClassShowBookSale);        
      }

      if(blnSetBackgroundOpacity === true){
        $(this.selectorViewCfuwBackground).addClass(this.cssClassBackgroundOpacity);
      }else{
        $(this.selectorViewCfuwBackground).removeClass(this.cssClassBackgroundOpacity);
      }
      if(blnSetBackgroundWhite === true){ // assume white background has text
        $nodeExist.addClass('jsCfuwBackgroundColor');
        $nodeExist.addClass('jsContainerPageText').addClass('jsCfuwTopImageFade');
      }else{
        $nodeExist.removeClass('jsCfuwBackgroundColor');
      }
      if(blnAddPadding === true){ // assume white background has text
        $nodeExist.addClass('jsPaddingTopSmallest');
      }else{
        $nodeExist.removeClass('jsPaddingTopSmallest');
      }      

      !!$('#frmContactUsSubject') ? $('#frmContactUsSubject').focus() : ''; // Contact Form in View
    },
    setCustomListeners:function(options){
      var that = this;
      var $nodeFormContactUsSend = null;
      var strSelector = '#' + options.id;
      var interval = w.setInterval(function(){
        if( !!d.getElementById(options.id) ){
          w.clearInterval(interval);
          $nodeFormContactUsSend = $(strSelector);
          $(strSelector).on(options.nameEvent, options.fncListener);          
        }
       }, 333);
    },
    setFooterPosition:function(){
      var strClassViewContainer = this.$nodeViewContainer.attr('class');
      var strCssClassShowBookSale = this.cssClassShowBookSale;
      var INT_TOP = -978;
      var INT_MARGIN_TOP = 0;      
      var blnBookSaleInView = regEx.fnc.blnIsInString(strClassViewContainer, strCssClassShowBookSale);
      var hashContainerOffset = $(this.selectorViewCfuwBackground).offset();
      var intTop = hashContainerOffset.top;
      var intHeight = this.$nodeViewContainer.outerHeight();
      var $nodeFooter = $('#footerMain');

      if(blnBookSaleInView){
        $nodeFooter.css({
            'top':INT_TOP + 'px', 
            'margin-top':INT_MARGIN_TOP
          });
        return void(0);
      }      
      // set footer to bottom of nodeViewContainer
      $nodeFooter.css('top', -(intTop + intHeight - 407) + 'px');
    },
    optimizePageHeight:function(){
      var intContainerHeight = this.$nodeViewContainer.prop('offsetHeight');
      var intContainerTop = this.$nodeViewContainer.position().top;
      var intContainerLeft = this.$nodeViewContainer.position().left;
      var $nodeNavBar = $(this.selectorViewNavBar);
      var intNavBarBottom = $nodeNavBar.position().bottom;
      
      if(intContainerHeight < 330){
        var minViewCfuwBackgroundHeight = 360;
        this.$nodeViewCfuwBackground.css('height', minViewCfuwBackgroundHeight + 'px');
        this.$nodeViewContainer.css('top', -minViewCfuwBackgroundHeight + 15 + 'px');
      }else{
        this.$nodeViewCfuwBackground.css('height', intContainerHeight + 30 + 'px');
        this.$nodeViewContainer.css('top', -intContainerHeight + -7 + 'px');
      }

    },
    listenerCheckFormFields:function(e){
      var STR_CSS_IS_EMPTY = 'jsValidationErrorCannotBeEmpty';
      var STR_CSS_BTN_DISABLED = 'jsValidationErrorBtn';
      var $btnFormSend = $('#btnFormContactUsSend');
      var blnFormFieldsValid = true;      

      if( !!$('.' + STR_CSS_IS_EMPTY) && ( $('.' + STR_CSS_IS_EMPTY).length ) ){
        blnFormFieldsValid = false;
      }else{
        $('input', '#frmContactUs').each(function(index, elm){
          if(elm.value.length === 0){
            blnFormFieldsValid = false;
          }
        });
      }  

      if(blnFormFieldsValid === true){
        $btnFormSend.removeAttr('disabled');
        $btnFormSend.removeClass(STR_CSS_BTN_DISABLED);
      }else{
        $btnFormSend.attr('disabled', 'disabled');
        $btnFormSend.addClass(STR_CSS_BTN_DISABLED);        
      }

    },
    validateForm:function(options){
      var $nodeForm = options.$nodeForm;
      var $btnFormSend = $('#btnFormContactUsSend');
      var $nodeInputs = $nodeForm.find('input, textarea');
      var blnIsValid = true;

      $nodeInputs.each(function(index, elm){
        if(elm.value.length === 0){
          $(elm).parent().addClass('jsValidationErrorCannotBeEmpty');
          blnIsValid = false;
        }else{
          $(elm).parent().removeClass('jsValidationErrorCannotBeEmpty');
        }
      });

      return blnIsValid;
    },
    listenerFormSubmit:function(e){
      e.stopPropagation();
      e.preventDefault();
      var $nodeTarget = $(e.target);
      var $nodeParent = $nodeTarget.parents('form');
      var $nodeInputs = $nodeParent.find('input[type=text], textarea');
      var hashValues = {};
      var blnFormIsValid = this.validateForm({$nodeForm:$nodeParent});
      
      if(blnFormIsValid === false){ // do not submit if fields are not valid
        return void(0);
      }

      $nodeInputs.each(function(index, elm){ // get form values
        var strInput = elm.value;
        var strRemoveChars = '';
        var strId = elm.getAttribute('id');
        
        if(strId !== 'frmContactUsEmail'){
          strRemoveChars = regEx.fnc.strReplaceAllSpecialChars(strInput);
        }else{
          strRemoveChars = strInput;
        }        
        
        hashValues[elm.getAttribute('name')] = strRemoveChars;
      });
      // make AJAX Request, set header values
      $('#processingIcon').addClass('jsProcessingIcon');
      $('#frmContactUs fieldset').addClass('jsHidden');
      util.fnc.httpSend({selector:'#boardMembers', hashHeaders:hashValues, url:'php/contact.php'});
    },
    listenerEmailSuccess:function(e, paramHttpResponse){
      w.setTimeout(function(){
        var strHTML = '<h3>' + paramHttpResponse + '</h3>';
        $('#processingIcon').removeClass('jsProcessingIcon');
        $('#frmMessageContactUsSucccess').html(strHTML).addClass('jsTextOpacity');
      }, 555);
    },
    listenerNavFooter:function(e){
      e.stopPropagation();
      var nodeTarget = e.target;
      var strId = '';
      var strNavBarNodeIdToTrigger = null;   
      var nodeNavBarNodeToTrigger = null;   

      !!nodeTarget.getAttribute('id') ? strId = nodeTarget.getAttribute('id') : '';

      if(strId.length > 1){
        strNavBarNodeIdToTrigger = regEx.fnc.strReplace(strId, 'Footer', ''); // replace Footer with nothing
        nodeNavBarNodeToTrigger = d.getElementById(strNavBarNodeIdToTrigger); // strNavBarNodeIdToTrigger is nav bar link id
        var $nodeNavBar = $(this.selectorViewNavBar); 
         $nodeNavBar.trigger('click', nodeNavBarNodeToTrigger);        
      }
    },
    listenerOpenSmallWindow:function(e){ // if small window open, clicking on link replaces small window URL
      var node = e.target;
      var strId = node.getAttribute('id');
      var strUrl = null;
      var windows = {width:827, height:363};      

      strId === 'headColRightLogo' ? strUrl = 'http://www.cfuw.org/' : strUrl = 'http://www.fcfdu.org/';
      this.newWindow = window.open(strUrl,'name','height='+windows.height+',width='+windows.width);
      if (window.focus) {this.newWindow.focus()}
      return false;
    },
    listenerNavBar:function(e, paramNodeFromTrigger){ // listening to the nav bar, using event delegation
      var nodeTarget = e.target;
      if(typeof paramNodeFromTrigger != 'undefined'){  // footer link send message
         nodeTarget = paramNodeFromTrigger;
      } 
      
      // HTML5 let HTML element define index for accessing associated data
      var intDataIndexNumber = parseInt(nodeTarget.dataset.indexNumber);
      var intIndexNumber = null;
      var strId = nodeTarget.getAttribute('id') || nodeTarget.parentNode.getAttribute('for');
      strId = regEx.fnc.strRemoveWhiteSpace(strId);
      var thisNav = this.nav; //  view mappings set in this.initialize, configMappings.js controls this data
      var model = this.model; // reference variable, pointer
      var strDataPath = null;
      var arryTagsXml = null;
      var arryTagsCommon = null;
      var arryTemplateId = null;
      var strCid = null;
      var strIdTemplate = null;
      var blnShowDefault = false;
      var strJsCssClassOpacity = 'jsOpacity';
      var blnSetBackgroundOpacity = false;
      var hashCssClassToSet = null;
      var hashHrefToSet = null;
      var dateNoCache = new Date().getMilliseconds();

      strDataPath = thisNav.data[intDataIndexNumber] + '?noCache=' + dateNoCache;
      arryTagsXml = thisNav.tagsXml[intDataIndexNumber];
      arryTagsCommon = thisNav.tagsXmlChildsCommon[intDataIndexNumber];          
      arryTemplateId = thisNav.templateId[intDataIndexNumber];          

      switch(strId){ // discover which node user clicked
        case 'btnAffiliations':
          model = affiliationsModel.fnc.getInstance(); 
          intIndexNumber = 0;         
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;
        case 'btnBoardMembers':
          model = boardModel.fnc.getInstance(); 
          intIndexNumber = 1;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;        
        case 'btnContactUs':
          intIndexNumber = 2;
          model = contactUsModel.fnc.getInstance();
          this.blnSetBackgroundWhite = true;
          break;
        case 'btnEvents': 
          /* Client requested events be merged with meetings 2015 Dec 13 */
          break;    
        case 'btnHome':
          intIndexNumber = 4;
          model = homeModel.fnc.getInstance();
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;   
        case 'btnInterestGroups': 
          model = interestGroupsModel.fnc.getInstance(); 
          intIndexNumber = 5;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;       
        case 'btnMeetings': 
          model = meetingsModel.fnc.getInstance();  
          intIndexNumber = 6;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;     
        case 'btnMembershipApplication': 
          model = membershipApplicationModel.fnc.getInstance(); 
          intIndexNumber = 7;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;                                                                         
        case 'btnMissionStatement':
          model = missionStatementModel.fnc.getInstance(); 
          intIndexNumber = 8;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;
          break;
        case 'btnNews':
          model = newsModel.fnc.getInstance();
          intIndexNumber = 9; 
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;                  
        case 'btnScholarships': 
          model = scholarshipsModel.fnc.getInstance(); 
          intIndexNumber = 10;
          this.blnSetBackgroundOpacity = true;
          this.blnSetBackgroundWhite = true;            
          this.blnAddPaddingTopSmallest = true;
          break;             
        case 'btnBookSale': 
          blnShowDefault = true;          
          $(this.selectorViewCfuwBackground).removeClass(strJsCssClassOpacity);
          this.render(); // no parameters renders default
          return void(0);
          break;                                                                          
        default:
          return void(0); /* do nothing we are not listening to the node */
      } // End switch
      // assigned model in above switch, now set the properties

      // access our configMapping.js JSON relative to index number.
      strCid = thisNav.modelCid[intIndexNumber]; 
      model.set('templateId', arryTemplateId); // templateId is defined in configMapping.js
      model.set('tagsXml', arryTagsXml); // allow the associated model to access XML data via the top XML tag names
      model.set('tagsXmlChildsCommon', arryTagsCommon); // allow the associated model to accesss XML data via child tag names
      hashCssClassToSet = model.get('hashCssClassToSet'); // data to merge with template. set in model
      hashHrefToSet = model.get('hashHrefToSet'); 
      strIdTemplate = model.get('templateId');
      
      var that = this;

      if( ( model.get('blnDataHasBeenSet') === true ) ){ // do not perform HTTP Request, data has been set on model
            that.render({idModel:strCid, idTemplate:strIdTemplate});
            return void(0);
      }

      if(blnShowDefault === false && ( model.get('blnDataHasBeenSet') === false ) ){ // no need to request if data is set on model
        this.collection.add(model);
        model.fetch({ // triggers model.parse
          url:basePath.basePath() + strDataPath,
          dataType:'xml',
          success:function(){            
            that.render({idModel:strCid, idTemplate:strIdTemplate});
            model.set('hashCssClassToSet', hashCssClassToSet);
            model.set('blnDataHasBeenSet', true);  // optimization: flag indicates data set, don't need to perform HTTP Request
          },
          error:function(paramThisView, paramException){
            throw new exception.fnc.http({that:paramThisView, exception:paramException, cfuwException:'Fetch in home View Failed'}); 
          }        
        });        
      }else{
        that.render({blnShowDefault:blnShowDefault});
      }
    } // End listenerNavBar 
  });

  return{View:_View}

  


}); // End require(['jQuery', 'Backbone'] ...




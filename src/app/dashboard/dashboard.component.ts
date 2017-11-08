import { Component, OnInit, AfterViewInit,ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DataService } from '../data-service.service';
import { BaseChartDirective } from 'ng2-charts';
import { MasonryModule, MasonryOptions  } from 'angular2-masonry';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as $ from 'jquery';

import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import { TabsetComponent } from 'ngx-bootstrap';


declare var Packery: any;
declare var Draggabilly: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})





export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('grid') grid;
  @ViewChild('netSalesVal') netSalesVal;
  @ViewChild('grossSalesVal') grossSalesVal;

  constructor(private dataService: DataService, private mScrollbarService: MalihuScrollbarService) { }

  ngOnInit() {
	//this.selectedOption='Yesterday';
    


     $('.navbar-toggle').click(function(){
        $(this).toggleClass('cross');
	    	$('#Main_menu').toggleClass('show');
        $('body').toggleClass('noshow');
        $('.overlay').toggleClass('showlay');
	    	$('.login-toggle').toggleClass('fade');
        return false;    
    });
	
   
	if(sessionStorage.getItem('selectedOpt')){
		this.selectedOption=sessionStorage.getItem('selectedOpt');
		if(sessionStorage.getItem('selectedOpt')=='Custom'){
			this.Sdate= sessionStorage.getItem('selectedFDate');
			 this.Edate=sessionStorage.getItem('selectedLDate');
			 $('.custom_date_select').hide();
			 this.custIcon=true;
			  this.dataService.getDashboardByDate(this.Sdate,this.Edate)
			  .subscribe(data => {
				  this.globalDashBoardData = data;
				  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
				  document.getElementById('pageTitle').innerHTML = 'Global';
			  });
		}else{
			this.getDataByDate();
		}		
	}else{
		this.getGlobalDashboardData();
	}
	if(sessionStorage.getItem('selectedDate')){
		this.customVal=sessionStorage.getItem('selectedDate');
		
	}
	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if (keyName === 'Escape') {
			$('.custom_date_select').hide();
			this.custIcon=false;
			this.selectedOption=sessionStorage.getItem('selectedOpt');
		return;
		}
	}, false);
	
  }

  ngAfterViewInit() {
	 (function(a){
		 if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){
			  $('.graph_section .common_box h4.open_tab').click(function(){
				$(this).toggleClass('arrow');
				$(this).next().slideToggle();
				  return false;
			  });
		}
	})(navigator.userAgent||navigator.vendor);
	
  }

  ngOnDestroy() {
    this.mScrollbarService.destroy('.graph_section .common_box.half .indicate_list');
  }

  globalDashBoardData = {};  
  stores: Array<any>;
  markers: Array<any>;
  netSalesGlobal: number;
  grossSalesGlobal: number;
  newCustomers: number;
  oldCustomers: number;
  laborCost: number;
  laborCostPerc: number;
  deliveryCount: number;
  deliveryValue: number;
  voidsCount: number;
  voidsValue: number;
  paymentsData: Array<any>;
  taxAmount: number;
  orderTypes: Array<any>;
  speedlineCount: number;
  speedlineValue: number;
  topCoupon: Array<any>;
  colorCodes = ['#4d5a31','#69813c','#7b984e','#abc380','#b7ce97','#bed09c','#c5d5a5',
                  '#921b28','#882d2e','#90292b','#98262e','#b21f29','#be302d','#cc6d50'];

  selectedCurrency = 'GBP';                
	//symArray:Array<any>;
  zoom: number = 1;
  lat: number = 51.673858;
  lng: number = 7.815982;
  ////---------------//---[Added By PKM]
 selectedOption:string='Yesterday';
 
 startDateInput=new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear();
 endDateInput=new Date().getDate()+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear();
 itemsByCategory:Array<any>;
 currencySymb:string;
 symArray={'USD':'$','AED':'AED','BHD':'BD','GBP':'£','EUR':'€'};
 earningData:Array<any>;
 byCategoryData:Array<any>;
   ////---------------//---[Added By PKM]

 countryData: Array<any> = []; 

 isAllGraphInitialized() {
   if(this.isStoresDataAvailable && this.isSalesCategoryDataAvailable && this.isPaymentDataAvailable && this.isDiscountDataAvailable && this.isCustomerDataAvailable && this.isOtdDataAvailable && this.isDelAreaDataAvailable && this.isTopEmpDataAvailable && this.isOrderDataAvailable && this.isOtdDataAvailable) {
		this.initPackery();
   }
 }

 showLoader = true;

 initPackery() {
   
     var packery = new Packery(this.grid.nativeElement, {
        itemSelector: '.grid-item', gutter:20, columnWidth: '.grid-item' });

        if(window.screen.width > 480) {
            packery.getItemElements().forEach( function( itemElem ) {
				var draggie = new Draggabilly( itemElem, {
				handle: '.header'
			  });
            packery.bindDraggabillyEvents(draggie);
          });
        }

    this.mScrollbarService.initScrollbar('.graph_section .common_box.half .indicate_list', { axis: 'y', theme: 'dark', scrollButtons: { enable: false } });
  
      this.showLoader = false;
 }


 isStoresDataAvailable = false;

 formatStoreData(data, currency) {
   
        let markersArr: Array<any> = [];
        let alreadyCountry: Array<any> = [];
        
        Object.keys(data).forEach(function(key,index) {

            if(data[key].Stores){
              
              Object.keys(data[key].Stores).forEach(function(keyInner,indexInner) {
                
                let m = {
                  lat: parseFloat(data[key].Stores[keyInner].Lat),
                  lng: parseFloat(data[key].Stores[keyInner].Long),
                  label: '',
                  draggable: false,
                  color: '#'+data[key].Color,
                  infoText: key
                }
              
                markersArr.push(m);
              });
            }
        });
  
        this.markers = markersArr;        
        this.isStoresDataAvailable = true;   
        this.isAllGraphInitialized(); 
 }




 getGlobalDashboardData() {
    this.dataService.getGlobalDashboard()
      .subscribe(data => {
          this.globalDashBoardData = data;
          this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
          document.getElementById('pageTitle').innerHTML = 'Global';     
      });
 }
 
customVal:string=(new Date().getDate()-1)+'/'+(new Date().getMonth()+1)+'/'+new Date().getFullYear();
custIcon=false;
 getDataByDate(){
	 var arg=this.selectedOption;
	 var myDate= new Date();
	 var fDate=new Date();
	 var lDate=new Date();
	  
	 if(arg=='Yesterday'){
		 var yesturday=new Date(myDate);
		 yesturday=new Date(yesturday.setDate(myDate.getDate()-1));
		 fDate=yesturday;
		 lDate=yesturday;
		 
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		
		 this.customVal=startD;
	 }
	 
	 if(arg=='Current Week'){
		var curr = new Date; 
		var yesturday=new Date(myDate);
		var first = curr.getDate() - curr.getDay()+1;
		var last = first + 6;
		
		lDate= new Date(curr.setDate(first));
		fDate= new Date(yesturday.setDate(myDate.getDate()-1));
		
		var ED=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var SD=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+(lDate.getDate())).slice(-2);
		var endD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var startD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });

		 this.customVal=startD+' TO '+endD; 
	 }
	 
	 if(arg=='Last Week'){
		var d = new Date();
        lDate = new Date(d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000));
        fDate = new Date(d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000));
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var endD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD+' TO '+endD;
	 }
	 
	 if(arg=='This Day Last Week'){
		 var yesturday=new Date(myDate);
		 fDate=new Date(yesturday.setDate(myDate.getDate()-8));
		// lDate=new Date(yesturday.setDate(myDate.getDate()-8));
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD; 
	 }
	 
	 
	 if(arg=='Current Month'){
		var curr_date =new Date();
        fDate = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
        lDate = new Date(curr_date.setDate(myDate.getDate()-1));
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var endD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD+' TO '+endD;
	 }
	 
	 if(arg=='Last Month'){
		var curr_date =new Date();
        fDate = new Date(curr_date.getFullYear(), curr_date.getMonth()-1, 1);
		lDate=new Date(fDate.getFullYear(), fDate.getMonth() + 1, 0);
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var endD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		//alert(SD+'TO'+ED);
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD+' TO '+endD;
	 }
	 if(arg=='This Day Last Month'){
		 var yesturday=new Date(myDate);
		 fDate = new Date(yesturday.getFullYear(), yesturday.getMonth()-1, yesturday.getDate()-1);
		 lDate=new Date(yesturday.getFullYear(), yesturday.getMonth()-1, yesturday.getDate()-1);
		 var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		 var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		 
		 var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		//alert(SD+'TO'+ED);
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD; 
	 }
	 
	  if(arg=='Current Year'){
		var curr_date =new Date();
		fDate = new Date(curr_date.getFullYear(), 0);
		lDate = new Date(curr_date.setDate(myDate.getDate()-1));
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var endD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD+' TO '+endD; 
	  }
	  if(arg=='Last Year'){
		var curr_date =new Date();
		fDate = new Date(curr_date.getFullYear()-1, 0);
		lDate=new Date(fDate.getFullYear()+1, fDate.getMonth(), 0);
		var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		var endD=lDate.getDate()+'/'+(lDate.getMonth()+1)+'/'+lDate.getFullYear();
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		   this.customVal=startD+' TO '+endD; 
	  }
	  
	  if(arg=='This Day Last Year'){
		 var yesturday=new Date(myDate);
		 fDate = new Date(yesturday.getFullYear()-1, yesturday.getMonth(), yesturday.getDate()-1);
		 lDate=new Date(yesturday.getFullYear()-1, yesturday.getMonth(), yesturday.getDate()-1);
		 var SD=fDate.getFullYear()+'-'+('0'+(fDate.getMonth()+1)).slice(-2)+'-'+('0'+fDate.getDate()).slice(-2);
		 var ED=lDate.getFullYear()+'-'+('0'+(lDate.getMonth()+1)).slice(-2)+'-'+('0'+lDate.getDate()).slice(-2);
		var startD=fDate.getDate()+'/'+(fDate.getMonth()+1)+'/'+fDate.getFullYear();
		
		this.dataService.getDashboardByDate(SD,ED)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';     
		  });
		 this.customVal=startD;
	 }
	 if(arg=='Custom'){
		 this.showCal();
		 this.custIcon=true;
		 
	 }else{
		 $('.custom_date_select').hide();
		 sessionStorage.setItem('selectedOpt', arg);
		  this.custIcon=false;
		 sessionStorage.setItem('selectedDate', this.customVal);
	 }
	 
      
 }

	
 /*=================================================================*/	
 @ViewChild('calTab') calTab: TabsetComponent;

 public myStartDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'YYYY-MM-DD',
		inline:true
    };
public myEndDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'YYYY-MM-DD',
		inline:true
    };	
	Sdate:string;
	DFdate:string;
	Edate:string;
	onStartDateChanged(event: IMyDateModel) {
		  this.calTab.tabs[1].active = true;
		  this.Sdate = event.date.year+'-'+('0'+(event.date.month)).slice(-2)+'-'+('0'+(event.date.day)).slice(-2);
		  this.DFdate=event.date.day+'/'+event.date.month+'/'+event.date.year;
		 $('#startDate').html(event.date.day+'/'+event.date.month+'/'+event.date.year);
		  
	}
	onEndDateChanged(event: IMyDateModel) {
			this.Edate=event.date.year+'-'+('0'+(event.date.month)).slice(-2)+'-'+('0'+(event.date.day)).slice(-2);
		  $('#endDate').html(event.date.day+'/'+event.date.month+'/'+event.date.year);
		  $('.custom_date_select').hide();
		  this.calTab.tabs[0].active = true;
		  this.dataService.getDashboardByDate(this.Sdate,this.Edate)
		  .subscribe(data => {
			  this.globalDashBoardData = data;
			  this.getValuesInSelectedCurrency(data, this.selectedCurrency, true);    
			  document.getElementById('pageTitle').innerHTML = 'Global';
		  });
		  this.customVal=this.DFdate+' TO '+event.date.day+'/'+event.date.month+'/'+event.date.year; 
		  this.custIcon=true;
		  sessionStorage.setItem('selectedDate', this.customVal);
		  sessionStorage.setItem('selectedFDate',this.Sdate);
		  sessionStorage.setItem('selectedLDate', this.Edate);
		  sessionStorage.setItem('selectedOpt', 'Custom');
	}
	toggleDaySec(event){
	  $('.calender_sec').slideToggle();
	  $('.custom_date_select').hide();
	  event.preventdefault();
	}
	showCal(){
		$('.custom_date_select').toggle();
		this.custIcon=true;
	}	
	hideCal(){
		$('.custom_date_select').hide();
	}
 /*=================================================================*/

 getValuesInSelectedCurrency(data, currency, updateColors) {

      this.formatStoreData(data['Country'], currency);
	  
		//---[Added By PKM]
		this.currencySymb=this.symArray[currency]; 
		this.getEarningData(data['Earning'], currency);
		this.getDataByCategory(data['Top Items']);
		this.getDataOverallCategory(data['Top Items']['Overall']);
		
		//---[Added By PKM]
		
      //net sales global
      this.netSalesGlobal = parseFloat(data['Net Sales'].Value[currency]);
      document.getElementById('netSalesValId').innerHTML = this.currencySymb+(this.netSalesGlobal.toFixed(2)).toString();

      //gross sales global
      this.grossSalesGlobal = parseFloat(data['Gross Sales'].Value[currency]);
      document.getElementById('grossSalesValId').innerHTML = this.currencySymb+(this.grossSalesGlobal.toFixed(2)).toString();

      //country data
      this.prepareCountryData(data['Country'], currency);

      //customers
      this.newCustomers = parseInt(data.Customers.New);
      this.oldCustomers = parseInt(data.Customers.Repeat);
      this.customersData.push(this.newCustomers);
      this.customersData.push(this.oldCustomers);
      this.isCustomerDataAvailable = true;

      //Labor Cost
      this.laborCost = parseFloat(data['Labor Cost'].Value[currency]);
      this.laborCostPerc = parseInt(data['Labor Cost'].Percentage); 
	//console.log(this.laborCost);
      //Delivery Charges
      this.deliveryCount = parseInt(data['Delivery Charges'].Qty);
      this.deliveryValue = parseFloat(data['Delivery Charges'].Value[currency]); 

      //Taxes data
      this.taxAmount = parseFloat(data.Taxes.Value[currency]);

      //Voids Data
      this.voidsCount = parseInt(data.Voids.Qty);
      this.voidsValue = parseFloat(data.Voids.Value[currency]);

      //order types 
      this.prepareOrderTypesData(data['Order Types'], currency, updateColors);

      //payment types
      this.preparePaymentTypesData(data['Payment Types'], currency, updateColors);

      //sales by category
      this.prepareSalesCategoryData(data['Sales By Category'], currency, updateColors);

      //Discounts 
      this.prepareDiscountData(data['Discounts'], currency, updateColors);

      //top employee
      this.prepareTopEmployeeData(data['Top Selling Employees'], currency);

      //top delivery area
      this.prepareDelAreaData(data['Top 5 Delivery Areas']);

      //speedline connect data
      this.speedlineCount = parseInt(data['Online Orders'].Qty);
      this.speedlineValue = parseFloat(data['Online Orders'].Value[currency]);

      //out the door time
      this.prepareOtdData(data['Out the Door Time']);

 }


 //currency change 
 changeCurrency(selectedCurrency) {
    this.getValuesInSelectedCurrency(this.globalDashBoardData, selectedCurrency, false);
	
	
	
 }


 //format country data
 prepareCountryData(data, currency) {

 
    this.countryData = [];
    let cData = [];
    Object.keys(data).forEach(function(key,index) { 
	if(data[key]['Net Sales']!=''){
       let ctData = {
                  country: key,
				sales: parseFloat(data[key]['Net Sales'][currency]),
                  color: '#' + data[key].Color
              }
	//console.log(data[key]['Net Sales']);
        cData.push(ctData);   
	}        
    }); 

    this.countryData = cData;           
                
 }


 //order types
  orderTypesLabels:string[] = [];
  orderTypesData:number[] = [];                     
 
  orderTypesOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  otColors: Array<any> = [];
  orderTypesColors: Array<any> = [
      { 
        backgroundColor: []
  }];

  isOrderDataAvailable = false;
  orderTypesCenterData: any = {};


 prepareOrderTypesData(data, currency, updateColors) {
    
        let otArr: Array<any> = [];
        let otLabels: Array<any> = [];
        let otData: Array<any> = [];
        let otColor: Array<any> = [];
        let totalCount: number = 0;
        let centerData = {qty: 0, val: 0};
        let colCodes = this.colorCodes;


        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });

        Object.keys(data).forEach(function(key,index) {       
          
          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);
          
          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);          
          let perc = (parseInt(data[key].Count)/totalCount)*100;

            let ot = {
              type: key,
              count: data[key].Count,
              value: parseFloat(data[key].Value[currency]),
              color: dynamicColor,
              perc: Math.round(perc*10)/10
            }

            centerData.qty += parseInt(ot.count);
            centerData.val += ot.value;

            otArr.push(ot);
            otLabels.push(key);
            otData.push(data[key].Count);
            otColor.push(ot.color);
            
        });

        otArr = this.dataService.assignColors(otArr, true, 'color');
        otColor = this.dataService.assignColors(otColor, false, '');
        this.orderTypesCenterData = centerData;
        this.orderTypesLabels = otLabels;
        this.orderTypes = otArr;
        this.orderTypesData = otData;

        if(updateColors) {
          this.otColors = otColor;
          this.orderTypesColors[0].backgroundColor = otColor;
        }
        
        this.isOrderDataAvailable = true;   
        this.isAllGraphInitialized();     
           
 }


  

 

  
  styles = [
    { "elementType": "geometry","stylers": [{"color": "#CCD7B9"}] },
    { "elementType": "labels",  "stylers": [{"visibility": "off"}] },
    { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
    { "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
    { "elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{"visibility": "off"}] },
    { "featureType": "administrative.land_parcel", "stylers": [{"visibility": "off"}] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill","stylers": [{"color": "#ffffff"}] },
    { "featureType": "administrative.neighborhood","stylers": [{"visibility": "off"}] },
    {"featureType":"poi","stylers":[{"visibility":"off"}]},
    {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#CCD7B9"}]},
    {"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
    {"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
    {"featureType":"road","stylers":[{"visibility":"off"}]},
    {"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
    {"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},
    {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},
    {"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},
    {"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},
    {"featureType":"transit","stylers":[{"visibility":"off"}]},
    {"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},
    {"featureType":"water","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
    {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}
];
  
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    /*this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });*/
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

 

 //sales by category
  salesCategoryLabels:string[] = [];
  salesCategoryData:number[] = [];                     
 
  salesCategoryOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  scColors: Array<any> = [];
  salesCategoryColors: Array<any> = [
      { 
        backgroundColor: []
  }];
  salesCategory: Array<any>;

  isSalesCategoryDataAvailable = false;

  salesCategoryCenterData:any = {qty: 0, val: 0};


 prepareSalesCategoryData(data, currency, updateColors) {
    
        let scArr: Array<any> = [];
        let scLabels: Array<any> = [];
        let scData: Array<any> = [];
        let scColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        
        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });
        
        let centerData = {qty: 0, val: 0};
        Object.keys(data).forEach(function(key,index) {    
            
          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);

          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            let perc = (data[key].Count/totalCount)*100;

            let sc = {
              type: key,
              count: data[key].Count,
              value: parseFloat(data[key].Value[currency]),
              color: dynamicColor,
              countPerc: Math.round(perc*10)/10
            }
            
            centerData.qty += parseInt(sc.count);
            centerData.val += sc.value;

            scArr.push(sc);
            scLabels.push(sc.type);
            scData.push(sc.count);
            scColor.push(sc.color);
            
        });

        scArr = this.dataService.assignColors(scArr, true, 'color');
        scColor = this.dataService.assignColors(scColor, false, '');
        this.salesCategoryCenterData = centerData;
        this.salesCategoryLabels = scLabels;
        this.salesCategory = scArr;
        this.salesCategoryData = scData;

        if(updateColors) {
           this.scColors = scColor;
           this.salesCategoryColors[0].backgroundColor = scColor;
        }

        this.isSalesCategoryDataAvailable = true; 
        this.isAllGraphInitialized();
        
  }

  

  
  //payment types
  paymentTypesLabels:string[] = [];
  paymentTypesData:number[] = [];                     
 
  paymentTypesOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  ptColors: Array<any> = [];
  paymentTypesColors: Array<any> = [
      { 
        backgroundColor: []
  }];
  paymentTypes: Array<any>;

  isPaymentDataAvailable = false;
  paymentTypesCenterData: any = { qty: 0, val: 0};


 preparePaymentTypesData(data, currency, updateColors) {
    
        let ptArr: Array<any> = [];
        let ptLabels: Array<any> = [];
        let ptData: Array<any> = [];
        let ptColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        let ptCenterData = { qty: 0, val: 0};
        
        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });
        
        Object.keys(data).forEach(function(key,index) {     
			
           let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);

         // let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            let perc = (data[key].Count/totalCount)*100;

            let pt = {
              type: key,
              count: data[key].Count,
              value: parseFloat(data[key].Value[currency]),
              color: dynamicColor,
              countPerc: Math.round(perc*10)/10
            }

            ptCenterData.qty += parseInt(pt.count);
            ptCenterData.val += pt.value;
 
            ptArr.push(pt);
            ptLabels.push(pt.type);
            ptData.push(pt.count);
            ptColor.push(pt.color);
            
        });

        ptArr = this.dataService.assignColors(ptArr, true, 'color');
        ptColor = this.dataService.assignColors(ptColor, false, '');
        this.paymentTypesCenterData = ptCenterData;
        this.paymentTypesLabels = ptLabels;
        this.paymentTypes = ptArr;
        this.paymentTypesData = ptData;

        if(updateColors) {
          this.ptColors = ptColor;
          this.paymentTypesColors[0].backgroundColor = ptColor;
        }
        
        this.isPaymentDataAvailable = true; 
        this.isAllGraphInitialized();
             
  }


  //discounts
  discountLabels:string[] = [];
  discountData:number[] = [];                     
 
  discountOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  
  dColors: Array<any> = [];
  discountColors: Array<any> = [
      { 
        backgroundColor: []
  }];

  discount: Array<any>;
  isDiscountDataAvailable = false;

  discountsCenterData:any = { qty: 0, val: 0};





 
 prepareDiscountData(data, currency, updateColors) {
        
        this.getTopCouponData(data.Coupon.Top, currency);

        let dArr: Array<any> = [];
        let dLabels: Array<any> = [];
        let dData: Array<any> = [];
        let dColor: Array<any> = [];
        let totalCount: number = 0;
        let colCodes = this.colorCodes;
        

        Object.keys(data).forEach(function(key,index) {
          totalCount += parseInt(data[key].Count);
        });

        let centerData = { qty:0, val: 0};

        Object.keys(data).forEach(function(key,index) {       

          let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
          let dynamicColor = randomColor;

          colCodes = colCodes.filter(item => item !== randomColor);  
          
          //let dynamicColor = '#'+Math.floor(Math.random()*16777215).toString(16);
          let perc = (parseInt(data[key].Count)/totalCount)*100;
          

            let ot = {
              type: key,
              count: data[key].Count,
              value: parseFloat(data[key].Value[currency]),
              color: dynamicColor,
              perc: Math.round(perc*10)/10
            }

            centerData.qty += parseInt(ot.count);
            centerData.val += ot.value;

            dArr.push(ot);
            dLabels.push(key);
            dData.push(data[key].Count);
            dColor.push(ot.color);
            
        });

        dArr = this.dataService.assignColors(dArr, true, 'color');
        dColor = this.dataService.assignColors(dColor, false, '');
        this.discountsCenterData = centerData;
        this.discountLabels = dLabels;
        this.discount = dArr;
        this.discountData = dData;

        if(updateColors) {
            this.dColors = dColor;
            this.discountColors[0].backgroundColor = dColor;
        }

        this.isDiscountDataAvailable = true;  
        this.isAllGraphInitialized();      
          
 }


  //customers
  customersLabels:string[] = ['New Customers', 'Old Customers'];
  customersData:number[] = [];                     
  customersType:string = 'doughnut';
  customersOptions: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  isCustomerDataAvailable = false;
  customersColors: any[] = [
      { 
        backgroundColor:["#006837", "#8cc63f"] 
  }];




  //out the door 
  otdOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5,
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 60, stepSize: 10 },
               ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  otdLabels:string[] = [];
  otdLegend:boolean = true;
  otdData:any[] = [{data: []}];
  otdColors: any[] = [{ backgroundColor: "#7b984e" }];
  isOtdDataAvailable = false;
  otdAvg = 0;

  prepareOtdData(data){

        let oLabels: Array<any> = [];
        let oData: Array<any> = [];        
        let otdAvg = 0;

        Object.keys(data).forEach(function(key,index) { 
            if(key != 'Avg') {
              oLabels.push(key);
               oData.push(parseInt(data[key]));
            }else{
              otdAvg = parseInt(data[key]);
            }
            
        });
        
        this.otdAvg = otdAvg;
        this.otdLabels = oLabels;        
        this.otdData[0].data = oData;             
        this.isOtdDataAvailable = true; 
        this.isAllGraphInitialized();
             
  }

  
  //delivery area
  delAreaOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5,
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 60, stepSize: 10 },
               ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  delAreaLabels:string[] = [];
  delAreaLegend:boolean = true;
  delAreaData:any[] = [{data: []}];
  delAreaColors: any[] = [{ backgroundColor: "#7b984e" }];
  isDelAreaDataAvailable = false;


  prepareDelAreaData(data){

        let dLabels: Array<any> = [];
        let dData: Array<any> = [];        
        
        data.forEach((del) => {  
           
              let labelTxt = this.truncateText(del.Name, 6);
              dLabels.push(labelTxt);
              dData.push(parseInt(del.Orders));
                     
        });
        
        this.delAreaLabels = dLabels;        
        this.delAreaData[0].data = dData;   
		//	console.log(this.delAreaData);
        this.isDelAreaDataAvailable = true; 
        this.isAllGraphInitialized();     
      
  }


  //top employee
  topEmpOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
         barPercentage: 0.5, 
         gridLines: { display:false }
     }],
      yAxes: [{              
              // ticks: { min: 0, max: 5000, stepSize: 500 },
              ticks: { min: 0 },
              gridLines: { display:false }
        }]
    }
    
  };
  
  topEmpLabels:string[] = [];
  topEmpLegend:boolean = true;
  topEmpData:any[] = [{data: []}];
  topEmpColors: any[] = [{ backgroundColor: "#7b984e" }];
  isTopEmpDataAvailable = false;


  prepareTopEmployeeData(data, currency){
    
        let eLabels: Array<any> = [];
        let eData: Array<any> = [];        
        
       Object.keys(data).forEach(function(key,index) { 
           
            eLabels.push(key);
            eData.push(parseInt(data[key].NetSales[currency]));
            
        });
        
        this.topEmpLabels = eLabels;        
        this.topEmpData[0].data = eData;             
        this.isTopEmpDataAvailable = true; 
        this.isAllGraphInitialized();     
      
  }


  isTopCouponDataAvailable = false;
  getTopCouponData(data, currency) {
      let datArr = [];
      Object.keys(data).forEach(function(key,index) {   
          
          let dat = {
            name: key,
            count: parseInt(data[key].Count),
            value: parseFloat(data[key].Value[currency])
          }

          datArr.push(dat);
      });

      this.topCoupon = datArr;
      this.isTopCouponDataAvailable = true;
      this.isAllGraphInitialized();    
  }
 


  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
  

  truncateText(str, limit) {
    return (str.length < limit) ? str : str.substring(0, limit) + '...';
  }


  randomValfromArr(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
  }

  
  //--Added By PKM--//
  
  earningDataLabel:Array<any>;
  earningDataValue:Array<any>;
  earningDataOption: any = {
    cutoutPercentage: 70,
    responsive: true,
    maintainAspectRatio: false
  };
  earningDataColors: Array<any> = [
      { 
        backgroundColor: []
  }];
  earningTotal:any={};
  getEarningData(data,currency){
	  let datArr = [];
	   let datArrLabel = [];
	    let datArrValue = [];
		let colCodes = this.colorCodes;
         let erColor=[];  
	  let totalData = { per:0, val: 0};
      Object.keys(data).forEach(function(key,index) {
		 let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
         let dynamicColor = randomColor;
          if(key!='Total'){
				  let dat = {
					name: key,
					perc:data[key].Percentage+'%',
					color: dynamicColor,
					value: parseFloat(data[key].Value[currency])
				  }
				 datArrValue.push(parseInt(data[key].Value[currency]));
				 datArrLabel.push(key);
				 datArr.push(dat);
				 erColor.push(dynamicColor);
			  }
		  });
		  totalData.per=data['Total'].Percentage;
		  totalData.val=data['Total'].Value[currency];
		  this.earningTotal=totalData;
		  datArr = this.dataService.assignColors(datArr, true, 'color');
		  erColor = this.dataService.assignColors(erColor, false, '');
		this.earningDataColors[0].backgroundColor = erColor;
		this.earningDataLabel=datArrLabel;
		this.earningDataValue=datArrValue;
		this.earningData = datArr;
	  
  }
  
  catgorylabels:Array<any>;
  catgoryCount:Array<any>;
  categoryColors:Array<any>;
  totalItemCounts;
 getDataByCategory(data){
	let catLData=[];
	let catCData=[];
	let datArr = [];
	let catColArr=[];
	let centerData = { qty:0, val: 0};
	let totalItemCount={ val: 0};
	let colCodes = this.colorCodes;
	Object.keys(data).forEach(function(key,index) {
		let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
		if(key!='Overall'){
          let dat = {
			name: key,
			item:data[key],
			//count:parseInt(data[key].Count),
			color:randomColor
          }
		  totalItemCount.val += parseInt(data[key].Count);
          datArr.push(dat);
		  catLData.push(data[key].Item);
		 // catCData.push(parseInt(data[key].Count));
		  catColArr.push(randomColor);
		  //console.log(data[key].Count);
		}
      });
	  //console.log(totalItemCount);
	  //console.log(datArr);
	this.byCategoryData = datArr;
	this.catgorylabels = catLData;
	this.catgoryCount = catCData;
	this.categoryColors=catColArr;
	this.totalItemCounts=totalItemCount;
	
 }
 
  catgoryOvr;
  getDataOverallCategory(data){
	let catLData=[];
	let catCData=[];
	let datArr = [];
	let catColArr=[];
	let centerData = { qty:0, val: 0};
	let totalItemCount={ val: 0};
	let colCodes = this.colorCodes;
	Object.keys(data).forEach(function(key,index) {
		let randomColor = colCodes[Math.floor(Math.random() * colCodes.length)];
		let dat = {
			item:data[key].Item,
			count:parseInt(data[key].Count),
			color:randomColor
          }
		  //totalItemCount.val += parseInt(data[key].Count);
          datArr.push(dat);
		
      });
	 //console.log(catLData);
	//console.log(datArr);
	this.catgoryOvr= datArr;
	//this.catgoryOvrCount[0].data = catCData;
	//console.log(this.catgoryOvrCount);
 }
  //--Added By PKM--//

}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
  color: string;
  infoText: string;
}




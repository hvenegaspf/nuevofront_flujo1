import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, Validators, NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import Swiper from 'swiper';
declare var $:any;
declare let L;
import Chart from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // car
  car: any = null;
  car_id:any;
  rate_car: any;
  packages: any[];
  //car errors
  title_modal_mechanic:any;
  header_modal_mechanic:any;
  error_modal:any;
  // viajes
  nip:any="";
  error_nip:any = "";
  purchases: any = [];
  id_trip:any;
  map:any;
  view_trips: number = 1;
  list_trips: boolean = true;
  trips: any = [];
  trips_group: any;
  start_trip: any;
  end_trip: any;
  date_trip: any;
  has_trip:boolean;
  // variables de paginacion
  q: any = 1;
  p: any = 1;
  t: any = 1;
  select_package = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router,private spinner: NgxSpinnerService, private usersService: UsersService) { }

	ngOnInit() {
    //this.route.snapshot.params['id'];
    this.route.params.subscribe(params => {
      this.car_id = params.id_car
      //console.log(this.car_id)
      this.getInfoCar();
      this.getKmsPurchase();
    });
		
  }

  getInfoCar(){
    this.usersService.getCarBasic(this.car_id)
    .subscribe(
    (data:any)=> {
      this.car = data;
      this.rate_car = this.car.rate;
     //console.log(this.car.policy.get_monthly_payments.paid_at_date.sort())
      this.car.policy.get_monthly_payments.sort(function(a,b){
        return (b.id) - (a.id);
      });
      console.log(this.car)
      this.get_packages()
    });
  }

  get_packages(){
    console.log("rate " + this.rate_car)
    this.usersService.getPackageByCost(this.rate_car).subscribe(
      (data: any) => {
        console.log(data);
        this.packages = [];
        if (data){
          for(let package_kilometers of data) {
            this.packages.push(package_kilometers)
          }
        }
        //this.packages = data.packages
        // var urlParams = new URLSearchParams(window.location.search);
        // if(urlParams.has('recharge')){
        //   $("#recharge-tab").trigger("click");
        // }
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  Onselect(package_select){
    this.select_package = package_select
    localStorage.setItem('package', JSON.stringify(this.select_package))
    console.log(this.select_package)
  }
  isActive(package_select){
    return this.select_package === package_select 
  }

  getKmsPurchase(){ 
    this.usersService.get_kms_purchase(this.car_id)
    .subscribe(
      (data:any) => {
        console.log(data);
        this.purchases = [];
        if (data){
          for(let purchase of data) {
            this.purchases.push(purchase)
          }
        }
    });
  }

  validate_nip(){
    let siguiente = true;
    if(this.nip == ""){
      siguiente = false;
      this.error_nip = "ingresa un NIP";
    }else{
      if(this.nip.length < 4 || this.nip.length > 4){
        siguiente = false; 
        this.error_nip = "El NIP debe tener 4 digitos";
      }else{this.error_nip="";}
    }
    if(siguiente == true){
      this.get_nip();
      this.getTrips();
    }
  }

  get_nip(){
    let siguiente = true;
     this.usersService.get_nip(this.nip).subscribe(
      (data: any)=>{
        console.log(data)
        if(data.respose == siguiente){
          //this.getTrips();
          this.view_trips = 2;
          this.list_trips = false;
        }else{
          this.error_nip="NIP incorrecto"
        }
      },
      (error: any)=>{
        console.log(error)
      }
    )
  }

  getTrips(){
    this.spinner.show();
    this.usersService.get_trips(this.car_id).subscribe(
      (data: any) => {
        console.log(data);
        this.id_trip = data.id
        if(data){
          this.has_trip = true
          for(let trip of data) {
            this.trips.push(trip);
          }
        }else{
          this.has_trip = false
        }
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  get_trips_by_date(date: any) {
    //var param = new Date(date).toLocaleDateString("en-us");
    // console.log(date);
    this.spinner.show();
    this.trips = [];
     this.usersService.get_trips_by_date(this.car_id).subscribe(
      (data: any) => {        
        if(data){
          for(let trip of data) {
            //var date_trip = new Date(trip.started_at).toLocaleDateString("en-us");
            var date_trip = trip.started_at.substring(0,10);
            var param = date;
            if( param == null || param == undefined || param == ""){
              //swal('Selecciona una fecha')
            }else{
              if (date_trip == param){
                //console.log(trip);
                //this.trips = trip;
                this.trips.push(trip);
              }
            }
          }
        }
        this.spinner.hide();
      },
      (error: any) => {
        console.log(error)
      }
    );
  }

  car_error(title, header, error){
    this.title_modal_mechanic = title
    this.header_modal_mechanic = header
    this.error_modal = error
  }

  get_trip_details(id){
    this.id_trip = id;
    //console.log(this.id_trip)
    this.usersService.get_trip_details(this.id_trip).subscribe(
      (data: any) => {
        console.log(data); 
          this.start_trip = data.start_point.address
          this.end_trip = data.end_point.address
          this.date_trip = data.start_point.at
          var start = data.start_point.latLng;
          var end = data.end_point.latLng;
          
          if (this.map != undefined || this.map != null) {    
            this.map.remove();
          }  
            this.map = L.map('map');
             
            L.tileLayer('http://mt.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
              attribution: '<a href="https://sxkm.mx">SXKM</a> Google Maps, INEGI'
            }).addTo(this.map);

            this.map.setView(start, 12);

            var Start_icon = L.marker(start,{
              icon: L.icon({
              iconUrl: "assets/img/origen.png",
              iconSize:     [20, 30],
              iconAnchor:   [12, 20]
              })
            }).bindTooltip(this.start_trip);

            var End_icon = L.marker(end,{
              icon: L.icon({
              iconUrl: "assets/img/destino.png",
              iconSize:     [20, 30],
              iconAnchor:   [0, 30]
              })
            }).bindTooltip(this.end_trip); 

            var line = L.polyline(data.latLngs,{color: "#76bd1d"}).addTo(this.map).addTo(this.map);
            var line2 = L.polyline(data.high, {color: "red"}).bindTooltip("Velocidad mayor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line3 = L.polyline(data.medium, {color: "blue"}).bindTooltip("Velocidad mayor a 40 kms/hr y menor a 70 kms/hr", {"sticky":true}).addTo(this.map);
            var line4 = L.polyline(data.low, {color: "green"}).bindTooltip("Velocidad menor a 40 kms/hr", {"sticky":true}).addTo(this.map);

            this.map.invalidateSize();
            Start_icon.addTo(this.map);
            End_icon.addTo(this.map); 
            this.getForceG();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getForceG(){
    console.log(this.id_trip)
    var ctx = document.getElementById("fuerzas-g");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
    });
    this.usersService.getForce(this.id_trip).subscribe(
      (data:any)=>{
        console.log(data)
      }
    )
  }

}
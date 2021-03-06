import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { HubspotService } from '../../services/hubspot.service';
import { OperatorsService } from '../../services/operators.service';
import { UsersService } from '../../services/users.service';
import { PaginationService } from '../../services/pagination.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Seller } from '../../constants/seller';
import { LoginService } from '../../services/login.service';
import { LoaderService } from '../../services/loader.service';

declare var $:any;
import swal from 'sweetalert';

@Component({
  selector: 'app-panelpolicies',
  templateUrl: './panelpolicies.component.html',
  styleUrls: ['./panelpolicies.component.scss']
})
export class PanelpoliciesComponent implements OnInit {
  seller:any;
  filters: any ="device_states,unassigned";
  policies_info: any = {
    page: 1,
    pages:1,
		pagination: Array(),
    total: 0,
    seller_id: "",
    policy_states: "",
    km_states: "",
    membership_states: "",
    seller_states: "",
    device_states: "unassigned",
    vin_states: "",
    search: "",
    from_date: "",
    to_date:""
  }
  policies: any = Array();
  devices:any = Array();
  policy_device: any = {
    policy_id: "",
    device_id: "",
    imei: ""
  }
  policy_assign_seller: any = {
    email: "",
		policy_id: "",
		seller_id: "",
		hubspot_id: ""
  }
  policy_user:any = {
    policy_id: "",
    sxkm_id: "",
    user_id_old: "",
    email_old: "",
    user_id_new: "",
    email_new: "",
    users: Array(),
    password: "",
    subscription_id: ""
  }
  policy_delete: any = {
    policy_id: "",
    sxkm_id: "",
    password: "",
    reason: ""
  }
  tracking:any ={
    id: 0,
    type: 1,
    future_call:false ,
    date: "",
    time:"",
    customer_tracking:Array()
  }
  tracking_options: any = {
    departments: Array(),
    department: Array(),
    tracking_call_results: Array(),
    tracking_call_types: Array()
  }
  tracking_customer: any = {
    customer_tracking: {
      customer_id: 0,
      policy_id: 0,
      department: "",
      close_reason: "",
      coment: ""
    },
    tracking_call: {
      reason: "",
      assigned_user_id: 0,
      scheduled_call_date: "",
      result: "",
      note: "",
      call_type: ""
    }
  }
  sellers: any=Array();
  link: any ="http://dev2.sxkm.mx";
  excel: any = "";
  reasons_cancel: any;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private hubspotService: HubspotService, private operatorsService: OperatorsService,private spinner: NgxSpinnerService, private paginationService: PaginationService, private loginService: LoginService, private usersService: UsersService, private loader: LoaderService) { }
  
  ngOnInit() {
    //Push.create('Hello World!')
    this.seller = this.loginService.getSession();
    this.operatorsService.getSellers()
    .subscribe((data:any)=>{
      if(data.result)
      this.sellers= data.sellers;
    })
    if(this.seller.rol<3) this.policies_info.seller_id=this.seller.id;
    
    this.initPolicies();
    this.operatorsService.getReasonsCancelPolicy()
    .subscribe((data:any)=>{
      if(data){
        this.reasons_cancel = data;
      }
    });
    this.operatorsService.getTrackingOptions()
    .subscribe((data:any)=>{
      if(data.result){
        this.tracking_options.departments = data.data.departments 
        this.tracking_options = {
          departments: data.data.departments,
          department: data.data.departments[0],
          tracking_call_results: data.data.tracking_call_results ,
          tracking_call_types: data.data.tracking_call_types
        }
      }
    })
  }
  initPolicies(){
    if(localStorage.getItem("policies_info")){
			let policies_info= JSON.parse(localStorage.getItem("policies_info"));
			console.log("localstorage");
			console.log(policies_info);

			this.policies_info = {
        page: policies_info.page,
        pages:policies_info.pages,
        pagination: Array(),
        total: policies_info.total,
        seller_id: policies_info.seller_id,
        policy_states: policies_info.policy_states,
        km_states: policies_info.km_states,
        membership_states: policies_info.membership_states,
        seller_states: policies_info.seller_states,
        device_states: policies_info.device_states,
        vin_states: policies_info.vin_states,
        search: policies_info.search,
        from_date: policies_info.from_date,
        to_date:policies_info.to_date
      }
			if(this.policies_info.policy_states!='')	
				this.filters = "policy_states,"+this.policies_info.policy_states;
			if(this.policies_info.km_states!='')	
        this.filters = "km_states,"+this.policies_info.km_states;
      if(this.policies_info.membership_states!="")
        this.filters= "membership_states,"+policies_info.membership_states;
      if(this.policies_info.seller_states!="")
        this.filters= "seller_states,"+policies_info.seller_states;
      if(this.policies_info.device_states!="")
        this.filters ="device_states,"+policies_info.device_states;
      if(this.policies_info.vin_states!="")
        this.filters="vin_states,"+policies_info.vin_states;
    }
    this.getPolicies();
  }

  getPolicies(){
    this.policies_info.pagination = Array();
    this.policies_info.pages =1;
    this.policies_info.total= 0;

    this.loader.show();
    if(!this.policies_info.to_date)
		  this.policies_info.to_date = this.policies_info.from_date;
		if(this.policies_info.to_date<this.policies_info.from_date)
      this.policies_info.to_date = this.policies_info.from_date;
    localStorage.setItem("policies_info",JSON.stringify(this.policies_info));
    this.operatorsService.getPolicies(this.policies_info)
    .subscribe((data:any)=>{
      console.log(data)
      this.policies=data.policies;
      this.excel = this.link+data.export_url;
      this.policies_info.total = data.total_rows;
      this.policies_info.pages = data.pages;
      this.policies_info.pagination = this.paginationService.getPager(this.policies_info.pages,this.policies_info.page,10);
      this.loader.hide();
      console.log(this.policies_info)
    });
  }
  searchPolicies(){
    this.policies_info.seller_id= "";
    this.policies_info.policy_states= Array();
    this.policies_info.km_states= Array();
    this.policies_info.membership_states= Array();
    this.policies_info.seller_states= Array();
    this.policies_info.device_states= Array();
    this.policies_info.vin_states= Array();
    this.policies_info.from_date="";
    this.policies_info.to_date=""; 
    this.filters="";
    this.getPolicies();
  }
  setFilters(){
    let policy_states = Array();
    let km_states = Array();
    let membership_states = Array();
    let seller_states = Array();
    let device_states  = Array(); 
    let vin_states = Array();
    let filter = this.filters.split(',');
    if(filter[0]=='policy_states')
      policy_states.push(filter[1]);
    if(filter[0]=='km_states')
      km_states.push(filter[1]);
    if(filter[0]=='membership_states')
      membership_states.push(filter[1]);
    if(filter[0]=='seller_states')
      seller_states.push(filter[1]);
    if(filter[0]=='device_states')
      device_states.push(filter[1]);
    if(filter[0]=='vin_states')
      vin_states.push(filter[1]);

    this.policies_info.policy_states = policy_states;
    this.policies_info.km_states = km_states;
    this.policies_info.membership_states = membership_states;
    this.policies_info.seller_states = seller_states;
    this.policies_info.device_states = device_states;
    this.policies_info.vin_states = vin_states;
    this.getPolicies();
  }


  //Asignar dispositivo
  setDevice(policy_id, device_id,imei){
    console.log(imei)
    this.policy_device = {
      policy_id: policy_id,
      device_id: device_id,
      imei: imei
    } 
  }
  changeDevice(){
    this.operatorsService.searchDevice(this.policy_device.imei)
      .subscribe((data:any)=>{
        console.log(data);
        let bool = false;
        this.devices = data.devices;
        data.devices.forEach(element => {
          if(element.imei==this.policy_device.imei){
            bool = true;
            if(element.status=='in_stock'){
              this.policy_device.device_id = element.id;
              this.operatorsService.updateDevicePolicy(this.policy_device)
              .subscribe((data:any)=>{
                if(data.result){
                  this.policies.forEach(
                    item => {
                      if(item.id==this.policy_device.policy_id){
                        item.device.id = this.policy_device.device_id;
                        item.device.imei = this.policy_device.imei;
                        item.device.assigned = true;
                        swal("El dispositivo se asigno correctamente ", "", "success");
                      } 
                    }
                  );
                }
                else swal("No se pudo asignar el dispositivo ", "El dispositivo se encuentra asignado", "error");
              })
              
            }
            else swal("No se pudo asignar el dispositivo ", "El dispositivo se encuentra asignado", "error");
          }
        });
        if(!bool) swal("Hubo un problema", "No se pudo asignar el dispositivo porque el IMEI no existe", "error");
    })
  }
  //Cambiar de vendedor
  setPolicyAssignSeller(email, policy_id, seller_id){
    this.policy_assign_seller = {
      email: email,
			policy_id: policy_id,
			seller_id: seller_id,
			hubspot_id: ""
    }
    if(seller_id==null) this.policy_assign_seller.seller_id= "";
  }
  changeSeller(){
    this.sellers.forEach(element => {
			if(this.policy_assign_seller.seller_id==element.id)
			this.policy_assign_seller.hubspot_id = element.hubspot_id
    });
    
    let full_name="";
		let seller_id=this.policy_assign_seller.seller_id;
    console.log(this.policy_assign_seller);
    this.operatorsService.updateSellerPolicy(this.policy_assign_seller.policy_id,this.policy_assign_seller.seller_id)
    .subscribe((data:any)=>{
    console.log(data);
      if(data.result){
        this.sellers.forEach(item => {
          if(item.id==this.policy_assign_seller.seller_id){
            full_name = item.full_name;
            seller_id = item.id;
          } 
        });
        console.log("Nombre: "+full_name);
        this.policies.forEach( item => {
          if(item.id==this.policy_assign_seller.policy_id){
            if(item.seller){
              item.seller.id = seller_id;
              item.seller.full_name = full_name;
            } 
            else{
              item.seller = {
                id: seller_id,
                full_name: full_name
              }
            }    
            swal("Se ha cambiado al vendedor correctamente", "", "success");
            this.validateAccessToken();
          } 
        });
      }
      else swal("No se pudo asignar al vendedor ", "", "error");
    })
  }

  //Cambiar usuario de poliza
  setPolicyChangePolicyUser(policy_id, sxkm_id,user_id_old,email_old,subscription){
    let subscription_id = "";
    if(subscription)
      subscription_id = subscription.id;
    this.policy_user = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      user_id_old: user_id_old,
      email_old: email_old,
      user_id_new: "",
      email_new: "",
      users: Array(),
      subscription_id: subscription_id
    }
    console.log("Cambiar poliza")
    console.log(this.policy_user);
  }
  updateChangePolicyUser(){
    this.loader.show();//
    this.operatorsService.validatePassword(this.seller.id,this.policy_delete.password)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){
        if(this.policy_user.user_id_new==""){
          this.operatorsService.validateUser(this.policy_user.email_new)
          .subscribe((data:any)=>{
            console.log(data);
            if(data.result){
              this.loader.hide();
              this.policy_user.users = data.data;
              swal("El correo  ya existe","Selecciona el correo de usuario existente","warning");
            }
            else {
              this.changeUserPolicy();
            }
          })
        }
        else this.changeUserPolicy();
      }
      else{
        this.loader.hide();
        swal("No se pudo cambiar el correo","La contraseña ingresada no es correcta inténtalo de nuevo","error");
      }
    });
    
  }
  changeUserPolicy(){
    let user = {
      new_user_id: this.policy_user.user_id_new,
	    email: this.policy_user.email_new,
	    policy_id: this.policy_user.policy_id
    }
    if(this.policy_user.user_id_new!="") user.email="";
    //console.log(this.policy_user)
    console.log("Datos para enviar")
    console.log(user);
    
    if(this.policy_user.subscription_id!=""){
      this.loader.hide();
      swal("Ésta póliza tiene suscripción, ¿Estás seguro que deseas cambiar de usuario?","Si cambias de usuario, la suscripción se cancelará", {
        buttons: ["Cancelar", "Aceptar"],
      })
      .then((value) => {
        if(value){
          this.loader.show();
          this.operatorsService.changeUserEmail(this.policy_user.user_id_old,user)
          .subscribe((data2:any)=>{
            console.log(data2);
            if(data2.result){
              let i =0;
              let j=0;
              this.policies.forEach(element => {
                if(this.policy_user.policy_id == element.id){
                  j=i;
                }
                i++;
              });
              this.policies[j].user.id = data2.data.user.id;
              this.policies[j].user.email = data2.data.user.email;
              $("#modalChangeUser").modal("hide");
              this.loader.hide();
              swal("Se ha reasignado la póliza correctamente","","success");
            }
            else{
              this.loader.hide();
              swal("Hubo un problema","No se pudo reasignar el correo a la póliza","error");
            }
          })
        }
      });
    }
    else{
      this.operatorsService.changeUserEmail(this.policy_user.user_id_old,user)
      .subscribe((data2:any)=>{
        console.log(data2);
        if(data2.result){
          let i =0;
          let j=0;
          this.policies.forEach(element => {
            if(this.policy_user.policy_id == element.id){
              j=i;
            }
            i++;
          });
          this.policies[j].user.id = data2.data.user.id;
          this.policies[j].user.email = data2.data.user.email;
          $("#modalChangeUser").modal("hide");
          this.loader.hide();
          swal("Se ha reasignado la póliza correctamente","","success");
        }
        else{
          this.loader.hide();
          swal("Hubo un problema","No se pudo reasignar el correo a la póliza");
        }
      })
    }
    
  }

  //Cancelar póliza
  setPolicyDelete(policy_id,sxkm_id){
    this.policy_delete = {
      policy_id: policy_id,
      sxkm_id: sxkm_id,
      password: "",
      reason: ""
    }
  }
  deletePolicyModal(){
    this.loader.show();
    this.operatorsService.validatePassword(this.seller.id,this.policy_delete.password)
    .subscribe((data:any)=>{
      console.log(data);
      if(data.result){    
        this.operatorsService.getSubscriptionsByPolicy(this.policy_delete.policy_id)
        .subscribe((data2:any)=>{
          console.log(data2);
          if(data2.result){
            if(data2.subscriptions.length>1){
              this.operatorsService.cancelPolicy(this.policy_delete.policy_id, this.policy_delete.reason)
              .subscribe((data:any)=>{
                console.log(data)
                $("#modalCancelPolicy").modal("hide");
                this.loader.hide();
                if(data.result){
                  this.policies.forEach(element => {
                    if(element.id==this.policy_delete.policy_id)
                    element.status = 'canceled';
                  });
                  swal(data.msg, "", "success");
                }
                else{
                  swal("Hubo un problema", data.msg, "error");
                }
              })  
            }
            else{
              swal("Ésta poliza tiene suscripción","Da click en continuar para cancelar la póliza", {
                buttons: ["Cancelar", "Aceptar"],
              })
              .then((value) => {
                console.log(value);
                if(value){
                  
                  this.operatorsService.cancelPolicy(this.policy_delete.policy_id,this.policy_delete.reason)
                  .subscribe((data:any)=>{
                    console.log(data)
                    $("#modalCancelPolicy").modal("hide");
                    this.loader.hide();
                    if(data.result){
                      this.policies.forEach(element => {
                        if(element.id==this.policy_delete.policy_id)
                        element.status = 'canceled';
                      });
                      swal(data.msg, "", "success");
                    }
                    else{
                      swal("Hubo un problema", data.msg, "error");
                    }
                  }) 
                }
              })
            }
          }
        })
          
      }
      else{
        this.loader.hide();
        $("#modalCancelPolicy").modal("hide");
        swal("No se pudo cancelar la póliza","La contraseña es incorrecta","error");
      }
    })
  }
  //Tracking
  setCustomerTracking(type,policy,tracking_id=null){
    this.tracking.type = type;
    this.tracking.id=tracking_id;
    this.tracking_customer.customer_tracking.customer_id = policy.user.id;
    this.tracking_customer.customer_tracking.policy_id = policy.id;
    this.tracking.customer_tracking=Array();
   
    
  }
  changeDepartment(event: any){
    //console.log(event);
    let index = event.target.options.selectedIndex;
    this.tracking_options.department= this.tracking_options.departments[index];

  }
  changeRadio(){
    this.tracking.future_call = !this.tracking.future_call;
    this.tracking.data="";
    this.tracking.time="",
    this.tracking_customer.customer_tracking.close_reason="";
  }
  createTrackingCustomer(){
    this.tracking_customer.tracking_call.scheduled_call_date = this.tracking.date+" "+this.tracking.time;
    console.log(this.tracking_customer);
    if(this.tracking.type==1 && !this.tracking.future_call){
      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          swal(data.msg,"","success");
          this.getPolicies();
        }
      })
    }
    if(this.tracking.type==1 && this.tracking.future_call){
      let new_call = { 
        tracking_call: {
          topic: this.tracking_customer.tracking_call.topic,
          call_type: this.tracking_customer.tracking_call.call_type,
          assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
          scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
          result: "",
          note: ""
        }
      }
      this.tracking_customer.tracking_call.scheduled_call_date = "";
      this.tracking_customer.tracking_call.assigned_user_id = this.seller.id;

      this.operatorsService.createCustomerTracking(this.tracking_customer)
      .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          this.operatorsService.createTrackingCall(data.customer_tracking.id,new_call)
          .subscribe((data2:any)=>{
            console.log(data2);
            if(data2.result){
              $("#modalSeguimiento").modal("hide");
              this.getPolicies();
              swal("Llamada registrada correctamente","","success")
              
            }
            else swal(data2.msg,"","error");
          })
        }
      })
    }
    if(this.tracking.type==2){
      console.log("2");
      let call_made:any;
      if(!this.tracking.future_call){
        call_made = { 
          tracking_call: {
            result: this.tracking_customer.tracking_call.result,
            note: this.tracking_customer.tracking_call.note
          },
          close_tracking: true,
          customer_tracking: {
            close_reason: this.tracking_customer.customer_tracking.close_reason,
            comment: this.tracking_customer.customer_tracking.coment
          }
        }
      }
      else{
        call_made = { 
          tracking_call: {
            result: this.tracking_customer.tracking_call.result,
            note: this.tracking_customer.tracking_call.note
          }
        }
      }

     console.log(call_made)
     this.operatorsService.createTrackingCallMade(this.tracking.id,call_made)
     .subscribe((data:any)=>{
        console.log(data);
        if(data.result){
          if(this.tracking.future_call){
            let new_call = { 
              tracking_call: {
              topic: this.tracking_customer.tracking_call.topic,
              call_type: this.tracking_customer.tracking_call.call_type,
              assigned_user_id: this.tracking_customer.tracking_call.assigned_user_id,
              scheduled_call_date: this.tracking_customer.tracking_call.scheduled_call_date,
              result: "",
              note: ""
              }
            }
            this.operatorsService.createTrackingCall(this.tracking.id,new_call)
            .subscribe((data:any)=>{
              console.log(data);
              if(data.result){
                $("#modalSeguimiento").modal("hide");
                swal("Llamada registrada correctamente","","success")
              }
              else swal(data.msg,"","error");
            })
          }
          else {
            $("#modalSeguimiento").modal("hide");
            this.getPolicies();
            swal("Seguimiento cerrado correctamente","","success")
          }
        }
      }) 
    }
  }


  //HUBSPOT
  updateHubspot(){
		let hubspot = Array();
		
    	hubspot.push({
        "property": "hubspot_owner_id",
        "value": this.policy_assign_seller.hubspot_id
      });
    	let form = {
			"properties"  : hubspot,
			"access_token": localStorage.getItem("access_token"),
			"vid": localStorage.getItem("vid")
		}
    this.hubspotService.updateContactVid(form)
    .subscribe((data:any)=>{
      console.log(data)
    })
	}

	validateAccessToken(){
    this.hubspotService.validateToken(localStorage.getItem("access_token"))
    .subscribe((data:any) =>{ 
		  console.log(data)
      if(data.status=='error'){
        this.hubspotService.refreshToken()
        .subscribe((data:any)=>{
          localStorage.setItem("access_token",data.access_token);
        	this.getContactHubspot();
        });
      }
      else this.getContactHubspot();
    });
	}
	getContactHubspot(){
		this.hubspotService.getContactByEmail(this.policy_assign_seller.email,localStorage.getItem("access_token"))
    .subscribe((data:any) =>{ 
      console.log(data);
      localStorage.setItem("vid",data.vid);
      this.updateHubspot();
    })
  }
}

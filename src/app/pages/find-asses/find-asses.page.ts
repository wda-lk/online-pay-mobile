import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApicallService } from '../../services/apicall.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DataService } from 'src/app/services/data.service';
import { IonicToastService } from 'src/app/services/ionic-toast.service';

@Component({
  selector: 'app-find-asses',
  templateUrl: './find-asses.page.html',
  styleUrls: ['./find-asses.page.scss'],
})
export class FindAssesPage implements OnInit {
  apiurl = environment.apiUrl + 'ass/';
  atdurl = environment.apiUrl + 'atd/';
  constructor(private apiCall: ApicallService, private router: Router, private stor: Storage, private dataService: DataService, private tost: IonicToastService,) { }
  idAssess;
  hasAssessData = false;
  isLoading = false;
  selectedAssessment = null;
  selectedBalance = null;
  amount = 0.00;
  assSelectedListToATD = [];

  wardList;
  streetList;
  selectedWard;
  selectedStreet;
  assno;
  assessmentArray;
  selected;

  debit;
  tot;
  qpay = 0;
  fromLastYear;
  nextYearOver;
  history;

  q1 = false; q2 = false; q3 = false; q4 = false;
  q1d = false; q2d = false; q3d = false; q4d = false;
  catPay = true;

  ngOnInit() {
    this.loadWardCombo();
    this.setDisabled();
  }

  setDisabled() {
    let month = new Date().getMonth() + 1;

    if (month < 4) {
      this.q1d = false; this.q2d = false; this.q3d = false; this.q4d = false;
    } else if (month < 7) {
      this.q1d = true; this.q2d = false; this.q3d = false; this.q4d = false;
    } else if (month < 10) {
      this.q1d = true; this.q2d = true; this.q3d = false; this.q4d = false;
    } else if (month <= 12) {
      this.q1d = true; this.q2d = true; this.q3d = true; this.q4d = false;
    }

  }






  checkQ() {
    let month = new Date().getMonth() + 1;
    let qvlaue = this.selectedAssessment?.ass_allocation * this.selectedAssessment?.ass_nature_year_rate / 400
    this.qpay = 0;
    if (month == 1) {
      if (this.q1 && !this.q2 && !this.q3 && !this.q4) {
        let discount = Number(qvlaue) * 5 / 100;
        this.qpay = (Number(qvlaue)) - (Number(discount));
      } else if (this.q1 && this.q2 && !this.q3 && !this.q4) {
        let discount = Number(qvlaue) * 5 / 100;
        this.qpay = (Number(qvlaue) * 2) - (Number(discount) * 2);
      } else if (this.q1 && this.q2 && this.q3 && !this.q4) {
        let discount = Number(qvlaue) * 5 / 100;
        this.qpay = (Number(qvlaue) * 3) - (Number(discount) * 3);
      } else if (this.q1 && this.q2 && this.q3 && this.q4) {
        let discount = Number(qvlaue) * 10 / 100;
        this.qpay = (Number(qvlaue) * 4) - (Number(discount) * 4);
      }
    } else if (month > 1 && month < 4) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q1 && !this.q2 && !this.q3 && !this.q4) {
        this.qpay = Number(qvlaue);
      } else if (this.q1 && this.q2 && !this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount)) + Number(qvlaue);
      } else if (this.q1 && this.q2 && this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue) * 2) - (Number(discount) * 2) + Number(qvlaue);
      } else if (this.q1 && this.q2 && this.q3 && this.q4) {
        this.qpay = (Number(qvlaue) * 3) - (Number(discount) * 3) + Number(qvlaue);
      }
    } else if (month == 4) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q2 && !this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount));
      } else if (this.q2 && this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue) * 2) - (Number(discount) * 2);
      } else if (this.q2 && this.q3 && this.q4) {
        this.qpay = (Number(qvlaue) * 3) - (Number(discount) * 3);
      }
    } else if (month > 4 && month < 7) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q2 && !this.q3 && !this.q4) {
        this.qpay = Number(qvlaue);
      } else if (this.q2 && this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount)) + Number(qvlaue);
      } else if (this.q2 && this.q3 && this.q4) {
        this.qpay = (Number(qvlaue) * 2) - (Number(discount) * 2) + Number(qvlaue);
      }
    } else if (month == 7) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q3 && !this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount));
      } else if (this.q3 && this.q4) {
        this.qpay = (Number(qvlaue) * 2) - (Number(discount) * 2);
      }
    } else if (month > 7 && month < 10) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q3 && !this.q4) {
        this.qpay = Number(qvlaue);
      } else if (this.q3 && this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount)) + Number(qvlaue);
      }
    } else if (month == 10) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q4) {
        this.qpay = (Number(qvlaue)) - (Number(discount));
      }
    } else if (month > 10) {
      let discount = Number(qvlaue) * 5 / 100;
      if (this.q4) {
        this.qpay = Number(qvlaue);
      }
    }
    this.tot = Number(this.selectedBalance.tot) + Number(this.debit) + Number(this.qpay) - Number(this.fromLastYear);
    this.tot = Math.ceil(this.tot);
  }


  findAssessment() {
    this.isLoading = true;
    this.apiCall.call(this.apiurl + 'getDetails', { id: this.idAssess }, data => {
      // this.hasAssessData = true;
      this.selectedAssessment = data[0];
      console.log(this.selectedAssessment);
      // this.isLoading = false;
      this.tot = 0; this.qpay = 0;
      this.q1 = false; this.q2 = false; this.q3 = false; this.q4 = false;
      this.getArrears();
      this.getDebit();
      this.getFromLastYear();
      this.getNextYearOver();
      this.getPayHistory();
      this.isPending();
    });
  }

  getDebit() {
    this.apiCall.call(this.apiurl + 'getDebit', { id: this.idAssess }, data => {

      this.tot = 0;
      this.debit = 0;
      if (data[0]) {
        this.debit = data[0].Ass_balance;

      }
      this.tot = Number(this.selectedBalance.tot) + Number(this.debit) + Number(this.qpay);
      this.tot = Math.ceil(this.tot);
    });
  }

  getFromLastYear() {
    let year = new Date().getFullYear();
    this.apiCall.call(this.apiurl + 'getFromLastYear', { id: this.idAssess, year: year }, data => {

      this.fromLastYear = 0;
      if (data[0]) {
        this.fromLastYear = data[0].process_update_arrears;

      }

    });
  }

  getNextYearOver() {
    let year = new Date().getFullYear();
    this.apiCall.call(this.apiurl + 'getNextYearOver', { id: this.idAssess, year: year }, data => {

      this.nextYearOver = 0;
      if (data[0]) {
        this.nextYearOver = data[0].ov;

      }

    });
  }

  getPayHistory() {

    this.apiCall.call(this.apiurl + 'getPayHistory', { id: this.idAssess }, data => {

      this.history = data;

    });
  }

  isPending() {
    this.apiCall.call(this.apiurl + 'isPending', { id: this.idAssess }, data => {
      this.catPay = true;
      if (data[0]) {
        this.catPay = false;
        this.tost.showToast('Warning', 'Already Paid. ' + data[0].collect_time, 'warning');
      }
    });
  }



  getArrears() {
    // year eka hadaganna oni
    let year = new Date().getFullYear();
    this.apiCall.call(this.apiurl + 'getArrears', { id: this.idAssess, year: year }, data => {
      this.selectedBalance = data;
      this.hasAssessData = true;
      console.log(data);
      this.isLoading = false;
    });
  }

  goToAtd() {
    this.assSelectedListToATD.push(this.selectedAssessment);
    // this.router.navigate(['/atd-form', this.idAssess]);
    console.log(this.assSelectedListToATD);
  }



  loadWardCombo() {
    this.apiCall.call(this.apiurl + 'getWardList', {}, data => {
      console.log(data);
      this.wardList = data;
    });
  }

  loadStreetCombo() {
    this.apiCall.call(this.apiurl + 'getStreetList', { id: this.selectedWard.idWard }, data => {
      console.log(data);
      this.streetList = data;
    });
  }

  searchAssessment() {
    this.idAssess = 0;
    this.selectedAssessment = null;
    const obj = {
      ward: this.selectedWard.idWard,
      street: this.selectedStreet.idStreet,
      assno: this.assno
    };
    this.apiCall.call(this.apiurl + 'searchAssessment', obj, data => {
      console.log(data);
      this.assessmentArray = data;
    });
  }

  addAssessment(ass) {
    this.selected = ass;
    console.log(this.selected);
    this.assessmentArray = null;
    this.idAssess = this.selected.idAssessment;
    this.findAssessment();
  }

  goToPay() {
    this.dataService.setData('ass', this.selectedAssessment);
    this.dataService.setData('amount', this.amount);
    this.router.navigate(['/pay-asses']);
  }



}

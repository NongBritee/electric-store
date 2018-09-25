import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  private result: string[] = [];
  private orders = [{
    id: 1,
    name: 'test1'
  },
  {
    id: 2,
    name: 'test2'
  }];

  private groupItemList: AngularFireList<any>;
  private groupItem: any;
  private form = this.fb.group({
    groups: []
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private db: AngularFireDatabase) {
    this.groupItemList = this.db.list('/group-item');
    console.log('test');
  }

  // submit() {
  //   const selectedOrderIds = this.form.value.orders
  //     .map((v, i) => v ? this.orders[i].id : null)
  //     .filter(v => v !== null);

  //   console.log(selectedOrderIds);
  // }

  ngOnInit() {
    this.groupItemList.snapshotChanges().pipe(map((change) => {
      return change.map((_change) => {
        return {
          key: _change.key,
          value: _change.payload.val()
        }
      })
    })).subscribe((data) => {
      console.log('read: ', data);
      this.groupItem = data;
      // let groupControls: FormGroup[] = [];
      // this.groupItem.forEach(group => {
      //   let controls: FormArray;
      //   group.value.items.forEach(item => {
      //     controls.push(new FormControl(false));
      //   })
      //   groupControls.push(this.fb.group({
      //     control: 
      //   }));
      // });
      let groupControls = [this.fb.group({
        name: 'test',
        items: this.fb.array([new FormControl(false), new FormControl(false)])
      })]
      this.form = this.fb.group({
        groups: this.fb.array(groupControls)
      });
      console.log(this.form);
    });
  }

  toggleCheckbox(i,j) {
    
    // (this.form.controls.orders as FormArray).controls[i].setValue(!(this.form.controls.orders as FormArray).controls[i].value);
    console.log(this.groupItem[i].value.name);
    console.log(this.groupItem[i].value.items[j].name);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.css']
})
export class SettingItemComponent implements OnInit {

  private groupId: any;
  private itemAction: string = 'add';
  private itemUpdateId: string = '';
  private items: { name: string }[] = [];
  private itemList;
  private itemCollection: AngularFirestoreCollection;
  private itemForm = this.fb.group({
    name: [''],
    // items: this.fb.array([
    //   this.fb.control('')
    // ])
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private db: AngularFirestore) {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.itemCollection = this.db.collection('group-item/' + this.groupId);
    this.itemList = this.itemCollection.snapshotChanges().pipe(map(action => {
      return action.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return {
          id,
          ...data
        }
      })
    }));
  }

  ngOnInit() {
  }

  onSubmit() {
    // let newName = this.itemForm.value.name;
    // if (this.itemAction === 'add') {
    //   this.items.push({ name: newName });
    //   console.log('add item: ', this.itemForm.value.name);
    //   this.db.list('group-item/' + this.groupId).set('items', this.items);
    // } else {
    //   this.items[this.itemUpdateId] = { name: this.itemForm.value.name };
    //   console.log('update item: ', this.itemUpdateId);
    //   this.db.list('group-item/' + this.groupId).set('items', this.items);
    //   this.setDefaultAction();
    // }
    // this.itemForm.reset();
  }

  onEdit(i) {
    console.log('on edit: ', i)
    this.itemAction = 'edit';
    this.itemUpdateId = i;
    this.itemForm.controls['name'].setValue(this.items[i].name);
  }

  onDelete(i) {
    // console.log('remove key: ', i);
    // this.items.splice(i, 1);
    // this.db.list('group-item/' + this.groupId).set('items', this.items);
    // this.setDefaultAction();
  }

  onCancel() {
    this.itemForm.reset();
  }

  setDefaultAction() {
    this.itemAction = 'add';
  }

  goBack() {
    this.router.navigate(['setting']);
  }
}

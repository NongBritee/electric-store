import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.css']
})
export class SettingItemComponent implements OnInit {

  private groupId: any;
  private itemAction: string = 'add';
  private itemUpdateId: string = '';
  private items: any;
  private itemCollection: AngularFirestoreCollection;

  private itemForm = this.fb.group({
    name: ['']
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private db: AngularFirestore) {
    this.groupId = this.route.snapshot.paramMap.get('id');
    this.itemCollection = this.db.collection('item', ref => ref.where('groupId', '==', this.groupId).orderBy('createDate'));
    this.items = this.itemCollection.snapshotChanges().pipe(map(action => {
      return action.map(x => {
        const id = x.payload.doc.id;
        const data = x.payload.doc.data()
        return { id, ...data };
      })
    }));

  }

  ngOnInit() {
  }

  onSubmit() {
    let newName = this.itemForm.value.name;
    if (this.itemAction === 'add') {
      console.log('add item: ', this.itemForm.value.name);
      let timeStamp = new Date();
      this.itemCollection.add({ name: newName, groupId: this.groupId, createDate: timeStamp });
    } else {
      this.items[this.itemUpdateId] = { name: this.itemForm.value.name };
      console.log('update item: ', this.itemUpdateId);
      this.itemCollection.doc(this.itemUpdateId).update({ name: newName })
      this.setDefaultAction();
    }
    this.itemForm.reset();
  }

  onEdit(item) {
    console.log('on edit: ', item.id)
    this.itemAction = 'edit';
    this.itemUpdateId = item.id;
    this.itemForm.controls['name'].setValue((item.name));
  }

  onDelete(item) {
    console.log('remove key: ', item);
    this.itemCollection.doc(item.id).delete();
    this.setDefaultAction();
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

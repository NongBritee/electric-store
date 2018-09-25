import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  private title: string = '';
  private groupItemAction: string = 'add';
  private groupItemUpdateKey: string = '';
  private groupItem: any;
  private groupItemCollection: AngularFirestoreCollection<any>;
  private groupForm = this.fb.group({
    name: ['']
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private db: AngularFirestore) {
    this.title = route.snapshot.data["title"];
    this.groupItemCollection = this.db.collection('group-item');
    this.groupItem = this.groupItemCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    }));

  }

  ngOnInit() {
  }

  onSubmit() {
    let newName = this.groupForm.value.name;
    if (this.groupItemAction === 'add') {
      console.log('add group: ', this.groupForm.value.name);
      this.groupItemCollection.add({ name: newName });
    } else {
      console.log('update group: ', this.groupItemUpdateKey);
      this.groupItemCollection.doc(this.groupItemUpdateKey).update({ name: newName });
      this.setDefaultAction();
    }
    this.groupForm.reset();
  }

  onEdit(group) {
    console.log('on edit: ', group)
    this.groupItemAction = 'edit';
    this.groupItemUpdateKey = group.id;
    this.groupForm.controls['name'].setValue(group.name);
  }

  onDelete(group) {
    console.log('remove key: ', group.id);
    this.groupItemCollection.doc(group.id).delete();
    this.setDefaultAction();
  }

  onCancel() {
    this.groupForm.reset();
  }

  setDefaultAction() {
    this.groupItemAction = 'add';
  }

  goToSettingItem(id: string){
    this.router.navigate(['/setting-item', { id: id }]);
  }
}

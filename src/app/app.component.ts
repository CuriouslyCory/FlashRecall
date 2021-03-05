import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog/add-dialog.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecallItem } from './recall-item';
import { Tally } from './tally';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'flash-recall';
  recallItems$: Observable<RecallItem[]>;
  private talliesCollection : AngularFirestoreCollection<Tally>;
  tallies: Observable<Tally[]>;

  myVotes: Observable<any[]>;
  uid: string | null;
  userSub$: Subscription

  constructor(
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth, 
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
 ) {

    this.userSub$ = this.auth.user.subscribe({
      next: user => this.userChange(user),
      error: err => console.error(err),
      complete: () => console.log("Observer is complete")
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent, {height: '75%', width: '75%'});
    const action = "Close";

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      this.createNewFR(result);
      const message = "FR Saved";
      this._snackBar.open(message, action, {
        duration: 2000,
      });
    });
  }

  createNewFR(frBody: string) {
    console.log(this.uid);
    if(!this.uid){

    }
    const fr = {
      body: frBody,
      createdBy: this.uid,
      created: new Date(),
      up: 1,
      down: 0,
      neutral: 0
    };
    console.log(fr);
    this.firestore
      .collection("recall-items")
      .add(fr);
  }

  markRead(frId: string){
    this.firestore.collection("")
  }

  userChange(user){
    console.log('User sub updated, refreshing collections');
    this.uid = user.uid;
    this.talliesCollection = this.firestore.collection('tallies', ref => ref.where('uid', '==', user.uid));
    this.tallies = this.talliesCollection.stateChanges(['added','modified','removed']).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Tally;
        //console.log(typeof a.payload.doc.data().item);
        //console.dir(a.payload.doc.data().item);
        //console.log(a.payload.doc.ref);
        const itemPath = a.payload.doc.data().item.path;
        const itemDoc = this.firestore.doc<RecallItem>(itemPath);
        const item$ = itemDoc.valueChanges()

        const id = a.payload.doc.id;
        return {id, item$, ...data}
      }))
    )

  }


}

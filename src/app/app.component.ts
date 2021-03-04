import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog/add-dialog.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'flash-recall';
  recallItems: Observable<any[]>;
  myVotes: Observable<any[]>;
  uid: String;
  userSub: Subscription

  constructor(
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth, 
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.recallItems = firestore.collection('recall-items').valueChanges();

    this.userSub = this.auth.user.subscribe({
      next: user => this.uid = user.uid,
      error: err => console.error(err),
      complete: () => console.log("Observer is complete")
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent, {height: '400px', width: '600px'});
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

  createNewFR(frBody: String) {
    console.log(this.uid);
    let fr = {
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

}

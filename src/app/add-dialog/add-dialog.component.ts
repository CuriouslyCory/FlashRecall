import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent implements OnInit {

  bodyText = '';

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>) { }

  ngOnInit(): void {
  }

  saveFR() {
    this.dialogRef.close(this.bodyText);
  }

}

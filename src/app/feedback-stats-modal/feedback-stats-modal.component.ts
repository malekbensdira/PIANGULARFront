import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FeedbackStatsData {
  statsData: { positive: number; negative: number; neutral: number };
  agentName: string;
}

@Component({
  selector: 'app-feedback-stats-modal',
  templateUrl: './feedback-stats-modal.component.html',
  styleUrls: ['./feedback-stats-modal.component.css']
})
export class FeedbackStatsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FeedbackStatsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeedbackStatsData
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { Goal } from '../models/goal.model';
import { GoalService } from '../services/goal.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar', { read: ElementRef }) sidebarRef!: ElementRef;
  logoAnimationDone: boolean = false;
  goals: Goal[] = [];
  originalGoals: Goal[] = [];
  userEmail: string = '';
  showLoading: boolean = true;
  progress: number = 0;
  searchDeadline: string = '';
  minDate: string;
  confirmationMessageVisible: boolean = false;
  confirmationMessage: string = 'Goal add successfully !';

  showModal: boolean = false;
  isModalOpen: boolean = false;
  newGoal = { content: '', priority: 1, deadline: '' };

  isEditModalOpen: boolean = false;
  editedGoal: any = {};

  priorityOptions: number[] = [];
  goalAdded: boolean = false;

  errorMessages = { content: '', priority: '', deadline: '' };
  todayDate: string = new Date().toISOString().split('T')[0];  // Date actuelle au format yyyy-mm-dd

  constructor(private goalService: GoalService, private cdr: ChangeDetectorRef) {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('email') || '';
    if (this.userEmail) {
      this.loadGoalsByEmail();
    }
  }

  ngAfterViewInit(): void {
    this.sidebarRef.nativeElement.addEventListener('animationend', () => {
      this.logoAnimationDone = true;
    });
  }

  private loadGoalsByEmail(): void {
    this.showLoading = true;
    this.goalService.getGoalsByEmail(this.userEmail).subscribe({
      next: data => {
        this.originalGoals = data;
        this.goals = data.map(goal => ({
          ...goal,
          expired: goal.deadline < this.todayDate && !goal.status  // Ajout de la logique pour vérifier si la deadline est expirée
        }));
        this.showLoading = false;
        this.calculateProgress();
        this.generatePriorityOptions();
      },
      error: () => (this.showLoading = false)
    });
  }

  private generatePriorityOptions(): void {
    this.priorityOptions = Array.from({ length: this.goals.length }, (_, i) => i + 1);
  }

  toggleStatus(goal: Goal): void {
    this.goalService.updateGoalStatus(goal.id, !goal.status).subscribe(updated => {
      goal.status = updated.status;
      this.calculateProgress();
    });
  }

  private calculateProgress(): void {
    const total = this.goals.length;
    const done = this.goals.filter(g => g.status).length;
    this.progress = total ? Math.round((done / total) * 100) : 0;
    console.log('Progress:', this.progress);
    this.cdr.detectChanges();
  }

  searchGoals(): void {
    if (this.searchDeadline) {
      const sel = new Date(this.searchDeadline).toDateString();
      this.goals = this.originalGoals.filter(goal => new Date(goal.deadline).toDateString() === sel);
    } else {
      this.goals = [...this.originalGoals];
    }
    this.calculateProgress();
  }

  sortGoalsByPriority(): void {
    this.goals.sort((a, b) => a.priority - b.priority);
  }

  resetGoals(): void {
    this.searchDeadline = '';
    this.goals = [...this.originalGoals];
    this.calculateProgress();
  }

  openModal(): void {
    this.generatePriorityOptions();
    this.showModal = true;
    this.isModalOpen = true;
    this.newGoal = { content: '', priority: 1, deadline: '' };
    this.errorMessages = { content: '', priority: '', deadline: '' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  submitNewGoal(): void {
    const newGoal = {
      content: this.newGoal.content,
      priority: this.newGoal.priority,
      deadline: this.newGoal.deadline,
      status: false,
      email: this.userEmail // Assuming you have a user email in your context
    };

    this.goalService.createGoal(newGoal).subscribe(
      goal => {
        this.goals.push(goal);  // Add the new goal to the list
        this.showModal = false;
        this.calculateProgress();
        this.showConfirmationMessage('Goal added successfully!');
      },
      error => {
        console.error('Error adding new goal', error);
      }
    );
  }

  showConfirmationMessage(message: string): void {
    this.confirmationMessage = message;
    this.confirmationMessageVisible = true;
    setTimeout(() => {
      this.confirmationMessageVisible = false;
    }, 2000);
  }

  editGoal(goal: Goal): void {
    this.editedGoal = { ...goal };
    this.isEditModalOpen = true;
  }

  submitEditGoal(): void {
    this.goalService.updateGoalFields(this.editedGoal.id, this.editedGoal).subscribe(
      updatedGoal => {
        const index = this.goals.findIndex(g => g.id === updatedGoal.id);
        if (index !== -1) {
          this.goals[index] = updatedGoal;
        }
        this.isEditModalOpen = false;
        this.calculateProgress();
        this.showConfirmationMessage('Goal edited successfully!');
      },
      error => {
        console.error('Erreur lors de la mise à jour du Goal', error);
      }
    );
  }

  deleteGoal(goal: Goal): void {
    this.goalService.deleteGoal(goal.id).subscribe(
      () => {
        this.goals = this.goals.filter(g => g.id !== goal.id);
        console.log('Goal supprimé avec succès');
        this.showConfirmationMessage('Goal deleted successfully!');
      },
      error => {
        console.error('Erreur lors de la suppression :', error);
        alert('Erreur lors de la suppression de l\'objectif.');
      }
    );
  }
}

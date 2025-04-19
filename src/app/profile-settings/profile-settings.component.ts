import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  user?: User;
  userImageUrl: string = '';
  animate: boolean = false;
  showMessage: boolean = false;
  isEditing: boolean = false;
  originalUser?: User;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user: User) => {
          this.user = { ...user };
          this.originalUser = { ...user };
          this.userImageUrl = user.image || 'assets/default-user.png';
          setTimeout(() => (this.animate = true), 500);
        },
        error: err => {
          console.error('Erreur lors de la récupération de l’utilisateur :', err);
        }
      });
    }
  }

  onAnimationEnd(): void {
    this.showMessage = true;
  }

  toggleEdit(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.user || !this.user.id) return;

    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: (updatedUser: User) => {
        Swal.fire({
          icon: 'success',
          title: 'Modifications enregistrées',
          text: 'Votre profil a bien été mis à jour.'
        });
        this.originalUser = { ...updatedUser };
        this.user = { ...updatedUser };
        this.isEditing = false;
      },
      error: err => {
        console.error('Erreur lors de la mise à jour :', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour du profil.'
        });
      }
    });
  }

  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };
    }
    this.isEditing = false;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  deleteAccount(): void {
    if (!this.user?.id) return;

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#224393',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.user!.id).subscribe({
         
          error: err => {
           
              Swal.fire({
                icon: 'success',
                title: 'Compte supprimé',
                text: 'Votre compte a été supprimé avec succès.'
              }).then(() => {
                localStorage.clear();
                this.router.navigate(['/auth']);
              });
            
          }
        });
      }
    });
  }
}

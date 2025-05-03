import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-settings-admin',
  templateUrl: './profile-settings-admin.component.html',
  styleUrls: ['./profile-settings-admin.component.css']
})
export class ProfileSettingsAdminComponent implements OnInit {
  user?: User;
  userImageUrl: string | SafeUrl = '';
  showContent: boolean = false;
  showMessage: boolean = false;
  isEditing: boolean = false;
  originalUser?: User;
  private isSidebarAnimationDone: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private tempImageUrl?: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    console.log('Stored email:', email);
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User not authenticated. Please log in.'
      }).then(() => {
        this.router.navigate(['/auth']);
      });
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: (user: User) => {
        if (!user || !user.id) {
          Swal.fire({
            icon: 'error',
            title: 'User Not Found',
            text: 'No user found with the provided email.'
          }).then(() => {
            localStorage.clear();
            this.router.navigate(['/auth']);
          });
          return;
        }
        this.user = { ...user };
        this.originalUser = { ...user };
        this.userImageUrl = user.image ? `http://localhost:8081/images/${user.image.split('/').pop()}` : 'assets/default-user.png';
        this.isSidebarAnimationDone = true;
        this.checkAnimationsComplete();
      },
      error: err => {
        console.error('Error fetching user:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error || 'Failed to load user profile. Please log in again.'
        }).then(() => {
          localStorage.clear();
          this.router.navigate(['/auth']);
        });
      }
    });
  }

  onSidebarAnimationEnd(event: AnimationEvent): void {
    if (event.target) {
      this.isSidebarAnimationDone = true;
      this.checkAnimationsComplete();
    }
  }

  private checkAnimationsComplete(): void {
    if (this.isSidebarAnimationDone && this.user) {
      this.showContent = true;
      this.showMessage = true;
    }
  }

  toggleEdit(): void {
    this.isEditing = true;
  }

  triggerFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Immediate preview
      this.tempImageUrl = URL.createObjectURL(file);
      this.userImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.tempImageUrl);
      this.cdr.detectChanges();

      const formData = new FormData();
      formData.append('image', file);
      this.userService.uploadImage(formData).subscribe({
        next: (response: any) => {
          if (this.user) {
            // Extract filename from response.fileName
            const fileName = response.fileName.split('/').pop() || response.fileName;
            this.user.image = fileName;
          }
        },
        error: err => {
          Swal.fire({
            icon: 'error',
            title: 'Image Upload Failed',
            text: 'Failed to upload image. Please try again.'
          });
          // Revert to original image on error
          this.userImageUrl = this.originalUser?.image ? `http://localhost:8081/images/${this.originalUser.image.split('/').pop()}` : 'assets/default-user.png';
          if (this.tempImageUrl) {
            URL.revokeObjectURL(this.tempImageUrl);
            this.tempImageUrl = undefined;
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  validateUser(user: User): boolean {
    if (!user.nom || !/^[A-Za-z]+$/.test(user.nom)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Name must contain only letters.'
      });
      return false;
    }
    if (!user.prenom || !/^[A-Za-z]+$/.test(user.prenom)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Surname must contain only letters.'
      });
      return false;
    }
    if (!user.email || !/^[A-Za-z0-9+_.-]+@(.+)$/.test(user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Invalid email format.'
      });
      return false;
    }
    if (user.age && (user.age < 20 || user.age > 60)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Age must be between 20 and 60.'
      });
      return false;
    }
    if (user.tel && String(user.tel).length !== 8) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Phone number must be 8 digits.'
      });
      return false;
    }
    if (user.sexe && !['man', 'woman'].includes(user.sexe)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Sex must be "man" or "woman".'
      });
      return false;
    }
    if (user.soldeCourant && user.soldeCourant < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Balance cannot be negative.'
      });
      return false;
    }
    if (user.cin && String(user.cin).length !== 8) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'CIN must be 8 digits.'
      });
      return false;
    }
    if (user.rib && !/^\d{20}$/.test(user.rib)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'RIB must be 20 digits.'
      });
      return false;
    }
    if (user.adresse && (user.adresse.length < 5 || user.adresse.length > 100)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Address must be 5-100 characters.'
      });
      return false;
    }
    return true;
  }

  saveChanges(): void {
    if (!this.user || !this.user.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User data is missing.'
      });
      return;
    }

    if (!this.validateUser(this.user)) {
      return;
    }

    // Create a sanitized user object for the backend
    const userToUpdate = { ...this.user };
    // Ensure image is a filename or null if unchanged
    userToUpdate.image = this.user.image ? this.user.image.split('/').pop() : this.originalUser?.image?.split('/').pop() || null;

    this.userService.updateUser(this.user.id, userToUpdate).subscribe({
      next: (updatedUser: User) => {
        Swal.fire({
          icon: 'success',
          title: 'Changes Saved',
          text: 'Your profile has been updated successfully.'
        });
        this.originalUser = { ...updatedUser };
        this.user = { ...updatedUser };
        this.userImageUrl = updatedUser.image ? `http://localhost:8081/images/${updatedUser.image.split('/').pop()}` : 'assets/default-user.png';
        if (this.tempImageUrl) {
          URL.revokeObjectURL(this.tempImageUrl);
          this.tempImageUrl = undefined;
        }
        this.isEditing = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error updating user:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to update profile. Please check your input and try again.'
        });
      }
    });
  }

  cancelEdit(): void {
    if (this.originalUser) {
      this.user = { ...this.originalUser };
      this.userImageUrl = this.originalUser.image ? `http://localhost:8081/images/${this.originalUser.image.split('/').pop()}` : 'assets/default-user.png';
      if (this.tempImageUrl) {
        URL.revokeObjectURL(this.tempImageUrl);
        this.tempImageUrl = undefined;
      }
    }
    this.isEditing = false;
    this.cdr.detectChanges();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }

  deleteAccount(): void {
    if (!this.user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User data is missing.'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This action is irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#224393',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.user!.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              text: 'Your account has been deleted successfully.'
            }).then(() => {
              localStorage.clear();
              this.router.navigate(['/auth']);
            });
          },
          error: err => {
            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              text: 'Your account has been deleted successfully.'
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
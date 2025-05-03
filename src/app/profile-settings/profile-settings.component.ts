import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  user?: User;
  userImageUrl: string | SafeUrl = '';
  animate: boolean = false;
  showMessage: boolean = false;
  isEditing: boolean = false;
  showEditImageElements: boolean = false; // New flag for edit icon and title visibility
  originalUser?: User;
  userForm: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private tempImageUrl?: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      prenom: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      sexe: ['', [Validators.required, Validators.pattern(/^(man|woman)$/)]],
      rib: ['', [Validators.required, Validators.pattern(/^\d{20}$/)]],
      soldeCourant: ['', [Validators.min(0)]],
      age: ['', [Validators.required, Validators.min(20), Validators.max(60)]],
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]]
    });
  }

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
        this.userForm.patchValue(user);
        setTimeout(() => (this.animate = true), 500);
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

  onAnimationEnd(): void {
    this.showMessage = true;
    this.cdr.detectChanges();
  }

  toggleEdit(): void {
    this.isEditing = true;
    this.userForm.patchValue(this.user!);
  }

  triggerFileInput(): void {
    this.showEditImageElements = true; // Show edit icon and title when clicking to edit image
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
    this.cdr.detectChanges();
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
          this.showEditImageElements = false; // Hide edit icon and title after image upload
          this.cdr.detectChanges();
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
          this.showEditImageElements = false; // Hide edit icon and title on error
          this.cdr.detectChanges();
        }
      });
    } else {
      this.showEditImageElements = false; // Hide edit icon and title if no file selected
      this.cdr.detectChanges();
    }
  }

  saveChanges(): void {
    if (!this.user || !this.user.id || this.userForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please correct the errors in the form.'
      });
      this.userForm.markAllAsTouched();
      return;
    }

    // Update user object with form values
    this.user = { ...this.user, ...this.userForm.value };

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
        this.userForm.patchValue(updatedUser);
        this.userImageUrl = updatedUser.image ? `http://localhost:8081/images/${updatedUser.image.split('/').pop()}` : 'assets/default-user.png';
        if (this.tempImageUrl) {
          URL.revokeObjectURL(this.tempImageUrl);
          this.tempImageUrl = undefined;
        }
        this.isEditing = false;
        this.cdr.detectChanges();
        // Update localStorage email if changed
        if (updatedUser.email && updatedUser.email !== localStorage.getItem('email')) {
          localStorage.setItem('email', updatedUser.email);
        }
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
      this.userForm.patchValue(this.originalUser);
      this.userImageUrl = this.originalUser.image ? `http://localhost:8081/images/${this.originalUser.image.split('/').pop()}` : 'assets/default-user.png';
      if (this.tempImageUrl) {
        URL.revokeObjectURL(this.tempImageUrl);
        this.tempImageUrl = undefined;
      }
    }
    this.isEditing = false;
    this.showEditImageElements = false; // Hide edit icon and title when canceling
    this.cdr.detectChanges();
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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  selectedImage: File | null = null;

  roles = [
    { idRole: 1, nomRole: 'ADMIN' },
    { idRole: 2, nomRole: 'AGENT' },
    { idRole: 3, nomRole: 'CLIENT' },
    { idRole: 4, nomRole: 'INVESTOR' }
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.addUserForm = this.fb.group({
      nom: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      prenom: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      sexe: ['', [Validators.required, Validators.pattern('^(man|woman)$')]],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      role: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      rib: ['', [Validators.required, Validators.pattern('^[0-9]{20}$')]],
      soldeCourant: [0, [Validators.min(0)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]]
    });
  }

  ngOnInit(): void {}

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  onSubmit(): void {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValue = this.addUserForm.value;
    Object.entries(formValue).forEach(([key, value]) => {
      if (key === 'password') {
        formData.append('mdp', value as string);
      } else if (key === 'role') {
        // Send role in uppercase to match backend expectations
        formData.append('role', (value as string).toUpperCase());
      } else {
        formData.append(key, value as string);
      }
    });

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // Log FormData contents for debugging
    const formDataDebug: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      formDataDebug[key] = value;
    });
    console.log('Registration form data:', formDataDebug);

    this.userService.registerUser(formData).subscribe({
      next: (res) => {
        alert('Utilisateur ajouté avec succès !');
        this.addUserForm.reset();
        this.selectedImage = null;
      },
      error: (err) => {
        console.error('Registration failed:', err);
        let errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else {
            errorMessage = JSON.stringify(err.error);
          }
        }
        alert(errorMessage);
      }
    });
  }
}
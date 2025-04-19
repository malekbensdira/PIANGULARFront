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
  

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      mdp: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      tel: ['', [Validators.required]],
      role: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      rib: ['', [Validators.required]],
      soldeCourant: [''],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]]
    });
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }
  
  onSubmit(): void {
    if (this.addUserForm.invalid) return;
  
    const formData = new FormData();
    Object.entries(this.addUserForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    this.userService.registerUser(formData).subscribe({
      next: res => alert("Utilisateur ajouté avec succès !"),
      error: err => console.error(err)
    });
  }
  
}

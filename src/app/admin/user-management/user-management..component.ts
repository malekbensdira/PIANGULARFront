import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthMockService } from 'src/app/services/auth-mock.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';
  selectedUser: User | null = null;
  viewDetailsMode: boolean = false;

  constructor(private userService: UserService,
    private authService: AuthMockService 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.nom.toLowerCase().includes(term) || 
      user.prenom.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  viewUserDetails(user: User): void {
    this.selectedUser = { ...user };
    this.viewDetailsMode = true;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.viewDetailsMode = false;
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
          
          // If viewing the deleted user, close the details view
          if (this.selectedUser && this.selectedUser.id === userId) {
            this.closeUserDetails();
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Please try again.');
        }
      });
    }
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'back':
        return 'role-admin';
      case 'front':
        return 'role-user';
      default:
        return 'role-guest';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}
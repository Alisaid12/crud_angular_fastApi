import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { FetchDataService } from '../../services/fetch-data.service';
import { CommonModule } from '@angular/common';
import { User } from '../../users';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-con-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home-con-form.component.html',
  styleUrl: './home-con-form.component.css',
})
export class HomeConFormComponent {
  userList: any;

  userArr$: any;
  apiUrl = 'http://localhost:8000/';
  selectedUserIdToDelete?: number;
  isUpdateMode: boolean = false;
  newUser: User | null = null;
  updatedUser: User | null = null;

  @ViewChild('createModal') modalCreate!: ElementRef;
  @ViewChild('modalDelete') modalDelete!: ElementRef;

  userForm: FormGroup = new FormGroup({
    user_id: new FormControl('0'),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    status: new FormControl('true'),
  });

  constructor(
    private dataUserService: FetchDataService,
    private authService: AuthService,
    private router: Router
  ) {}

  getUsers() {
    this.userArr$ = this.dataUserService
      .getData(this.apiUrl + 'users')
      .subscribe((res: any) => {
        this.userList = res;
      });
  }

  createUser() { 
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.newUser = this.userForm.value;
    this.dataUserService
      .createData(this.apiUrl, 'create_user', this.newUser)
      .subscribe({
        next: () => {
          this.getUsers();
          this.userForm.reset();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating user', err);
        },
      });
  }
  deleteUser(user_id: number) {
    this.dataUserService
      .deleteData(this.apiUrl, 'delete/user/', user_id)
      .subscribe({
        next: () => {
          this.getUsers();
        },
      });
  }
  confirmDelete() {
    if (this.selectedUserIdToDelete !== undefined) {
      this.deleteUser(this.selectedUserIdToDelete);
      // this.modalDelete.nativeElement.style.display = 'none';
      this.closeModal();
    }
  }

  editUser(id: number) {
    this.ShowModal('create');
    this.isUpdateMode = true;
    this.dataUserService
      .editData(this.apiUrl, 'user?user_id=', id)
      .subscribe((res: any) => {
        console.log(res)
        this.userForm.patchValue({
          user_id: res.user_id,
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
        });
      });
  }
  updateUser() {
    // this.updatedUser = {
    //   ...this.userForm.value,
    //   user_id:String(this.userForm.value.user_id)
    // };
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const { user_id, ...userData } = this.userForm.value;

    this.dataUserService
      .updateData(this.apiUrl, 'update/user/', user_id, userData)
      .subscribe({
        next: (res) => {
          this.updatedUser = res as User;
          console.log(res);
          this.userForm.reset();
          this.getUsers();
          this.closeModal();
        },
      });
  }

  ShowModal(modal: string, id?: number) {
    if (modal == 'create') {
      this.isUpdateMode = false;
      this.userForm.reset();

      this.modalCreate.nativeElement.style.display = 'block';
    } else if (modal == 'delete') {
      this.modalDelete.nativeElement.style.display = 'block';
      this.selectedUserIdToDelete = id;
    }
  }

  closeModal(): void {
    this.modalCreate.nativeElement.style.display = 'none';
    this.modalDelete.nativeElement.style.display = 'none';
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}

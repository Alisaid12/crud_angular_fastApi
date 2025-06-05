import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../users';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-sin-form',
  imports: [],
  templateUrl: './home-sin-form.component.html',
  styleUrl: './home-sin-form.component.css',
})
export class HomeSinFormComponent {
  // create user
  @ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;
  @ViewChild('email') email!: ElementRef;

  // modals
  @ViewChild('createModal') modalCreate!: ElementRef;
  @ViewChild('modalEdit') modalEdit!: ElementRef;
  @ViewChild('modalDelete') modalDelete!: ElementRef;

  // update user
  @ViewChild('update_fname') update_fname!: ElementRef;
  @ViewChild('update_lame') update_lame!: ElementRef;
  @ViewChild('update_email') update_email!: ElementRef;

  constructor(private http: HttpClient) {}

  apiUrl = 'http://localhost:8000/';

  userList: any[] = [];

  getUsers() {
    this.http.get(this.apiUrl + 'users').subscribe((res: any) => {
      this.userList = res;
    });
  }
  ngOnInit(): void {
    this.getUsers();
  }
  newUser: User | null = null;
  creatUser() {
    this.newUser = {
      first_name: this.firstName.nativeElement.value,
      last_name: this.lastName.nativeElement.value,
      email: this.email.nativeElement.value,
      status: true,
    };

    this.http
      .post(this.apiUrl + 'create_user', this.newUser, {
        observe: 'body',
        responseType: 'json',
      })
      .subscribe((data) => {
        this.newUser = data as User;
        console.log(data);
      });
    this.getUsers();
  }
  deleteUser(user_id: number) {
    // console.log(user_id);
    this.http
      .delete(this.apiUrl + 'delete/user/' + user_id, {
        observe: 'body',
        responseType: 'json',
      })
      .subscribe((data) => {
        console.log(data);
      });
    this.getUsers();
  }

  
  updatedUser: User | null = null;

  updeteUser() {
    this.updatedUser = {
      first_name: this.update_fname.nativeElement.value,
      last_name: this.update_lame.nativeElement.value,
      email: this.update_email.nativeElement.value,
      status: true,
    };
    this.http
      .put(this.apiUrl + 'update/user/' + this.user.user_id, this.updatedUser, {
        observe: 'body',
        responseType: 'json',
      })
      .subscribe((data) => {
        this.updatedUser = data as User;
        console.log(data);
      });
    this.getUsers();
  }
  user: any = {};
  // modals
  ShowCreateModal() {
    this.modalCreate.nativeElement.style.display = 'block';
  }

  ShowUpdateModal(id: number): void {
    this.http.get(this.apiUrl + 'user?user_id=' + id).subscribe((data: any) => {
      this.user = data;
    });

    this.modalEdit.nativeElement.style.display = 'block';
  }

  deleteModal() {
    this.modalDelete.nativeElement.style.display = 'block';
  }

  closeModal(): void {
    this.modalEdit.nativeElement.style.display = 'none';
    this.modalCreate.nativeElement.style.display = 'none';
    this.modalDelete.nativeElement.style.display = 'none';
  }
}

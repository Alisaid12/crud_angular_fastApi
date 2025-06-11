import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConFormComponent } from './home-con-form.component';

describe('HomeConFormComponent', () => {
  let component: HomeConFormComponent;
  let fixture: ComponentFixture<HomeConFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeConFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeConFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

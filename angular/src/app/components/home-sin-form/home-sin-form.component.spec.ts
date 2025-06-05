import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSinFormComponent } from './home-sin-form.component';

describe('HomeSinFormComponent', () => {
  let component: HomeSinFormComponent;
  let fixture: ComponentFixture<HomeSinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSinFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetFormComponent } from './budget-form.component';
import { testProviders } from '../../../testing/test-providers';

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetFormComponent],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

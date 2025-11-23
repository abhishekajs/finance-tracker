import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetListComponent } from './budget-list.component';
import { testProviders } from '../../../testing/test-providers';

describe('BudgetListComponent', () => {
  let component: BudgetListComponent;
  let fixture: ComponentFixture<BudgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetListComponent],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

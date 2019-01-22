import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserPage } from './select-user.page';

describe('SelectUserPage', () => {
  let component: SelectUserPage;
  let fixture: ComponentFixture<SelectUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

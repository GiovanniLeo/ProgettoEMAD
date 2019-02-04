import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleConnetPage } from './ble-connet.page';

describe('BleConnetPage', () => {
  let component: BleConnetPage;
  let fixture: ComponentFixture<BleConnetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleConnetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleConnetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

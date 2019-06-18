import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdditOfferPage } from './eddit-offer.page';

describe('EdditOfferPage', () => {
  let component: EdditOfferPage;
  let fixture: ComponentFixture<EdditOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdditOfferPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdditOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

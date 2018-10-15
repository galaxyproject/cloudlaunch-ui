import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiTokenEditorComponent } from './api-token-editor.component';

describe('ApiTokenEditorComponent', () => {
  let component: ApiTokenEditorComponent;
  let fixture: ComponentFixture<ApiTokenEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiTokenEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTokenEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

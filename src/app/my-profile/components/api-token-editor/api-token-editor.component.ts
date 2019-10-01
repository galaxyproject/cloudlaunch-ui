import { Component, OnInit, Input } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

// models
import { UserProfile } from '../../../shared/models/profile';
import { AuthToken } from '../../../shared/models/profile';

// services
import { ProfileService } from '../../../shared/services/profile.service';

@Component({
  selector: 'clui-api-token-editor',
  templateUrl: './api-token-editor.component.html',
  styleUrls: ['./api-token-editor.component.css']
})
export class ApiTokenEditorComponent implements OnInit {

  @Input()
  profile: UserProfile;

  authTokenForm: FormGroup;
  authTokenChanged = new Subject();
  authTokenObservable: Observable<AuthToken[]>;

  displayedColumns: string[] = ['name', 'key'];
  submitPending = false;

  constructor(
          private _profileService: ProfileService,
          private fb: FormBuilder) {
      this.authTokenForm = fb.group({
          'name': ['', Validators.required]
      });
  }

  ngOnInit() {
      this.authTokenObservable = this.authTokenChanged.pipe(
              startWith(<string>null),
              switchMap(() => this._profileService.getAuthTokens()));
  }

  onSubmit(token: AuthToken): void {
      this.submitPending = true;
      this._profileService.createAuthToken(token)
      .subscribe(result => { this.submitPending = false; this.authTokenChanged.next(null);
                             this.authTokenForm.reset(); },
                 error => { this.submitPending = false; });
  }

  deleteToken(token: AuthToken) {
      this._profileService.deleteAuthToken(token)
          .subscribe(result => { this.authTokenChanged.next(null); });
  }
}

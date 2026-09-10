import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AppError } from '../../../../core/errors/app-error.model';
import { AccountsApiService } from '../../../../core/api/accounts-api.service';

export interface RenameAccountData {
  accountId: string;
  nickname: string;
}

/** Nickname editor dialog. */
@Component({
  selector: 'mol-rename-account',
  templateUrl: './rename-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenameAccountComponent {
  readonly nickname: FormControl<string>;
  busy = false;
  error: AppError | null = null;

  constructor(
    readonly ref: MatDialogRef<RenameAccountComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) readonly data: RenameAccountData,
    private readonly api: AccountsApiService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.nickname = new FormControl<string>(data.nickname, { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] });
  }

  get unchanged(): boolean {
    return this.nickname.value.trim() === this.data.nickname;
  }

  confirm(): void {
    if (this.nickname.invalid || this.unchanged) {
      return;
    }
    this.busy = true;
    this.error = null;
    this.api.rename(this.data.accountId, this.nickname.value.trim()).subscribe({
      next: () => this.ref.close(true),
      error: (err: AppError) => {
        this.busy = false;
        this.error = err;
        this.cdr.markForCheck();
      }
    });
  }
}

import { Component, Input, Self } from '@angular/core';
import { FormControl, FormsModule, NgControl,  ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {
  @Input() label = '';
  @Input() max: Date | undefined;

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  get control(): FormControl{
    return this.ngControl.control as FormControl
  }
}

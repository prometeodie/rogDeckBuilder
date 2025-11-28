import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roman',
  standalone: true
})
export class RomanPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) return '';

    const romanMap: { value: number, numeral: string }[] = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];

    let result = '';
    let num = value;

    for (const item of romanMap) {
      while (num >= item.value) {
        result += item.numeral;
        num -= item.value;
      }
    }

    return result;
  }
}

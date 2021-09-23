import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'divisionColor'
})
export class DivisionColorPipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            default:
                return "#999";
            case 'male':
                return "#01bcd4";
            case 'female':
                return "#cf8cbe";
            case 'kid':
                return "#9cda53";
        }
    }

}

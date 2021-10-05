import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'divisionIcon'
})
export class DivisionIconPipe implements PipeTransform {

    transform(value: string): string {
        switch (value) {
            default: return "male";

            case 'male': return "male";
            case 'female': return "female";
            case 'kid': return "child_care";
        }
    }
}

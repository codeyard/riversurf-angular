import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'riderColor'
})
export class RiderColorPipe implements PipeTransform {

    transform(value: number): string {
        switch (value) {
            default:
                return "#B0BEC5";
            case 0:
                return "#FDD835";
            case 1:
                return "#F4511E";
            case 2:
                return "#2196F3";
            case 3:
                return "#4CAF50";
        }
    }

}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {

    transform(value: number): string {
        switch (value) {
            default: return 'sunny';

            case 1: return 'clear-day';
            case 2: return 'partly-cloudy-day';
            case 3: return 'overcast-day';
            case 4: return 'overcast';
            case 5: return 'thunderstorms-day';
            case 6: return 'rain';
            case 7: return 'snow';
            case 8: return 'fog-day';
            case 9: return 'sleet';
            case 10: return 'partly-cloudy-day-rain';
            case 11: return 'drizzle';
            case 12: return 'partly-cloudy-day-snow';
            case 13: return 'thunderstorms-rain';
            case 14: return 'mist';
            case 15: return 'partly-cloudy-day-sleet';
        }
    }
}

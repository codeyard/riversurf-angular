import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'weatherIcon'
})
export class WeatherIconPipe implements PipeTransform {

    transform(value: number): string {
        const hours = new Date().getHours();
        const dayOrNight = (hours > 6 && hours < 20) ? 'day' : 'night';

        switch (value) {
            default: return 'sunny';

            case 1: return `clear-${dayOrNight}`;
            case 2: return `partly-cloudy-${dayOrNight}`;
            case 3: return `overcast-${dayOrNight}`;
            case 4: return 'overcast';
            case 5: return `thunderstorms-${dayOrNight}`;
            case 6: return 'rain';
            case 7: return 'snow';
            case 8: return `fog-${dayOrNight}`;
            case 9: return 'sleet';
            case 10: return `partly-cloudy-${dayOrNight}-rain`;
            case 11: return 'drizzle';
            case 12: return `partly-cloudy-${dayOrNight}-snow`;
            case 13: return 'thunderstorms-rain';
            case 14: return 'mist';
            case 15: return `partly-cloudy-${dayOrNight}-sleet`;
        }
    }
}

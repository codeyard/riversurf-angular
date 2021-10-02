import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'weatherCondition'
})
export class WeatherConditionPipe implements PipeTransform {

    transform(value: number): string {
        switch (value) {
            default: return 'Sunny';

            case 1: return 'Sunny';
            case 2: return 'Mostly sunny';
            case 3: return 'Cloudy';
            case 4: return 'Heavily cloudy';
            case 5: return 'Thunderstorm';
            case 6: return 'Heavy rain';
            case 7: return 'Snowfall';
            case 8: return 'Fog';
            case 9: return 'Sleet';
            case 10: return 'Sleet';
            case 11: return 'Light rain';
            case 12: return 'Snow shower';
            case 13: return 'Thunderstorm';
            case 14: return 'Low stratus';
            case 15: return 'Sleet shower';
        }
    }
}

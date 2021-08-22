export interface WeatherData {
    timestamp: number;
    location: string;
    locationText: string;
    airTemperature: number;
    waterTemperature: number;
    waterFlow: number;
    weatherSymbol: number;
}

export const DefaultWeatherData: WeatherData = {
    airTemperature: 0,
    location: "",
    locationText: "",
    timestamp: 0,
    waterFlow: 0,
    waterTemperature: 0,
    weatherSymbol: 0
}

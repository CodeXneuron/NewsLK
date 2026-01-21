/**
 * Weather API Client using WeatherAPI.com
 * Free tier: 1,000,000 calls/month
 */

export interface WeatherData {
    location: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    timestamp: number;
}

export interface ForecastDay {
    date: string;
    temperature: number;
    condition: string;
    icon: string;
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    condition: string;
    icon: string;
    precipitation: number;
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';
const LOCATION = process.env.NEXT_PUBLIC_WEATHER_LOCATION || 'Colombo';
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetch current weather data
 */
export async function getCurrentWeather(): Promise<WeatherData | null> {
    try {
        if (!API_KEY) {
            console.warn('[Weather API] No API key configured');
            return null;
        }

        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${LOCATION}&aqi=no`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );

        if (!response.ok) {
            console.error('[Weather API] Failed to fetch weather:', response.status);
            return null;
        }

        const data = await response.json();

        return {
            location: data.location.name,
            temperature: Math.round(data.current.temp_c),
            feelsLike: Math.round(data.current.feelslike_c),
            condition: data.current.condition.text,
            description: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: Math.round(data.current.wind_kph),
            icon: data.current.condition.icon,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error('[Weather API] Error:', error);
        return null;
    }
}

/**
 * Fetch 5-day weather forecast
 */
export async function getWeatherForecast(): Promise<ForecastDay[]> {
    try {
        if (!API_KEY) {
            console.warn('[Weather API] No API key configured');
            return [];
        }

        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${LOCATION}&days=5&aqi=no`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            console.error('[Weather API] Failed to fetch forecast:', response.status);
            return [];
        }

        const data = await response.json();

        return data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            temperature: Math.round(day.day.avgtemp_c),
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
        }));
    } catch (error) {
        console.error('[Weather API] Error:', error);
        return [];
    }
}

/**
 * Fetch current weather data by coordinates
 */
export async function getCurrentWeatherByCoords(
    lat: number,
    lon: number
): Promise<WeatherData | null> {
    try {
        if (!API_KEY) {
            console.warn('[Weather API] No API key configured');
            return null;
        }

        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`,
            { cache: 'no-store' } // Don't cache user-specific location data
        );

        if (!response.ok) {
            console.error('[Weather API] Failed to fetch weather:', response.status);
            return null;
        }

        const data = await response.json();

        return {
            location: `${data.location.name}, ${data.location.region}`,
            temperature: Math.round(data.current.temp_c),
            feelsLike: Math.round(data.current.feelslike_c),
            condition: data.current.condition.text,
            description: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: Math.round(data.current.wind_kph),
            icon: data.current.condition.icon,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error('[Weather API] Error:', error);
        return null;
    }
}

/**
 * Fetch weather forecast by coordinates
 */
export async function getWeatherForecastByCoords(
    lat: number,
    lon: number
): Promise<ForecastDay[]> {
    try {
        if (!API_KEY) {
            console.warn('[Weather API] No API key configured');
            return [];
        }

        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            console.error('[Weather API] Failed to fetch forecast:', response.status);
            return [];
        }

        const data = await response.json();

        return data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            temperature: Math.round(day.day.avgtemp_c),
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
        }));
    } catch (error) {
        console.error('[Weather API] Error:', error);
        return [];
    }
}

/**
 * Fetch hourly forecast for next 24 hours
 */
export async function getHourlyForecast(lat?: number, lon?: number): Promise<HourlyForecast[]> {
    try {
        if (!API_KEY) {
            console.warn('[Weather API] No API key configured');
            return [];
        }

        const query = lat && lon ? `${lat},${lon}` : LOCATION;
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=2&aqi=no`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            console.error('[Weather API] Failed to fetch hourly forecast:', response.status);
            return [];
        }

        const data = await response.json();
        const hours: HourlyForecast[] = [];

        // Get current hour
        const now = new Date();
        const currentHour = now.getHours();

        // Combine today and tomorrow's hours to get next 24 hours
        data.forecast.forecastday.forEach((day: any) => {
            day.hour.forEach((hour: any) => {
                const hourTime = new Date(hour.time);
                if (hourTime >= now && hours.length < 24) {
                    hours.push({
                        time: hour.time,
                        temperature: Math.round(hour.temp_c),
                        condition: hour.condition.text,
                        icon: hour.condition.icon,
                        precipitation: hour.chance_of_rain,
                    });
                }
            });
        });

        return hours;
    } catch (error) {
        console.error('[Weather API] Error:', error);
        return [];
    }
}

/**
 * Get weather icon URL from WeatherAPI.com
 * Icons are already full URLs from the API
 */
export function getWeatherIconUrl(icon: string): string {
    // WeatherAPI returns full URLs, but ensure https
    return icon.startsWith('//') ? `https:${icon}` : icon;
}

'use client';

import { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Loader2, MapPin, Navigation } from 'lucide-react';
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast, getWeatherForecastByCoords, getWeatherIconUrl, type WeatherData, type ForecastDay } from '@/lib/weather-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [usingUserLocation, setUsingUserLocation] = useState(false);

    const {
        latitude,
        longitude,
        loading: locationLoading,
        error: locationError,
        permissionState,
        requestLocation
    } = useGeolocation();

    useEffect(() => {
        async function fetchWeather() {
            try {
                setLoading(true);

                // Use coordinates if available, otherwise use default location
                if (latitude && longitude) {
                    const [currentWeather, forecastData] = await Promise.all([
                        getCurrentWeatherByCoords(latitude, longitude),
                        getWeatherForecastByCoords(latitude, longitude),
                    ]);

                    if (currentWeather) {
                        setWeather(currentWeather);
                        setForecast(forecastData);
                        setUsingUserLocation(true);
                        setError(false);
                    } else {
                        setError(true);
                    }
                } else {
                    // Fallback to default location
                    const [currentWeather, forecastData] = await Promise.all([
                        getCurrentWeather(),
                        getWeatherForecast(),
                    ]);

                    if (currentWeather) {
                        setWeather(currentWeather);
                        setForecast(forecastData);
                        setUsingUserLocation(false);
                        setError(false);
                    } else {
                        setError(true);
                    }
                }
            } catch (err) {
                console.error('[Weather Widget] Error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();

        // Refresh every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    // Auto-request location on first visit if not denied
    useEffect(() => {
        if (permissionState === null && !latitude && !locationLoading) {
            // Auto-request location silently
            requestLocation();
        }
    }, [permissionState, latitude, locationLoading, requestLocation]);

    if (loading) {
        return (
            <Card className="glass p-6 animate-pulse">
                <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Card>
        );
    }

    if (error || !weather) {
        return (
            <Card className="glass p-6">
                <div className="text-center text-muted-foreground">
                    <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm mb-3">Weather unavailable</p>
                    {!latitude && permissionState !== 'denied' && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={requestLocation}
                            className="text-xs"
                        >
                            <Navigation className="h-3 w-3 mr-1" />
                            Use My Location
                        </Button>
                    )}
                </div>
            </Card>
        );
    }

    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <Card className="glass overflow-hidden border-border/50 hover-lift">
            {/* Current Weather */}
            <div className="p-6 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {weather.location}
                            </h3>
                            {usingUserLocation && (
                                <div title="Using your location">
                                    <MapPin className="h-3 w-3 text-primary" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold">{weather.temperature}°</span>
                            <span className="text-2xl text-muted-foreground">C</span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                            {weather.description}
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src={getWeatherIconUrl(weather.icon)}
                            alt={weather.condition}
                            className="w-20 h-20 drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="flex flex-col items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">Humidity</span>
                        <span className="text-sm font-semibold">{weather.humidity}%</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Wind className="h-4 w-4 text-slate-500" />
                        <span className="text-xs text-muted-foreground">Wind</span>
                        <span className="text-sm font-semibold">{weather.windSpeed} km/h</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Cloud className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-muted-foreground">Feels Like</span>
                        <span className="text-sm font-semibold">{weather.feelsLike}°C</span>
                    </div>
                </div>

                {/* Location prompt for non-user location */}
                {!usingUserLocation && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={requestLocation}
                            disabled={locationLoading}
                            className="w-full text-xs"
                        >
                            {locationLoading ? (
                                <>
                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                    Getting location...
                                </>
                            ) : (
                                <>
                                    <Navigation className="h-3 w-3 mr-2" />
                                    {permissionState === 'denied' ? 'Enable Location' : 'Use My Location'}
                                </>
                            )}
                        </Button>
                        {permissionState === 'denied' && (
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                Location access denied. Enable in browser settings.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
                <div className="p-4 bg-muted/30">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                        5-Day Forecast
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                        {forecast.map((day, index) => (
                            <div
                                key={day.date}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-background/50 transition-colors"
                            >
                                <span className="text-xs font-medium text-muted-foreground">
                                    {index === 0 ? 'Today' : getDayName(day.date)}
                                </span>
                                <img
                                    src={getWeatherIconUrl(day.icon)}
                                    alt={day.condition}
                                    className="w-10 h-10"
                                />
                                <span className="text-sm font-bold">{day.temperature}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}

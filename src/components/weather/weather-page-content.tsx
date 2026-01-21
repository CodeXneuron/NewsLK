"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, MapPin, Calendar, Loader2, Navigation, CloudDrizzle, Umbrella, Shirt, Activity, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast, getWeatherForecastByCoords, getHourlyForecast, getWeatherIconUrl, type WeatherData, type ForecastDay, type HourlyForecast } from "@/lib/weather-api";
import { useGeolocation } from "@/hooks/use-geolocation";

export function WeatherPageContent() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
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
        const fetchWeatherData = async () => {
            try {
                setLoading(true);

                if (latitude && longitude) {
                    const [currentWeather, forecastData, hourlyData] = await Promise.all([
                        getCurrentWeatherByCoords(latitude, longitude),
                        getWeatherForecastByCoords(latitude, longitude),
                        getHourlyForecast(latitude, longitude),
                    ]);

                    if (currentWeather) {
                        setWeather(currentWeather);
                        setUsingUserLocation(true);
                    } else {
                        setError(true);
                    }

                    if (forecastData) {
                        setForecast(forecastData);
                    }

                    if (hourlyData) {
                        setHourlyForecast(hourlyData);
                    }
                } else {
                    const [currentWeather, forecastData, hourlyData] = await Promise.all([
                        getCurrentWeather(),
                        getWeatherForecast(),
                        getHourlyForecast(),
                    ]);

                    if (currentWeather) {
                        setWeather(currentWeather);
                        setUsingUserLocation(false);
                    } else {
                        setError(true);
                    }

                    if (forecastData) {
                        setForecast(forecastData);
                    }

                    if (hourlyData) {
                        setHourlyForecast(hourlyData);
                    }
                }
            } catch (err) {
                console.error("Error fetching weather:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [latitude, longitude]);

    useEffect(() => {
        if (permissionState === null && !latitude && !locationLoading) {
            requestLocation();
        }
    }, [permissionState, latitude, locationLoading, requestLocation]);

    const getWeatherTips = (weather: WeatherData): string[] => {
        const tips: string[] = [];

        if (weather.temperature > 30) {
            tips.push("🌡️ It's hot! Stay hydrated and use sunscreen");
        } else if (weather.temperature < 20) {
            tips.push("🧥 Cool weather - consider bringing a light jacket");
        }

        if (weather.humidity > 80) {
            tips.push("💧 High humidity - expect muggy conditions");
        }

        if (weather.condition.toLowerCase().includes('rain')) {
            tips.push("☔ Rain expected - don't forget your umbrella!");
        } else if (weather.condition.toLowerCase().includes('clear') || weather.condition.toLowerCase().includes('sunny')) {
            tips.push("☀️ Great day for outdoor activities!");
        }

        if (weather.windSpeed > 20) {
            tips.push("💨 Windy conditions - secure loose items");
        }

        if (tips.length === 0) {
            tips.push("🌤️ Pleasant weather conditions today");
        }

        return tips;
    };

    const formatHourTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    };

    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading weather data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="glass p-8 text-center max-w-md">
                        <Cloud className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-2xl font-bold mb-2">Weather Unavailable</h2>
                        <p className="text-muted-foreground">
                            Unable to load weather data at this time. Please try again later.
                        </p>
                    </Card>
                </div>
            </div>
        );
    }

    const weatherTips = getWeatherTips(weather);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Page Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                        Weather Forecast
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-lg">{weather.location}</span>
                        {usingUserLocation && (
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Your Location</span>
                        )}
                    </div>
                    {!usingUserLocation && (
                        <div className="mt-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={requestLocation}
                                disabled={locationLoading || permissionState === 'denied'}
                                className="gap-2"
                            >
                                {locationLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Getting location...
                                    </>
                                ) : permissionState === 'denied' ? (
                                    <>
                                        <MapPin className="h-4 w-4" />
                                        Location Denied
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="h-4 w-4" />
                                        Use My Location
                                    </>
                                )}
                            </Button>
                            {permissionState === 'denied' && (
                                <p className="text-xs text-red-500 mt-2 text-center">
                                    Please enable location access in your browser settings
                                </p>
                            )}
                            {locationError && permissionState !== 'denied' && (
                                <p className="text-xs text-orange-500 mt-2 text-center">
                                    {locationError}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Current Weather Hero */}
                <Card className="glass overflow-hidden border-border/50 shadow-2xl">
                    <div className="p-8 md:p-12 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-purple-500/20 backdrop-blur-xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="text-center md:text-left space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-6">
                                    <img
                                        src={getWeatherIconUrl(weather.icon)}
                                        alt={weather.condition}
                                        className="h-32 w-32 drop-shadow-2xl"
                                    />
                                    <div>
                                        <div className="text-8xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {weather.temperature}°
                                        </div>
                                        <div className="text-3xl text-muted-foreground capitalize mt-2">
                                            {weather.description}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xl text-muted-foreground">
                                    Feels like <span className="font-bold text-foreground">{weather.feelsLike}°C</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="glass p-6 text-center hover-lift">
                                    <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                    <div className="text-sm text-muted-foreground mb-1">Humidity</div>
                                    <div className="text-3xl font-bold">{weather.humidity}%</div>
                                </Card>
                                <Card className="glass p-6 text-center hover-lift">
                                    <Wind className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                                    <div className="text-sm text-muted-foreground mb-1">Wind Speed</div>
                                    <div className="text-3xl font-bold">{weather.windSpeed} km/h</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Weather Tips */}
                <Card className="glass p-6 border-border/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Weather Tips
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                        {weatherTips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                                <div className="text-2xl">{tip.split(' ')[0]}</div>
                                <p className="text-sm text-muted-foreground flex-1">{tip.substring(tip.indexOf(' ') + 1)}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Hourly Forecast */}
                {hourlyForecast.length > 0 && (
                    <Card className="glass p-6 border-border/50">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            24-Hour Forecast
                        </h3>
                        <div className="overflow-x-auto pb-2">
                            <div className="flex gap-4 min-w-max">
                                {hourlyForecast.slice(0, 12).map((hour, index) => (
                                    <Card key={index} className="glass p-4 text-center min-w-[100px] hover-lift">
                                        <div className="text-sm font-medium text-muted-foreground mb-2">
                                            {index === 0 ? 'Now' : formatHourTime(hour.time)}
                                        </div>
                                        <img
                                            src={getWeatherIconUrl(hour.icon)}
                                            alt={hour.condition}
                                            className="h-12 w-12 mx-auto"
                                        />
                                        <div className="text-2xl font-bold my-2">{hour.temperature}°</div>
                                        {hour.precipitation > 0 && (
                                            <div className="text-xs text-blue-500 flex items-center justify-center gap-1">
                                                <CloudDrizzle className="h-3 w-3" />
                                                {hour.precipitation}%
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}

                {/* 5-Day Forecast */}
                {forecast.length > 0 && (
                    <Card className="glass p-6 border-border/50">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-primary" />
                            5-Day Forecast
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {forecast.map((day) => (
                                <Card key={day.date} className="glass p-6 text-center hover-lift">
                                    <div className="font-bold text-lg mb-3">{getDayName(day.date)}</div>
                                    <img
                                        src={getWeatherIconUrl(day.icon)}
                                        alt={day.condition}
                                        className="h-16 w-16 mx-auto mb-3"
                                    />
                                    <div className="text-4xl font-bold mb-2">{day.temperature}°</div>
                                    <div className="text-sm text-muted-foreground capitalize">{day.condition}</div>
                                </Card>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

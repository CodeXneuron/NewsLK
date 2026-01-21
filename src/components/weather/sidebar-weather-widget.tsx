'use client';

import { useEffect, useState } from 'react';
import { Cloud, MapPin, Loader2 } from 'lucide-react';
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherIconUrl, type WeatherData } from '@/lib/weather-api';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Card } from '@/components/ui/card';

export function SidebarWeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const { latitude, longitude } = useGeolocation();

    useEffect(() => {
        async function fetchWeather() {
            try {
                setLoading(true);
                const data = latitude && longitude
                    ? await getCurrentWeatherByCoords(latitude, longitude)
                    : await getCurrentWeather();

                if (data) {
                    setWeather(data);
                }
            } catch (err) {
                console.error('[Sidebar Weather] Error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [latitude, longitude]);

    if (loading) {
        return (
            <Card className="glass p-3 border-border/50">
                <div className="flex items-center justify-center h-16">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            </Card>
        );
    }

    if (!weather) {
        return null;
    }

    return (
        <Card className="glass overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <div className="flex items-center justify-between">
                    {/* Temperature and Icon */}
                    <div className="flex items-center gap-2">
                        <img
                            src={getWeatherIconUrl(weather.icon)}
                            alt={weather.condition}
                            className="w-12 h-12"
                        />
                        <div>
                            <div className="text-3xl font-bold text-slate-100">
                                {weather.temperature}°
                            </div>
                            <div className="text-xs text-slate-300 capitalize">
                                {weather.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{weather.location}</span>
                </div>
            </div>
        </Card>
    );
}

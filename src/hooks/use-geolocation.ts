'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveLocation, getLocation, clearLocation as clearCachedLocation, isLocationExpired } from '@/lib/location-cache';

export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    loading: boolean;
    error: string | null;
    permissionState: 'prompt' | 'granted' | 'denied' | null;
}

/**
 * Custom hook for geolocation with caching and permission handling
 */
export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: false,
        error: null,
        permissionState: null,
    });

    // Check cached location on mount
    useEffect(() => {
        const cached = getLocation();
        if (cached && !isLocationExpired()) {
            setState(prev => ({
                ...prev,
                latitude: cached.latitude,
                longitude: cached.longitude,
                accuracy: cached.accuracy,
                permissionState: 'granted',
            }));
        }
    }, []);

    /**
     * Request user's location
     */
    const requestLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                permissionState: 'denied',
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now(),
            };

            // Save to cache
            saveLocation(location);

            setState({
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                loading: false,
                error: null,
                permissionState: 'granted',
            });
        } catch (error: any) {
            let errorMessage = 'Failed to get your location';
            let permissionState: 'prompt' | 'granted' | 'denied' = 'prompt';

            if (error.code === 1) {
                errorMessage = 'Location permission denied';
                permissionState = 'denied';
            } else if (error.code === 2) {
                errorMessage = 'Location unavailable';
            } else if (error.code === 3) {
                errorMessage = 'Location request timed out';
            }

            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
                permissionState,
            }));
        }
    }, []);

    /**
     * Clear cached location
     */
    const clearLocation = useCallback(() => {
        clearCachedLocation();
        setState({
            latitude: null,
            longitude: null,
            accuracy: null,
            loading: false,
            error: null,
            permissionState: null,
        });
    }, []);

    return {
        ...state,
        requestLocation,
        clearLocation,
    };
}

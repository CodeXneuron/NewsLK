/**
 * Location caching utilities
 * Stores user's location in localStorage for better UX
 */

export interface CachedLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy: number;
}

const LOCATION_CACHE_KEY = 'newsLK_user_location';
const MAX_CACHE_AGE = 3600000; // 1 hour in milliseconds

/**
 * Save location to localStorage
 */
export function saveLocation(location: CachedLocation): void {
    try {
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
    } catch (error) {
        console.error('[Location Cache] Failed to save location:', error);
    }
}

/**
 * Get cached location from localStorage
 */
export function getLocation(): CachedLocation | null {
    try {
        const cached = localStorage.getItem(LOCATION_CACHE_KEY);
        if (!cached) return null;

        const location: CachedLocation = JSON.parse(cached);

        // Validate cached data
        if (
            typeof location.latitude !== 'number' ||
            typeof location.longitude !== 'number' ||
            typeof location.timestamp !== 'number'
        ) {
            console.warn('[Location Cache] Invalid cached data');
            clearLocation();
            return null;
        }

        return location;
    } catch (error) {
        console.error('[Location Cache] Failed to get location:', error);
        return null;
    }
}

/**
 * Clear cached location
 */
export function clearLocation(): void {
    try {
        localStorage.removeItem(LOCATION_CACHE_KEY);
    } catch (error) {
        console.error('[Location Cache] Failed to clear location:', error);
    }
}

/**
 * Check if cached location is expired
 */
export function isLocationExpired(maxAge: number = MAX_CACHE_AGE): boolean {
    const location = getLocation();
    if (!location) return true;

    const age = Date.now() - location.timestamp;
    return age > maxAge;
}

/**
 * Get location age in minutes
 */
export function getLocationAge(): number | null {
    const location = getLocation();
    if (!location) return null;

    const ageMs = Date.now() - location.timestamp;
    return Math.floor(ageMs / 60000); // Convert to minutes
}

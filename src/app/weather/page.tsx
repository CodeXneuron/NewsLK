import { Metadata } from "next";
import { WeatherPageContent } from "@/components/weather/weather-page-content";

export const metadata: Metadata = {
    title: "Weather Forecast - NewsLK",
    description: "Detailed weather forecast for Colombo, Sri Lanka with 5-day forecast and hourly updates",
};

export default function WeatherPage() {
    return <WeatherPageContent />;
}

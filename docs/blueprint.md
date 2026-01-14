# **App Name**: LankaNow

## Core Features:

- News Feed: Fetch and display news articles from the Hiru TV News API endpoint including title, description, image, publication date and the article URL.
- Article View: Open the selected news article in a webview or external browser.
- Category Filters: Filter news based on the following categories: Breaking News, Politics, Sports, Entertainment, Local News and International.
- Breaking News Alerts: Use push notifications to alert users when new breaking news articles are published. This will use Firebase Cloud Messaging.
- Notification Settings: Enable users to control their notification preferences. Use a tool to decide when or if an LLM will be involved.
- Offline Caching: Cache news articles in Firestore to enable offline access.
- User Bookmarks: Allow users to create accounts to bookmark their favorite articles, storing the articles in Firestore.

## Style Guidelines:

- Primary color: Saffron (#FF9933) to capture the essence of Sri Lankan culture, with medium saturation and brightness so it can be displayed in both light and dark mode. Based on the user's request for gold accents.
- Background color: Very light desaturated yellow (#FAF0E6, or RGB 250, 240, 230). This will provide a soft backdrop that is gentle on the eyes while subtly reinforcing the local cultural theme.
- Accent color: Maroon (#800000). High saturation and low brightness will complement the primary saffron without overpowering it, highlighting key interactive elements.
- Font pairing: Use 'Playfair' (a modern sans-serif) for headlines, and 'PT Sans' (a humanist sans-serif) for body text.
- Employ a set of minimalist icons, custom-designed to reflect Sri Lankan motifs and the theme of news.
- Adopt a card-based layout to display news articles in a clear and organized manner. The top app bar should display the app logo on the left and a refresh button on the right.
- Implement subtle animations on UI elements and transitions to improve UX. For instance, use a smooth fade-in animation when new content loads.
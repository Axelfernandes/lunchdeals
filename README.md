# 🍔 LunchDeals AI

LunchDeals AI is a real-time discovery engine that automatically detects your GPS location to find the best lunch specials and discounts within a 15-mile radius. Built for speed and accuracy, it prioritizes deals expiring today.

![LunchDeals Screenshot](public/vite.svg) *Note: Replace with actual screenshot for your website!*

## 🚀 Features

-   **📍 GPS-Based Discovery**: Automatically finds deals within 15 miles of your current location.
-   **🕷️ Real-Time Scraping**: Uses [Firecrawl](https://firecrawl.dev) to aggregate data from multiple deal platforms and local aggregators.
-   **🔍 Powerful Filtering**:
    -   Sort by best discount percentage, ratings (4+ stars), or distance.
    -   Filter by cuisine type (Italian, Mexican, Asian, etc.).
    -   Filter by dietary needs (Vegetarian, Vegan, Gluten-Free).
    -   Price filters (Under $10, $10-$15, $15+).
-   **🗺️ Dual View Mode**: Switch between a sleek list view and an interactive map with one-click directions.
-   **⚡ Performance First**: Built with Vite and TypeScript for nearly instant load times.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React (Icons).
-   **Backend**: Node.js, Express.
-   **Data Acquisition**: Firecrawl-js (AI-powered scraping).
-   **Deployment**: AWS Amplify & GitHub.

## 🏁 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A [Firecrawl API Key](https://firecrawl.dev)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/lunchdeals.git
    cd lunchdeals
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    cd server && npm install && cd ..
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and the `server` directory:
    ```env
    FIRECRAWL_API_KEY=your_api_key_here
    PORT=3001
    ```

4.  **Run the application**:
    -   **Start the backend**: `cd server && node index.js`
    -   **Start the frontend**: `npm run dev` (from the root)

## 🏗️ Architecture

-   `src/`: React frontend components and logic.
-   `server/`: Express API handling the Firecrawl scraping logic.
-   `src/services/`: Client-side API calls.
-   `src/components/`: Reusable UI components (MapView, FilterBar, etc.).

## 📜 License

MIT License. Feel free to use and modify for your own projects!

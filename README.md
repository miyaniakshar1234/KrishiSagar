# KrishiSagar (Agriculture Ocean)

A comprehensive platform connecting farmers with resources, experts, and markets for sustainable agriculture.

## Features

### For Farmers

- **Profile Management**: Create and manage farm profiles with crop details
- **Crop Analysis**: AI-powered crop disease detection and health monitoring
- **Soil Health Management**: Track soil test results, get recommendations, and monitor soil health trends
- **Weather Forecasts**: Access hyperlocal weather predictions
- **Market Prices**: View current crop prices across different markets
- **Expert Consultations**: Connect with agricultural experts for advice
- **KrishiGram Social Platform**: Share farming knowledge, connect with other farmers, and join specialized farming groups

### For Store Owners

- **Store Management**: Complete management system for agricultural input stores
- **Inventory Management**: Track products, stock levels, and expiry dates
- **GST-Compliant Billing System**: Generate proper invoices with GST calculations
- **Customer Management**: Link farmers to purchases for better relationship management
- **Financial Analytics**: Track sales and profit metrics
- **GST-Compliant Billing**: Generate and manage digital receipts with farmer accounts
- **Sales Analytics**: Monitor product performance and seasonal trends

### For Agricultural Experts

- **Consultation Management**: Schedule and manage farmer consultations
- **Knowledge Sharing**: Publish articles and advice for farmers
- **Regional Monitoring**: Track trends in crop health and pest outbreaks

### For Consumers

- **Farm-to-Table**: Direct access to locally grown produce
- **Transparency**: Track food origins and growing methods
- **Seasonal Guides**: Information on what's fresh and in season

## Feature Deep Dive

### Soil Health Monitoring

The Soil Health Monitoring feature helps farmers track and manage soil quality across different farm locations:

#### Key Capabilities

- **Multiple Farm Locations**: Manage and track soil tests for different areas of your farm
- **Comprehensive Soil Metrics**: Record key soil health indicators:
  - pH levels (acidity/alkalinity)
  - Nitrogen content (kg/ha)
  - Phosphorus content (kg/ha)
  - Potassium content (kg/ha)
  - Organic matter percentage
  - Soil moisture levels
- **Visual Health Indicators**: Color-coded metrics show at a glance if values are:
  - Optimal (green)
  - Below recommended levels (orange)
  - Above recommended levels (purple)
- **Tailored Recommendations**: Receive specific advice based on your soil test results
- **Historical Data**: View all past soil tests with comprehensive details
- **Filter by Location**: Focus on specific areas of your farm
- **Trend Analysis**: Visualize changes in soil health metrics over time
- **Educational Information**: Learn about optimal soil parameters for different crops

#### Workflow

1. Add soil test results after laboratory analysis
2. View color-coded indicators of soil health
3. Get recommendations based on test results
4. Monitor trends over time to see improvements
5. Plan improvements based on detailed recommendations

#### Benefits

- Make informed decisions about soil amendments
- Track effectiveness of soil improvement strategies
- Optimize fertilizer application
- Improve crop yields through better soil health
- Reduce costs by applying only necessary treatments

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI/ML**: Google Gemini 2.0 for crop analysis
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Data Visualization**: Recharts for displaying soil health trends
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase project (for database and authentication)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/krishisagar.git
   cd krishisagar
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file with your environment variables
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
   ```

4. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The project uses Supabase as the database. Run the migration scripts in the following order:

1. Base schema and auth
2. User profiles
3. Farmer-specific tables
4. Store owner tables
5. Expert tables
6. Consumer tables

Migrations are located in the `supabase/migrations` directory.

### Database Tables for Soil Health

- **soil_tests**: Records individual soil test results with metrics like pH, nitrogen, phosphorus, etc.
- **soil_recommendations**: Contains expert recommendations for various soil conditions
- **farm_locations**: Manages different farm areas for testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Our farmers who provide valuable feedback
- Agricultural universities for domain knowledge
- Open source community for amazing tools and libraries

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## KrishiGram - Social Farming Network

KrishiGram is a specialized social platform for farmers, inspired by Instagram and WhatsApp, designed to promote knowledge sharing and community building in agriculture.

### Features

- **Content Feed**: View and interact with posts from other farmers in a familiar social media format
- **Post Creation**: Share farming tips, success stories, and questions with the agricultural community
- **Media Support**: Upload images and videos of crops, techniques, and farm activities
- **Knowledge Communities**: Join specialized groups focused on specific crops, farming methods, or regional practices
- **Agricultural Tags**: Discover content using farming-specific tags like #OrganicFarming, #PestControl, etc.
- **Direct Messaging**: Connect privately with other farmers and experts
- **Social Learning**: Learn from others' experiences through visual content and discussions

### Benefits

- Facilitates peer-to-peer knowledge transfer in agriculture
- Creates communities of practice around specific farming challenges
- Promotes organic farming and sustainable practices through showcasing real-world examples
- Connects isolated farmers with broader agricultural communities
- Preserves and spreads traditional farming knowledge across generations

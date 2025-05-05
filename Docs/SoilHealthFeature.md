# Soil Health Monitoring Feature

## Overview

The Soil Health Monitor is a comprehensive tool designed for farmers to track and manage soil quality across their farm locations. This feature allows farmers to:

1. Record and monitor key soil health metrics over time
2. Receive custom recommendations based on soil test results
3. Manage multiple farm locations for soil testing
4. View historical test data with visual indicators of soil health

## Technical Implementation

The Soil Health feature consists of several components:

### Database Schema

The feature uses three primary tables in the Supabase database:

1. **soil_tests**: Stores individual soil test results with metrics like pH, nitrogen, phosphorus, and more
2. **soil_recommendations**: Contains expert recommendations for various soil conditions
3. **farm_locations**: Manages different farm areas for testing

All tables have proper Row Level Security (RLS) policies to ensure data privacy and security.

### Frontend Components

The main component is `SoilHealthComponent.tsx`, which provides:

- A form to add new soil test results
- A history view of past tests with color-coded indicators 
- Dynamic recommendations based on the latest test results
- A system to manage farm locations

### API Layer

The Supabase client library (`src/lib/supabase/client.ts`) includes several functions for soil health data management:

- `getSoilTests`: Retrieves all soil tests for the current user
- `getSoilTestById`: Gets a specific test by ID
- `addSoilTest`: Adds a new soil test
- `updateSoilTest`: Updates an existing test record
- `deleteSoilTest`: Removes a test from the database
- `getSoilRecommendations`: Gets all available recommendations
- `getFarmLocations`: Retrieves all farm locations for the user
- `addFarmLocation`: Adds a new farm location

## Using the Soil Health Monitor

### Accessing the Feature

The Soil Health Monitor is available in the Farmer Dashboard under the "Soil Health" tab.

### Recording a New Soil Test

1. Click "Add Soil Test" on the Soil Health Monitor page
2. Fill in the test date and select the farm location
3. Enter soil metrics (pH, nitrogen, phosphorus, potassium, organic matter, moisture)
4. Add optional notes about the test conditions
5. Click "Save Test Results"

### Managing Farm Locations

1. When adding a new test, click the "+" button next to the location dropdown
2. Enter the name of the new farm location
3. Click "Add" to save the new location

### Understanding Results

The soil test history section displays all recorded tests with color-coded indicators:
- Green: Optimal levels
- Orange: Below recommended levels
- Purple: Above recommended levels

### Recommendations

Based on the most recent soil test, you'll receive tailored recommendations for improving soil health. These recommendations include:
- Specific actions to take
- Products or treatments to apply
- Application rates and methods
- Suitable crop types for the current soil conditions

## Integration with Other Features

The Soil Health Monitor integrates with other KrishiSagar platform features:

- **Crop Analysis**: Compare soil health with crop performance
- **Weather**: Understand how weather patterns affect soil conditions
- **Marketplace**: Find products recommended for your specific soil needs

## Future Enhancements

Planned enhancements for the Soil Health feature include:

1. Soil health trend charts and analysis
2. Integration with soil sensors for real-time monitoring
3. AI-based prediction of soil health based on farming practices
4. Community comparison to benchmark against similar farms
5. Export and reporting capabilities for soil test records

## Troubleshooting

If you encounter issues with the Soil Health Monitor:

1. Ensure you're logged in with a farmer account
2. Check your internet connection (data is stored in the cloud)
3. Verify that you have proper farm locations set up
4. Try refreshing the page if data doesn't load properly
5. Contact support if persistent errors occur 
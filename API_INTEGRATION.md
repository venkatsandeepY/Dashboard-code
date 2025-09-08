# API Integration Documentation

## Backend API Integration

This dashboard now integrates with the real-time backend API to display live batch status data.

### API Endpoint
- **URL**: `https://etems-backend-dev-dev-250904-1046.apps-useast1-apps-dev-2.ocpdev.us-east-1.ac.discoverfinancial.com/api/v1/overallstatus`
- **Method**: GET
- **Response**: JSON containing batch status data for all environments

### Features Implemented

#### 1. Real-time Data Fetching
- Automatic data refresh every 30 seconds
- Manual refresh button
- Real-time status indicators

#### 2. Error Handling
- Graceful fallback to mock data when API is unavailable
- Clear error messages displayed to users
- Data source indicators (Live Data, Fallback Data, Mock Data)

#### 3. Configuration Management
- Environment-based configuration
- Configurable API endpoints
- Adjustable refresh intervals and timeouts

#### 4. Data Source Indicators
- 🟢 Live Data: Real-time data from API
- 🟡 Fallback Data: Mock data due to API error
- ⚪ Mock Data: Development mode

### File Structure

```
src/
├── config/
│   └── environment.js          # Environment configuration
├── services/
│   └── apiService.js          # API service layer
├── data/
│   └── mockData.js            # Data fetching with fallback
└── pages/
    └── Status.jsx             # Status page with real-time updates
```

### Configuration

#### Environment Variables
- `VITE_APP_ENV`: Application environment (development, staging, production)
- `VITE_MOCK_API`: Force use of mock data (true/false)

#### Environment Configuration
The application supports multiple environments with different API endpoints:

```javascript
// src/config/environment.js
const environments = {
  development: {
    API_BASE_URL: 'https://etems-backend-dev-dev-250904-1046.apps-useast1-apps-dev-2.ocpdev.us-east-1.ac.discoverfinancial.com',
    USE_MOCK_DATA: false,
    AUTO_REFRESH_INTERVAL: 30000,
    REQUEST_TIMEOUT: 10000,
  },
  // ... other environments
};
```

### Usage

#### For Development
1. Set `VITE_MOCK_API=true` in your environment to use mock data
2. Or leave it false to use real API data

#### For Production
1. Ensure `VITE_MOCK_API=false`
2. Verify API endpoint is accessible
3. Monitor error logs for API connectivity issues

### API Response Format

The API should return data in the following format:

```json
{
  "lastRefresh": "2025-01-XX XX:XX:XX",
  "batchDetails": [
    {
      "environment": "ASYS",
      "overallBatchStatus": [
        {
          "batchId": "A_20250904_SEP_CRD",
          "batchType": "CARD",
          "runDate": "SEP-04-25",
          "lrd": "OCT-01-25",
          "startTime": "SEP-04-25 19:40",
          "endTime": "",
          "status": "INPROGRESS",
          "completion": "95",
          "daysRun": null,
          "days": "2912560",
          "hours": "16",
          "mins": "32",
          "latest": "2025-09-04 00:00:00",
          "eta": "SEP-05-25 10:02",
          "phase": {
            "POSTRUN": { "status": "COMPLETED" },
            "CPB": { "status": "COMPLETED" },
            // ... other phases
          },
          "nextLRD": null
        }
        // ... other batches
      ]
    }
    // ... other environments
  ]
}
```

### Error Handling

The application handles various error scenarios:

1. **Network Errors**: Falls back to mock data
2. **API Timeout**: 10-second timeout with fallback
3. **Invalid Response**: Displays error message with fallback data
4. **Server Errors**: Shows HTTP status with fallback data

### Monitoring

- Check browser console for API request/response logs
- Monitor data source indicators in the UI
- Watch for error messages in the application

### Troubleshooting

#### API Not Responding
1. Check network connectivity
2. Verify API endpoint URL
3. Check CORS settings if running locally
4. Review browser console for errors

#### Data Not Updating
1. Check auto-refresh interval configuration
2. Verify API response format
3. Check for JavaScript errors in console

#### Fallback Data Showing
1. Check API endpoint accessibility
2. Verify API response format matches expected structure
3. Review error messages in console

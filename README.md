# Comms Manager - Zendesk App

A Zendesk app that allows agents to update multiple linked incident tickets when working with problem tickets.

## Overview

When managing problem tickets with multiple linked incidents, agents often need to apply the same comment or status update to all related incidents. This app automates that process by:

- Copying comments from problem tickets to all linked unsolved incidents
- Syncing status changes from problem tickets to all linked unsolved incidents
- Handling bulk operations with rate limiting and error handling
- Operating within the Zendesk interface

## Features

### Core Functionality
- Bulk comment copying: Apply problem ticket comments to all linked incidents with the same comment privacy
- Status synchronization: Update all linked incidents to match the problem ticket's new status
- Smart filtering: Only affects unsolved incidents (excludes solved/closed tickets)
- Automatic detection: Only appears on problem tickets, hidden on other ticket types

### Technical Features
- Rate limiting: Handles Zendesk API rate limits with automatic retry logic
- Batch processing: Processes tickets in optimized batches
- Error handling: Graceful error handling with notifications
- Real-time resize: Dynamic app sizing based on content
- Event-driven: Responds to ticket save events

### Internationalization
- Multi-language support: Available in 8 languages (English, French, German, Korean, Japanese, Spanish, Portuguese, Russian)
- Automatic locale detection: Uses agent's Zendesk locale settings
- Fallback support: English fallbacks if translations fail

### Configuration
- Configurable limits: Admin-configurable maximum number of incidents to update

## Installation

### Prerequisites
- Zendesk account with admin privileges
- Node.js 22.21.0+ (for development)
- Zendesk CLI tools (for deployment)

### Development Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd zdapps_comms_manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

### Deployment to Zendesk

1. Package the app
   - Compress the app files manually and upload

2. Upload to Zendesk
   - Navigate to Admin > Apps and integrations > Apps > Upload private app
   - Upload the generated .zip file
   - Configure app settings as needed

Alternatively, use ZCLI tools to upload. 
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd zdapps_comms_manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build for production
   ```bash
   npm run build
   ```

4. Upload app
   ```bash
   zcli apps:create dist
   -OR-
   zcli apps:update dist
   ```

## Usage

### For Agents

1. Open a Problem Ticket
   - The app appears in the ticket sidebar for problem tickets
   - The app is hidden for other ticket types (incidents, questions, etc.)

2. Choose Your Actions
   - Copy comment to incidents: Your comment will be added to all unsolved linked incidents
   - Match status to incidents: All unsolved incidents will be updated to match the problem ticket's status

3. Submit Your Update
   - Add your comment and/or change the ticket status as usual
   - Click "Submit as..." (Public reply, Internal note, etc.)
   - The app processes your selected actions

4. Monitor Progress
   - Receive notifications about the bulk update progress
   - See confirmation when updates are submitted

### For Administrators

1. App Settings
   - Navigate to Admin > Apps and integrations > Apps > Incident Updater
   - Configure "Maximum incidents to update" (default: 3000)
   - Higher values allow more incidents but may impact performance

2. Monitoring
   - Bulk updates are processed as background jobs
   - Check individual incidents to verify updates were applied
   - Monitor API usage if processing large volumes

## Technical Architecture

### Component Structure
```
src/
├── app/
│   ├── locations/
│   │   └── TicketSideBar.jsx     # Main UI component
│   ├── utils/
│   │   ├── eventHandlers.js      # Ticket save event handling
│   │   ├── bulkTicketUpdater.js  # Bulk API operations
│   │   ├── ticketDataFetcher.js  # Data retrieval functions
│   │   └── resizeUtils.js        # App resizing utilities
│   ├── hooks/
│   │   ├── useClient.js          # Zendesk client hook
│   │   └── useI18n.js            # Internationalization hook
│   └── contexts/
│       ├── ClientProvider.jsx    # ZAF client context
│       └── TranslationProvider.jsx # I18n context
├── translations/                 # Multi-language support
└── manifest.json                 # App configuration
```

### Key Technologies
- React 18: Modern React with hooks for UI components
- Zendesk Apps Framework (ZAF): Integration with Zendesk platform
- Styled Components: CSS-in-JS styling with Zendesk Garden tokens
- Vite: Fast build tool and development server
- Vitest: Testing framework for unit and integration tests

### API Integration
- Zendesk REST API: For bulk ticket updates and data retrieval
- Cursor pagination: Efficient handling of large incident lists
- Rate limiting: Automatic handling of 429 responses with retry-after headers
- Batch processing: Optimized API calls to minimize request volume

## Configuration

### App Settings (manifest.json)
```json
{
  "parameters": {
    "maxIncidentsToUpdate": {
      "type": "number",
      "default": 3000,
      "required": false
    }
  }
}
```

### Environment Variables
- Development server runs on `http://localhost:3000`
- Build outputs to `dist/` directory
- Package creates deployment-ready `.zip` file

## Limitations

1. API Rate Limits: Subject to Zendesk API rate limiting (handled automatically)
2. Batch Size: Submits up to 100 ticket per API call (Zendesk limit)
3. Solved Tickets: Automatically skips bulk updates when problem ticket is changed to "solved" (Zendesk handles this natively)
4. Closed Tickets: App functionality is disabled for closed problem tickets

## Troubleshooting

### Common Issues

**App doesn't appear**
- Verify you're viewing a problem ticket (not incident/question)
- Check that the app is installed and enabled
- Refresh the page and try again

**Bulk update not working**
- Ensure checkboxes are selected before submitting
- Verify you have permissions to update the linked incidents
- Check that there are unsolved linked incidents to update

**Performance issues**
- Reduce the "Maximum incidents to update" setting
- Process smaller batches during peak usage times
- Contact admin to monitor API usage

### Debug Information
- Enable browser developer tools to see console logs
- Check Zendesk audit logs for API call details
- Review individual incident tickets to verify updates

---

# QA Testing Plan

## Overview
This testing plan covers all functionality of the Comms Manager app, which allows agents to update multiple linked incident tickets when working with problem tickets.

## Pre-Testing Setup

### Test Environment Requirements
- Zendesk Support instance with admin access
- Test problem tickets with linked incident tickets
- Agent accounts with appropriate permissions
- Browser developer tools access for debugging

### Test Data Setup
1. **Create Problem Tickets** with:
   - Multiple linked incidents (minimum 5, ideally 10+)
   - Mix of incident statuses: open, pending, on-hold, solved, closed
2. **Prepare Test Comments**:
   - Public comment content
   - Internal note content
   - Comments with special characters/formatting
   - Comments with attachments
3. **Configure App Settings**:
   - Set maxIncidentsToUpdate to various values (100, 1000, 3000)

---

## Test Case 1: App Presence and Visibility

### Objective
Verify the app appears only on problem tickets and behaves correctly based on ticket type and status.

### Test Steps

#### 1.1 Problem Ticket - App Should Show
1. Navigate to a problem ticket
2. Verify app appears in the ticket sidebar
3. Verify app title displays "Update Linked Incidents"
4. Verify two checkboxes are present:
   - "Copy comment to incidents"
   - "Sync status to incidents"

**Expected Result**: App is visible and fully functional

#### 1.2 Incident Ticket - App Should Hide
1. Navigate to an incident ticket
2. Verify app does NOT appear in sidebar

**Expected Result**: App is hidden/not visible

#### 1.3 Question Ticket - App Should Hide
1. Navigate to a question ticket
2. Verify app does NOT appear in sidebar

**Expected Result**: App is hidden/not visible

#### 1.4 Task Ticket - App Should Hide
1. Navigate to a task ticket
2. Verify app does NOT appear in sidebar

**Expected Result**: App is hidden/not visible

#### 1.5 Solved Problem Ticket - Checkboxes Disabled
1. Navigate to a solved problem ticket
2. Verify app appears but checkboxes are disabled
3. Verify checkboxes cannot be checked

**Expected Result**: App visible but checkboxes disabled

#### 1.6 Closed Problem Ticket - Checkboxes Disabled
1. Navigate to a closed problem ticket
2. Verify app appears but checkboxes are disabled
3. Verify checkboxes cannot be checked

**Expected Result**: App visible but checkboxes disabled

---

## Test Case 2: Comment Copying Functionality

### Objective
Verify comments are copied correctly with proper privacy settings.

### Test Steps

#### 2.1 Public Comment Copy
1. Open problem ticket with unsolved linked incidents
2. Check "Copy comment to incidents" checkbox
3. Add a public reply: "This is a public test comment"
4. Submit as "Public reply"
5. Wait for processing completion
6. Check 3-5 linked incident tickets
7. Verify comment appears on incidents with:
   - Same text content
   - Public visibility
   - "comms_manager_app" tag

**Expected Result**: Public comment copied to all unsolved incidents as public

#### 2.2 Internal Comment Copy
1. Open problem ticket with unsolved linked incidents
2. Check "Copy comment to incidents" checkbox
3. Add an internal note: "This is an internal test note"
4. Submit as "Internal note"
5. Wait for processing completion
6. Check 3-5 linked incident tickets
7. Verify comment appears on incidents with:
   - Same text content
   - Internal visibility
   - "comms_manager_app" tag

**Expected Result**: Internal comment copied to all unsolved incidents as internal

#### 2.3 Comment with Special Characters
1. Use comment with special characters: "Test comment with émojis 🎯 & special chars: <>"
2. Follow steps from 2.1
3. Verify special characters are preserved correctly

**Expected Result**: Special characters preserved in copied comments

#### 2.4 No Comment Copy When Unchecked
1. Leave "Copy comment to incidents" unchecked
2. Add any comment and submit
3. Verify NO comments are added to linked incidents

**Expected Result**: No comments copied when checkbox unchecked

---

## Test Case 3: Status Synchronization

### Objective
Verify status changes are synchronized correctly to linked incidents.

### Test Steps

#### 3.1 Basic Status Sync
1. Open problem ticket with linked incidents
2. Check "Sync status to incidents" checkbox
3. Change problem ticket status from "Open" to "Pending"
4. Submit the update
5. Wait for processing completion
6. Check 3-5 linked incident tickets
7. Verify status changed to "Pending" and "comms_manager_app" tag added

**Expected Result**: All unsolved incidents updated to "Pending" status

#### 3.2 Custom Status Sync
1. Open problem ticket with custom statuses available
2. Check "Sync status to incidents" checkbox
3. Change to a custom status (e.g., "Waiting for Customer")
4. Submit the update
5. Check linked incidents
6. Verify custom status applied correctly and "comms_manager_app" tag added

**Expected Result**: Custom status synchronized to incidents

#### 3.3 No Status Sync When Unchecked
1. Leave "Sync status to incidents" unchecked
2. Change problem ticket status
3. Submit update
4. Verify linked incident statuses remain unchanged

**Expected Result**: No status changes when checkbox unchecked

---

## Test Case 4: Combined Operations

### Objective
Verify both comment copying and status sync work together.

### Test Steps

#### 4.1 Both Actions Enabled
1. Open problem ticket with linked incidents
2. Check BOTH checkboxes:
   - "Copy comment to incidents"
   - "Sync status to incidents"
3. Add comment: "Combined test - updating status and comment"
4. Change status to "Pending"
5. Submit as "Public reply"
6. Wait for processing completion
7. Check linked incidents for:
   - Comment copied correctly
   - Status changed to "Pending"
   - "comms_manager_app" tag added

**Expected Result**: Both comment and status updated on incidents

#### 4.2 Multiple Rapid Updates
1. Enable both checkboxes
2. Submit first update
3. Immediately submit second update with different comment/status
4. Verify both updates process correctly without conflicts

**Expected Result**: Multiple updates handled correctly

---

## Test Case 5: Solved Status Behavior

### Objective
Verify app skips updates when problem ticket is in solved status.

### Test Steps

#### 5.1 Solved Status Skip
1. Open problem ticket with unsolved linked incidents
2. Check both checkboxes
3. Change problem ticket status to "Solved"
4. Add comment: "Should not be duplicated"
5. Submit update
6. Verify linked incidents do not have a duplicated comment
7. Verify status of linked incidents are "Solved"

**Expected Result**: Updates skipped when problem ticket marked as solved

---

## Test Case 6: Incident Filtering

### Objective
Verify only unsolved incidents are updated (solved/closed incidents skipped).

### Test Steps

#### 6.1 Mixed Status Incidents
1. Create problem ticket with incidents in various statuses, like:
   - 3 open incidents
   - 2 pending incidents  
   - 2 solved incidents
2. Check "Copy comment to incidents"
3. Add test comment and submit
4. Verify comment only appears only on unsolved incidents

**Expected Result**: Only unsolved incidents updated

---

## Test Case 7: Performance and Rate Limiting

### Objective
Verify app handles large numbers of incidents and rate limiting correctly.

### Test Steps

#### 7.1 Large Incident Count
1. Create problem ticket with 101+ unsolved linked incidents
2. Enable both checkboxes
3. Submit update
4. Monitor for:
   - Successful processing completion
   - No timeout errors
   - All incidents updated correctly

**Expected Result**: Large batches processed successfully

#### 7.2 Rate Limiting Simulation
1. Configure low maxIncidentsToUpdate (50)
2. Create problem with 101+ unsolved incidents
3. Submit update
4. Verify:
   - Processing respects limit
   - Only first 50 incidents processed

**Expected Result**: Rate limiting respected correctly

---

## Test Case 9: Internationalization

### Objective
Verify app works correctly in different languages.

### Test Steps

#### 9.1 Language Testing
For each supported language (EN, FR, DE, KO, JA, ES, PT, RU):
1. Set agent locale to target language
2. Verify app UI displays in correct language
3. Verify all text is properly translated
4. Test core functionality works the same

**Expected Result**: Full functionality in all supported languages

---

## Test Case 10: App Settings

### Objective
Verify admin settings work correctly.

### Test Steps

#### 10.1 Max Incidents Configuration
1. As admin, set maxIncidentsToUpdate to 50
2. Create problem with 101+ linked incidents
3. Test update processes only first 50 incidents
4. Change setting to 200
5. Verify increased limit works

**Expected Result**: Settings applied correctly

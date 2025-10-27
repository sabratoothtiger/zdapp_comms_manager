/**
 * Main utilities export file
 */

// Zendesk API utilities
export {
  getCurrentComment,
  getCurrentTicket,
  getLinkedIncidents,
  getAppSettings
} from './ticketDataFetcher.js'

// Bulk ticket update utilities
export {
  updateIncidentTickets,
  doBulkTicketUpdate
} from './bulkTicketUpdater.js'

// Event handling utilities
export {
  setupTicketSubmitListeners
} from './eventHandlers.js'
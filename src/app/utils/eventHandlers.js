import { getCurrentComment, getCurrentTicket } from './ticketDataFetcher.js'
import { doBulkTicketUpdate } from './bulkTicketUpdater.js'

export const setupTicketSubmitListeners = (client, getCurrentActions, handleSaveDone) => {
  let currentComment = null

  const handleTicketSave = async () => {
    const actions = typeof getCurrentActions === 'function' ? getCurrentActions() : getCurrentActions
    
    if (actions.applyToLinkedIncidents || actions.syncLinkedIncidentStatus) {
      try {
        currentComment = await getCurrentComment(client)
        const currentTicket = await getCurrentTicket(client)
                
        if (currentTicket) {
          // Skip bulk update if problem ticket is in solved status
          // Zendesk handles linked incidents automatically for solved problem tickets
          if (currentTicket.status === 'solved') {
            if (handleSaveDone) {
              handleSaveDone()
            }
            currentComment = null
            return
          }

          const updateActions = {
            applyComment: actions.applyToLinkedIncidents,
            changeStatus: actions.syncLinkedIncidentStatus,
            status: actions.syncLinkedIncidentStatus ? currentTicket.status : null,
            customStatusId: actions.syncLinkedIncidentStatus ? currentTicket.customStatus?.id : null
          }
          
          await doBulkTicketUpdate(client, currentTicket.id, currentComment, updateActions)
        }

        if (handleSaveDone) {
          handleSaveDone()
        }
        
        currentComment = null
      } catch (error) {
        // Silently handle errors
      }
    }
  }

  client.off('ticket.save')
  client.on('ticket.save', handleTicketSave)

  return () => {
    client.off('ticket.save', handleTicketSave)
  }
}
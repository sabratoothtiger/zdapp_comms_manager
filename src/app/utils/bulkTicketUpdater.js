import { getLinkedIncidents } from './ticketDataFetcher.js'

const MAX_RETRIES = 3
const RETRY_AFTER_DEFAULT = 30
const BATCH_SIZE = 1

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const makeRateLimitedRequest = async (client, settings, maxRetries = MAX_RETRIES) => {
  let attempt = 0
  
  while (attempt <= maxRetries) {
    try {
      const response = await client.request(settings)
      return response
    } catch (error) {
      if (error.status !== 429 || attempt >= maxRetries) {
        if (error.status === 429) {
          throw new Error(`Rate limit exceeded after ${maxRetries} retries. Please try again later.`)
        }
        throw new Error(`API request failed: ${error.message || 'Unknown error'}`)
      }
      
      const retryAfter = error.retryAfter || error.headers?.['retry-after'] || RETRY_AFTER_DEFAULT
      const waitTime = parseInt(retryAfter) * 1000
      
      client.invoke('notify', `Rate limited. Waiting ${retryAfter} seconds before retrying...`, 'notice', 3000)
      
      await sleep(waitTime)
      attempt++
      continue
    }
  }
}

export const updateIncidentTickets = async (client, incidentIds, currentComment, actions = {}) => {
  if (!incidentIds.length) {
    return
  }

  if (!actions.applyComment && !actions.changeStatus) {
    return
  }

  let ticketUpdate = {
    ticket: {
      additional_tags: ['comms_manager_app']
    }
  }

  if (actions.applyComment && currentComment && currentComment.text) {
    ticketUpdate.ticket.comment = {
      html_body: currentComment.text,
      public: currentComment.type === 'publicReply'
    }
  }

  if (actions.changeStatus && actions.status) {
    ticketUpdate.ticket.status = actions.status,
    ticketUpdate.ticket.custom_status_id = actions.customStatusId
  }

  const buckets = []
  const incidentsCopy = [...incidentIds]

  while (incidentsCopy.length > 0) {
    buckets.push(incidentsCopy.splice(0, BATCH_SIZE))
  }

  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i]
    const incidentTicketIds = bucket.join(',')
    const settings = {
      url: `/api/v2/tickets/update_many.json?ids=${incidentTicketIds}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(ticketUpdate)
    }

    try {
      const response = await makeRateLimitedRequest(client, settings)
    } catch (error) {
      throw error
    }
  }
}

export const doBulkTicketUpdate = async (client, problemTicketId, currentComment, actions) => {
  try {
    const incidents = await getLinkedIncidents(client, problemTicketId)
    
    if (incidents.length === 0) {
      client.invoke('notify', 'No linked incident tickets to update', 'notice', 3000)
      return
    }

    client.invoke('notify', `Submitting bulk update for ${incidents.length} incident tickets...`, 'notice', 3000)
    
    await updateIncidentTickets(client, incidents, currentComment, actions)
    
    client.invoke('notify', `Bulk update jobs submitted successfully. Updates will process in the background.`, 'notice', 4000)
    
  } catch (error) {
    
    if (error.message && error.message.includes('Rate limit exceeded')) {
      client.invoke('notify', 'Rate limit exceeded. Please wait a moment and try again.', 'error', 5000)
      return
    }
    
    client.invoke('notify', `Error updating incident tickets: ${error.message}`, 'error', 5000)
  }
}
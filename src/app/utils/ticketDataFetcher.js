const MAX_INCIDENTS_TO_UPDATE_DEFAULT = 3000

export const getAppSettings = async (client) => {
  try {
    const settings = await client.metadata()
    
    const defaultSettings = {
      maxIncidentsToUpdate: MAX_INCIDENTS_TO_UPDATE_DEFAULT
    }
    
    const appSettings = {
      ...defaultSettings,
      ...settings.settings
    }
    
    return appSettings
  } catch (error) {
    return {
      maxIncidentsToUpdate: MAX_INCIDENTS_TO_UPDATE_DEFAULT
    }
  }
}

export const getLinkedIncidents = async (client, problemTicketId) => {
  try {
    const appSettings = await getAppSettings(client)
    const maxIncidentsToUpdate = appSettings.maxIncidentsToUpdate
    
    let allIncidents = []
    let nextPage = null
    
    do {
      if (allIncidents.length >= maxIncidentsToUpdate) {
        break
      }
      
      let url = `/api/v2/tickets/${problemTicketId}/incidents`
      if (nextPage) {
        const urlParams = new URL(nextPage).searchParams
        const cursor = urlParams.get('page[after]')
        if (cursor) {
          url += `?page[after]=${encodeURIComponent(cursor)}`
        }
      }
      
      const settings = {
        url: url,
        type: 'GET',
        contentType: 'application/json'
      }
      
      const response = await client.request(settings)
      
      if (response.tickets && response.tickets.length > 0) {
        // Filter out solved/closed tickets
        const activeIncidents = response.tickets.filter(ticket => {
          const status = ticket.status?.toLowerCase()
          return status !== 'solved' && status !== 'closed'
        })
        
        const activeIds = activeIncidents.map(ticket => ticket.id)
        allIncidents.push(...activeIds)
      }
      
      nextPage = response.links?.next || response.next_page
      
    } while (nextPage)
    
    return allIncidents
    
  } catch (error) {
    return []
  }
}

export const getCurrentComment = async (client) => {
  try {
    const response = await client.get('comment')
    return response.comment
  } catch (error) {
    return null
  }
}

export const getCurrentTicket = async (client) => {
  try {
    const response = await client.get('ticket')
    return response.ticket
  } catch (error) {
    return null
  }
}
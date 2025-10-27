import { useEffect, useState, useRef, useCallback } from 'react'
import { useClient } from '../hooks/useClient'
import { useI18n } from '../hooks/useI18n'
import { 
  setupTicketSubmitListeners
} from '../utils'
import { 
  setupResizeListeners, 
  createResizeFunction 
} from '../utils/resizeUtils'
import {
  Container,
  TitleSection,
  TitleRow,
  Title,
  Instructions,
  OptionsSection,
  Option,
  OptionHeader,
  OptionTitle,
  OptionDescription,
  Checkbox
} from './TicketSidebar.styles'

const TicketSidebar = () => {
  const client = useClient()
  const { t } = useI18n()
  
  const [ticketType, setTicketType] = useState(null)  
  const [isTicketSolvedOrClosed, setIsTicketSolvedOrClosed] = useState(false)
  
  const [applyToLinkedIncidents, setApplyToLinkedIncidents] = useState(false)
  const [syncLinkedIncidentStatus, setSyncLinkedIncidentStatus] = useState(false)

  // Ref allows event handlers to access current checkbox state without recreating listeners
  const actionsRef = useRef({
    applyToLinkedIncidents: false,
    syncLinkedIncidentStatus: false
  })

  const resizeApp = useCallback(() => createResizeFunction(client)(), [client])

  useEffect(() => {
    actionsRef.current = {
      applyToLinkedIncidents,
      syncLinkedIncidentStatus
    }
  }, [applyToLinkedIncidents, syncLinkedIncidentStatus])

  useEffect(() => {
    if (isTicketSolvedOrClosed) {
      setApplyToLinkedIncidents(false)
      setSyncLinkedIncidentStatus(false)
    }
    resizeApp()
  }, [isTicketSolvedOrClosed, resizeApp])

  useEffect(() => {
    if (!client) return
    const cleanup = setupResizeListeners(client, resizeApp)
    return cleanup
  }, [client, resizeApp])

  useEffect(() => {
    resizeApp()
  }, [ticketType, applyToLinkedIncidents, syncLinkedIncidentStatus, resizeApp])

  useEffect(() => {
    const loadTicketInfo = async () => {
      try {
        const [ticketData] = await Promise.all([
          client.get(['ticket.type', 'ticket.status']),
        ])
        
        setTicketType(ticketData['ticket.type'])
        setIsTicketSolvedOrClosed(ticketData['ticket.status'] === 'closed' || ticketData['ticket.status'] === 'solved')

        if (ticketData['ticket.type'] !== 'problem') {
          client.invoke('hide')
          return
        }
        
        client.invoke('show')
        resizeApp()
        
      } catch (error) {
        client.invoke('hide')
        return
      }
    }

    loadTicketInfo()
  }, [client, resizeApp])

  useEffect(() => {
    if (ticketType !== 'problem' || !client) {
      return
    }

    const handleSaveDone = () => {
      setApplyToLinkedIncidents(false)
      setSyncLinkedIncidentStatus(false)
    }

    const getCurrentActions = () => actionsRef.current

    const cleanup = setupTicketSubmitListeners(client, getCurrentActions, handleSaveDone)
    
    return cleanup
  }, [client, ticketType])

  if (ticketType === null) {
    return null
  }
  
  if (ticketType !== 'problem') {
    return null
  }

   return (
    <Container>
      <TitleSection>
        <TitleRow>
          <Title>
            {t('ticket_sidebar.title', 'Update Linked Incidents')}
          </Title>
        </TitleRow>
        <Instructions>
          {t('ticket_sidebar.instructions', 'When you update this problem ticket, these actions will apply to all unsolved linked incidents:')}
        </Instructions>
      </TitleSection>
      
      <OptionsSection>
        <Option>
          <OptionHeader>
            <Checkbox
              type="checkbox"
              id="applyComment"
              checked={applyToLinkedIncidents}
              disabled={isTicketSolvedOrClosed}
              onChange={(e) => setApplyToLinkedIncidents(e.target.checked)}
            />
            <OptionTitle htmlFor="applyComment">
              {t('ticket_sidebar.apply_comment_title', 'Copy comment to incidents')}
            </OptionTitle>
          </OptionHeader>
          <OptionDescription>
            {t('ticket_sidebar.apply_comment_description', '"Your comment will be added to all unsolved incidents. Public comments will be public, while internal comments will remain internal."')}
          </OptionDescription>
        </Option>
        
        <Option>
          <OptionHeader>
            <Checkbox
              type="checkbox"
              id="syncStatus"
              checked={syncLinkedIncidentStatus}
              disabled={isTicketSolvedOrClosed}
              onChange={(e) => setSyncLinkedIncidentStatus(e.target.checked)}
            />
            <OptionTitle htmlFor="syncStatus">
              {t('ticket_sidebar.sync_status_title', 'Sync status to incidents')}
            </OptionTitle>
          </OptionHeader>
          <OptionDescription>
            {t('ticket_sidebar.sync_status_description', 'All unsolved incidents will be updated to match this problem ticket\'s new status.')}
          </OptionDescription>
        </Option>
      </OptionsSection>
    </Container>
  )
}

export default TicketSidebar
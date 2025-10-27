import styled from 'styled-components'

export const Container = styled.div`
  font-family: var(--zd-font-family-system, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif);
  font-size: var(--zd-font-size-md, 14px);
  line-height: var(--zd-line-height-md, 20px);
  color: var(--zd-color-grey-800, #2f3941);
  box-sizing: border-box;
  border: 1px solid var(--zd-color-grey-300, #d8dcde);
  border-radius: 8px;
  margin: var(--zd-spacing-sm, 12px);
  padding: var(--zd-spacing, 20px);
  background-color: var(--zd-color-white, #fff);
  min-height: 200px;
  width: calc(100% - 24px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const TitleSection = styled.div`
  margin-bottom: var(--zd-spacing-sm, 12px);
  padding-bottom: var(--zd-spacing-xs, 8px);
  border-bottom: 1px solid var(--zd-color-grey-200, #e9ebed);
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--zd-spacing-xxs, 4px);
`

export const Title = styled.div`
  font-size: var(--zd-font-size-md, 14px);
  font-weight: var(--zd-font-weight-semibold, 600);
  color: var(--zd-color-grey-800, #2f3941);
  margin-bottom: var(--zd-spacing-xxs, 4px);
`

export const Instructions = styled.div`
  font-size: var(--zd-font-size-sm, 12px);
  color: var(--zd-color-grey-600, #68737d);
  line-height: var(--zd-line-height-sm, 16px);
`

export const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--zd-spacing-xs, 8px);
`

export const Option = styled.div`
  margin-bottom: var(--zd-spacing-xs, 8px);
`

export const OptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--zd-spacing-xs, 8px);
  margin-bottom: var(--zd-spacing-xxs, 4px);
`

export const OptionTitle = styled.label`
  font-size: var(--zd-font-size-md, 14px);
  font-weight: var(--zd-font-weight-semibold, 600);
  color: var(--zd-color-grey-800, #2f3941);
  cursor: pointer;
  user-select: none;
`

export const OptionDescription = styled.div`
  font-size: var(--zd-font-size-sm, 12px);
  color: var(--zd-color-grey-600, #68737d);
  margin-left: 24px; /* Align with text after checkbox */
  line-height: var(--zd-line-height-sm, 16px);
`

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--zd-color-blue-600, #1f73b7);
  cursor: pointer;
`
import { AccessorialFees } from '@/types'

export type AccessorialKind = 'currency' | 'quantity'

export interface AccessorialDefinition {
  key: keyof AccessorialFees
  labelKey: string
  kind: AccessorialKind
}

export const accessorials: AccessorialDefinition[] = [
  { key: 'chassis', labelKey: 'chassis', kind: 'currency' },
  { key: 'chassisDaysMin', labelKey: 'chassisDaysMin', kind: 'quantity' },
  { key: 'chassisSplit', labelKey: 'chassisSplit', kind: 'currency' },
  { key: 'triAxle', labelKey: 'triAxle', kind: 'currency' },
  { key: 'storage', labelKey: 'storage', kind: 'currency' },
  { key: 'prepull', labelKey: 'prepull', kind: 'currency' },
  { key: 'detentionHoursFree', labelKey: 'detentionHoursFree', kind: 'quantity' },
  { key: 'detentionPerHour', labelKey: 'detentionPerHour', kind: 'currency' },
  { key: 'overweight', labelKey: 'overweight', kind: 'currency' },
  { key: 'hazmat', labelKey: 'hazmat', kind: 'currency' },
  { key: 'drop', labelKey: 'drop', kind: 'currency' },
  { key: 'layover', labelKey: 'layover', kind: 'currency' },
  { key: 'bond', labelKey: 'bond', kind: 'currency' },
  { key: 'stopOff', labelKey: 'stopOff', kind: 'currency' },
] satisfies AccessorialDefinition[]

export const accessorialMap = accessorials.reduce<Record<keyof AccessorialFees, AccessorialDefinition>>(
  (acc, item) => {
    acc[item.key] = item
    return acc
  },
  {} as Record<keyof AccessorialFees, AccessorialDefinition>,
)

export const createZeroAccessorials = (): AccessorialFees =>
  accessorials.reduce<AccessorialFees>((acc, item) => {
    acc[item.key] = 0
    return acc
  }, {} as AccessorialFees)

export const createEmptyAccessorialStrings = (): Record<keyof AccessorialFees, string> =>
  accessorials.reduce<Record<keyof AccessorialFees, string>>((acc, item) => {
    acc[item.key] = ''
    return acc
  }, {} as Record<keyof AccessorialFees, string>)


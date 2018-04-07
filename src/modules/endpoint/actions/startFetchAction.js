// @flow

import { createAction } from 'redux-actions'
import Payload from '../Payload'

import type { Action } from 'redux-first-router/dist/flow-types'

export const startFetchActionName = (stateName: string): string => `START_FETCH_${stateName.toUpperCase()}`

const startFetchAction = (stateName: string): Action => createAction(startFetchActionName(stateName))(new Payload(true))

export default startFetchAction
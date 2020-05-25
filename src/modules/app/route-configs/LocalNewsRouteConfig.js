// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createLocalNewsEndpoint,
  createLanguagesEndpoint,
  LocalNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type LocalNewsRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| localNews: Payload<Array<LocalNewsModel>> |}

export const LOCAL_NEWS_ROUTE = 'LOCAL_NEWS'

const localNewsRoute: Route = {
  path: '/:city/:language/news/local',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsEndpoint(cmsApiBaseUrl), dispatch, state.localNews, { city, language }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class LocalNewsRouteConfig implements RouteConfig<LocalNewsRouteParamsType, RequiredPayloadsType> {
  name = LOCAL_NEWS_ROUTE
  route = localNewsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
    const { city } = location.payload
    return this.getRoutePath({ city, language })
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ localNews: payloads.localNewsPayload })

  getPageTitle = ({ t, cityName }) => {
    if (!cityName) {
      return null
    }
    return `${t('pageTitles.localNews')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: LocalNewsRouteParamsType): string => `/${city}/${language}/news/local`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default LocalNewsRouteConfig
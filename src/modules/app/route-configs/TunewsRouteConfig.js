// @flow

import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createTunewsEndpoint,
  createTunewsLanguagesEndpoint,
  Payload,
  CityModel
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'
import type { AllPayloadsType } from './RouteConfig'

type TunewsRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| cities: Payload<Array<CityModel>> |} // Loading tunews is handled inside Page

export const TUNEWS_ROUTE = 'TU_NEWS'

const tunewsRoute: Route = {
  path: '/:city/:language/news/tu-news',
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createTunewsLanguagesEndpoint(tunewsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchData(createTunewsEndpoint(tunewsApiBaseUrl), dispatch, state.tunews.payload, {
        page: 1,
        language,
        count: 20
      })
    ])
  }
}

class TunewsRouteConfig implements RouteConfig<TunewsRouteParamsType, RequiredPayloadsType> {
  name = TUNEWS_ROUTE
  route = tunewsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({
    cities: payloads.citiesPayload
  })

  getPageTitle = ({ t, cityName, payloads, location }) => {
    if (!cityName) {
      return null
    }
    const cityModel = payloads.cities.data &&
      payloads.cities.data.find(cityModel => cityModel.code === location.payload.city)
    if (!cityModel || !cityModel.tunewsEnabled) {
      return null
    }
    return `${t('pageTitles.tunews')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: TunewsRouteParamsType): string => `/${city}/${language}/news/tu-news`

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default TunewsRouteConfig

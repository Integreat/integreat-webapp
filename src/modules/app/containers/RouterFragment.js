import { Fragment } from 'redux-little-router'
import React from 'react'

import Layout from 'modules/layout/components/Layout'
import GeneralHeader from '../../layout/components/GeneralHeader'
import GeneralFooter from '../../layout/components/GeneralFooter'
import LocationLayout from '../../layout/containers/LocationLayout'

import SearchPage from 'routes/search/containers/SearchPage'
import DisclaimerPage from 'routes/disclaimer/containers/DisclaimerPage'
import EventsPage from 'routes/events/containers/EventsPage'
import PdfFetcherPage from 'routes/pdf-fetcher/containers/PdfFetcherPage'
import MainDisclaimerPage from 'routes/main-disclaimer/components/MainDisclaimerPage'
import LandingPage from 'routes/landing/containers/LandingPage'
import CategoriesPage from 'routes/categories/containers/CategoriesPage'
import ExtrasPage from 'routes/extras/containers/ExtrasPage'
import SprungbrettPage from 'routes/sprungbrett/containers/SprungbrettPage'
import I18nRedirect from 'modules/app/containers/I18nRedirect'
import PropTypes from 'prop-types'
import RouteConfig from '../RouteConfig'

const LANGUAGE_CODE_LENGTH = 2

/**
 * todo: Test and document in WEBAPP-90
 * todo: Layouts should be set in each route
 */
class RouterFragment extends React.Component {
  static propTypes = {
    routerConfig: PropTypes.instanceOf(RouteConfig).isRequired
  }

  static isLanguageCode (language) {
    return language && language.length === LANGUAGE_CODE_LENGTH
  }

  /**
   * This is the matchRoute from the supplied {@link routerConfig}
   *
   * @param id The id to look for
   * @returns {*|Route}
   */
  matchRoute = (id) => this.props.routerConfig.matchRoute(id)

  render () {
    /*
     * For routes inside a <React.Fragment /> the priority decreases with each element
     * So /disclaimer has higher priority than /:language -> '/disclaimer' resolves to /disclaimer
     */
    return <Fragment forRoute='/'>
      {/* Routes */}
      <React.Fragment>
        {/* No language was provided to redirect to a specific language (e.g. the browsers language) */}
        <Fragment forRoute='/'>
          <I18nRedirect />
        </Fragment>

        {/* Matches two or more arguments like /augsburg/de */}
        <Fragment forRoute='/:location/:language(/*)'>
          <LocationLayout matchRoute={this.matchRoute}>
            {/* Matches /augsburg/de/search -> Search */}
            <Fragment forRoute='/search'>
              <SearchPage />
            </Fragment>
            {/* Matches /augsburg/de/disclaimer -> Disclaimer */}
            <Fragment forRoute='/disclaimer'>
              <DisclaimerPage />
            </Fragment>
            {/* Matches /augsburg/de/events* -> Events */}
            <Fragment forRoute='/events(/:id)'>
              <EventsPage />
            </Fragment>
            {/* Matches /augsburg/de/fetch-pdf/* -> Redirect */}
            <Fragment forRoute='/fetch-pdf'>
              <PdfFetcherPage />
            </Fragment>
            <Fragment forRoute='/extras/sprungbrett'>
              <SprungbrettPage />
            </Fragment>
            <Fragment forRoute='/extras'>
              <ExtrasPage />
            </Fragment>
            {/* Matches /augsburg/de/* -> Content */}
            <Fragment forNoMatch>
              <CategoriesPage />
            </Fragment>
          </LocationLayout>
        </Fragment>

        {/* Matches /disclaimer */}
        <Fragment forRoute='/disclaimer'>
          <Layout header={<GeneralHeader />} footer={<GeneralFooter />}><MainDisclaimerPage /></Layout>
        </Fragment>

        {/* If language param is longer than 2, it is no language and is probably a location
        -> redirect the language-specific location */}
        <Fragment forRoute='/:unknown(/)' withConditions={
          location => !RouterFragment.isLanguageCode(location.params.unknown)
        }>
          <I18nRedirect />
        </Fragment>

        {/* Matches one or zero arguments like /de */}
        <Fragment forRoute='/:language(/)'>
          <Layout footer={<GeneralFooter />}><LandingPage /></Layout>
        </Fragment>

        {/* There are no missing routes. Covered:
              * Two or more arguments (Search/Disclaimer/Events/PdfFetcher/CategoriesPage)
              * One argument (MainDisclaimer or LandingPage with language preselection)
              * No arguments (LandingPage)
              */}

      </React.Fragment>
    </Fragment>
  }
}

export default RouterFragment

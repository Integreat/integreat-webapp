// @flow

import React from 'react'
import { shallow } from 'enzyme'

import ConnectedCategoriesPage, { CategoriesPage } from '../CategoriesPage'
import CategoryModel from '../../../../modules/endpoint/models/CategoryModel'
import CategoriesMapModel from '../../../../modules/endpoint/models/CategoriesMapModel'
import CityModel from '../../../../modules/endpoint/models/CityModel'
import configureMockStore from 'redux-mock-store'
import moment from 'moment-timezone'

describe('CategoriesPage', () => {
  const categoryModels = [
    new CategoryModel({
      id: 0,
      path: '/augsburg/de',
      title: 'augsburg',
      content: '',
      order: -1,
      availableLanguages: new Map(),
      thumbnail: 'no_thumbnail',
      parentPath: '',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      excerpt: 'excerpt'
    }), new CategoryModel({
      id: 3650,
      path: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentPath: '/augsburg/de',
      order: 75,
      availableLanguages: new Map([['en', '4361'], ['ar', '4367'], ['fa', '4368']]),
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      excerpt: 'excerpt'
    }),
    new CategoryModel({
      id: 3649,
      path: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentPath: '/augsburg/de',
      order: 11,
      availableLanguages: new Map([['en', '4861'], ['ar', '4867'], ['fa', '4868']]),
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      excerpt: 'excerpt'
    }),
    new CategoryModel({
      id: 35,
      path: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: 'some content',
      parentPath: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: new Map([['en', '390'], ['ar', '711'], ['fa', '397']]),
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png',
      lastUpdate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      excerpt: 'excerpt'
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  const cities = [
    new CityModel({
      name: 'Augsburg',
      code: 'augsburg',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Augsburg'}),
    new CityModel({
      name: 'Stadt Regensburg',
      code: 'regensburg',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'Regensburg'}),
    new CityModel({
      name: 'Werne',
      code: 'werne',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false,
      sortingName: 'City'
    })
  ]

  const city = 'augsburg'

  const language = 'en'
  const t = (key: ?string): string => key || ''

  it('should match snapshot and render a Page if page has no children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      path={categoryModels[3].path}
                      uiDirection={'ltr'}
                      t={t}
                      dispatch={action => {}}
                      routesMap={{}} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render a CategoryList if the category is neither the root but has children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      uiDirection={'ltr'}
                      path={categoryModels[2].path}
                      t={t}
                      dispatch={action => {}}
                      routesMap={{}} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render CategoryTiles if the path is the root category', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      uiDirection={'ltr'}
                      path={'/augsburg/de'}
                      t={t}
                      dispatch={action => {}}
                      routesMap={{}} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render an error if path is not valid', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      uiDirection={'ltr'}
                      language={language}
                      path={'/augsburg/de/not/valid'}
                      t={t}
                      dispatch={action => {}}
                      routesMap={{}} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should map state to props', () => {
    const pathname = '/augsburg/en/willkommen'
    const location = {
      payload: {city: city, language: language},
      pathname: pathname
    }

    const mockStore = configureMockStore()
    const store = mockStore({
      location: location,
      categories: {data: categories},
      cities: {data: cities}
    })

    const categoriesPage = shallow(
      <ConnectedCategoriesPage store={store} cities={cities} categories={categories} />
    )

    expect(categoriesPage.props()).toMatchObject({
      city,
      language,
      path: pathname,
      categories,
      cities
    })
  })
})

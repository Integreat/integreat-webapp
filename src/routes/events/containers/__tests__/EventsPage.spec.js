import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'
import moment from 'moment-timezone'

import createReduxStore from 'modules/app/createReduxStore'
import createHistory from 'modules/app/createHistory'
import EndpointBuilder from 'modules/endpoint/EndpointBuilder'
import EndpointProvider from 'modules/endpoint/EndpointProvider'

import ConnectedEventsPage, { EventsPage } from '../EventsPage'
import EventModel from 'modules/endpoint/models/EventModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

describe('EventsPage', () => {
  const events = [
    new EventModel({
      id: 1234,
      title: 'first Event',
      availableLanguages: {de: '1235', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: 1235,
      title: 'erstes Event',
      availableLanguages: {en: '1234', ar: '1236'},
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    }),
    new EventModel({
      id: 2,
      title: 'second Event',
      startDate: moment.tz('2017-11-18 09:30:00', 'UTC'),
      endDate: moment.tz('2017-11-18 19:30:00', 'UTC'),
      allDay: true
    })
  ]

  const location = 'augsburg'
  const languages = [
    new LanguageModel('en', 'English'),
    new LanguageModel('de', 'Deutsch'),
    new LanguageModel('ar', 'Arabic')
  ]
  const language = 'en'
  const id = '1235'

  test('should match snapshot and render EventList', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  setLanguageChangeUrls={() => {}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should match snapshot and render EventDetail', () => {
    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={() => {}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should match snapshot and render Spinner', () => {
    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={() => {}} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should dispatch once on mount with availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      eventsPage.mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should dispatch once on mount without availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const eventsPage = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    ).instance()

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(eventsPage.mapLanguageToUrl, languages, {})
  })

  test('should dispatch on prop update with availableLanguages', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={[]}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(1)

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(2)
    expect(mockSetLanguageChangeUrls).toBeCalledWith(
      wrapper.instance().mapLanguageToUrl, languages, events[1].availableLanguages
    )
  })

  test('should not dispatch on irrelevant prop update', () => {
    const mockSetLanguageChangeUrls = jest.fn()

    const wrapper = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={mockSetLanguageChangeUrls} />
    )

    const mockCalls = mockSetLanguageChangeUrls.mock.calls

    wrapper.setProps({events: events, ...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)

    wrapper.setProps({...wrapper.props})

    expect(mockSetLanguageChangeUrls.mock.calls).toHaveLength(mockCalls.length)
  })

  test('should mapLanguageToUrl correctly', () => {
    const mapLanguageToUrl = shallow(
      <EventsPage events={events}
                  location={location}
                  languages={languages}
                  language={language}
                  id={id}
                  setLanguageChangeUrls={() => {}} />
    ).instance().mapLanguageToUrl

    expect(mapLanguageToUrl(language)).toBe(`/${location}/${language}/events`)
    expect(mapLanguageToUrl(language, id)).toBe(`/${location}/${language}/events/${id}`)
  })

  describe('connect', () => {
    const eventsEndpoint = new EndpointBuilder('events')
      .withRouterToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(events)
      .build()

    const languagesEndpoint = new EndpointBuilder('languages')
      .withRouterToUrlMapper(() => 'https://weird-endpoint/api.json')
      .withMapper(json => json)
      .withResponseOverride(languages)
      .build()

    test('should map state and fetched data to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, id: id}, languageChangeUrls: {}}
      })

      const eventsPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[eventsEndpoint, languagesEndpoint]}>
            <ConnectedEventsPage />
          </EndpointProvider>
        </Provider>
      ).find(EventsPage)

      expect(eventsPage.props()).toEqual({
        location: location,
        language: language,
        id: id,
        setLanguageChangeUrls: expect.any(Function),
        events: events,
        languages: languages
      })
    })

    test('should map dispatch to props', () => {
      const store = createReduxStore(createHistory, {
        router: {params: {location: location, language: language, id: id}, languageChangeUrls: {}}
      })

      const mapLanguageToUrl = (language, id) => (id ? `/${language}/${id}` : `/${language}`)

      const languageChangeUrls = {
        en: '/en/1235',
        de: '/de',
        ar: '/ar/1236'
      }

      const availableLanguages = {
        en: '1235',
        ar: '1236'
      }

      expect(store.getState().languageChangeUrls).not.toEqual(languageChangeUrls)

      const eventsPage = mount(
        <Provider store={store}>
          <EndpointProvider endpoints={[eventsEndpoint, languagesEndpoint]}>
            <ConnectedEventsPage />
          </EndpointProvider>
        </Provider>
      ).find(EventsPage)

      eventsPage.props().setLanguageChangeUrls(mapLanguageToUrl, languages, availableLanguages)
      expect(store.getState().languageChangeUrls).toEqual(languageChangeUrls)
    })
  })

  moment.tz.setDefault()
})

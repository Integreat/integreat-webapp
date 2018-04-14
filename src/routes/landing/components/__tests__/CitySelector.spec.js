import React from 'react'
import { shallow } from 'enzyme'

import CityModel from 'modules/endpoint/models/CityModel'

import CitySelector from '../CitySelector'

describe('CitySelector', () => {
  const cities = [
    new CityModel({
      name: 'City',
      code: 'city',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Other city',
      code: 'otherCity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Not-live',
      code: 'nonlive',
      live: false,
      eventsEnabled: false,
      extrasEnabled: false
    }),
    new CityModel({
      name: 'Yet another city',
      code: 'yetanothercity',
      live: true,
      eventsEnabled: false,
      extrasEnabled: false
    })
  ]

  it('should render', () => {
    shallow(
      <CitySelector
        filterText='Text'
        language='de'
        cities={cities} />
    )
  })

  it('should filter for existing and live cities', () => {
    const wrapper = shallow(<CitySelector
      filterText='city'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()

    expect(component.filter()).toHaveLength(3)
  })

  it('should exclude location if location does not exist', () => {
    const wrapper = shallow(<CitySelector
      filterText='Does not exist'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(0)
  })

  it('should exclude location if location is not live', () => {
    const wrapper = shallow(<CitySelector
      filterText='notlive'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(0)
  })

  it('should filter for all non-live cities if filterText is "wirschaffendas"', () => {
    const wrapper = shallow(<CitySelector
      filterText='wirschaffendas'
      language='de'
      cities={cities} />
    )

    const component = wrapper.instance()
    expect(component.filter()).toHaveLength(1)
  })
})
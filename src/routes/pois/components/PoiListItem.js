// @flow

import * as React from 'react'
import ListItem from '../../../modules/common/components/ListItem'
import PoiModel from '../../../modules/endpoint/models/PoiModel'

type PropsType = {|
  poi: PoiModel
|}

class PoiListItem extends React.PureComponent<PropsType> {
  render () {
    const {poi} = this.props
    return (
      <ListItem key={poi.path}
                title={poi.title}
                path={poi.path}>
        <div>{poi.location.location}</div>
      </ListItem>
    )
  }
}

export default PoiListItem
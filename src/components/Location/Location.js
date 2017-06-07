import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash/lang'

import style from './Location.css'
import { transform } from 'lodash/object'

class LocationParentEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={style.languageListParent}>{this.props.name}</div>
    )
  }
}

class LocationEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    to: PropTypes.string
  }

  render () {
    return (
      <Link to={{pathname: this.props.to}} className={style.languageListItem}>
        <div>{this.props.name}</div>
      </Link>
    )
  }
}

class Location extends React.Component {
  static propTypes = {
    locations: PropTypes.object,
    filterText: PropTypes.string
  }

  renderList (locations, filterText) {
    return transform(locations, (result, locations, key) => {
      let filter = filterText.toLowerCase()
      locations = locations.filter((location) => location.name.toLowerCase().includes(filter))
      if (isEmpty(locations)) {
        return
      }

      result.push(<LocationParentEntry key={key} name={key}/>)

      result.push(locations.map((location, index) => <LocationEntry name={location.name}
                                                                    to={'/location' + location.path}
                                                                    key={key + index}/>))
    }, [])
  }

  render () {
    return (
      <div>
        <div className={style.languageList}>
          {
            isEmpty(this.props.locations) ? <Spinner className={style.loading} name='line-scale-party'/>
              : this.renderList(this.props.locations, this.props.filterText)
          }
        </div>
      </div>
    )
  }
}

export default Location
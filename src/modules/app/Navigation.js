class Navigation {
  constructor (location, language) {
    this._location = location
    this._language = language
  }

  get home () {
    if (!this._location) {
      return '/' + (this._language || '')
    }
    return `/${this._location}/${this._language}`
  }

  get locationSelector () {
    if (!this._language) {
      return '/'
    }
    return `/${this._language}`
  }

  get search () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/search`
  }

  get disclaimer () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/disclaimer`
  }

  get events () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/events`
  }

  get extras () {
    if (!this._language || !this._location) {
      return '/'
    }
    return `/${this._location}/${this._language}/extras`
  }
}

export default Navigation

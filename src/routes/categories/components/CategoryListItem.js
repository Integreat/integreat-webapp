// @flow

import React from 'react'
import { Link } from 'redux-little-router'

import style from './CategoryListItem.css'
import iconPlaceholder from '../assets/IconPlaceholder.svg'
import type { CategoryType } from '../../../modules/endpoint/models/CategoryModel'

type Props = {
  category: CategoryType,
  children: Array<CategoryType>
}

/**
 * Displays a single CategoryListItem
 */
class CategoryListItem extends React.Component<Props> {
  render () {
    const {category, children} = this.props
    return (
      <div className={style.row}>
        <Link href={category.url}>
          <img className={style.categoryThumbnail} src={category.thumbnail || iconPlaceholder} />
          <div className={style.categoryCaption}>{category.title}</div>
        </Link>
        {children.map(child =>
          <div key={child.id} className={style.subRow}>
            <Link href={child.url}>
              {
                child.thumbnail
                ? <img src={child.thumbnail} className={style.categoryThumbnail} />
                : <div className={style.categoryThumbnail} />
              }
              <div className={style.categoryCaption}>{child.title}</div>
            </Link>
          </div>
        )}
      </div>
    )
  }
}

export default CategoryListItem

import React from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Rating from '../Rating/Rating';
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'authorization': `bearer ${config.API_KEY}`,
    },
  })
  .then(res => {
    if(!res.ok) {
      throw new Error('There was a problem deleting the requested bookmark');
    }
    // Succeeded - callback to delete the bookmark id from state
    cb(bookmarkId)
  })
  .catch(error => {
    console.error(error)
  })
}

function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
        <li className='BookmarkItem'>
          <div className='BookmarkItem__row'>
            <h3 className='BookmarkItem__title'>
              <a
                href={props.url}
                target='_blank'
                rel='noopener noreferrer'>
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className='BookmarkItem__description'>
            {props.description}
          </p>
          <div className='BookmarkItem__buttons'>
            <button
              className='BookmarkItem__description'
              onClick={() => props.history.push(`/edit-bookmark/${props.id}`)}
            >
              Edit
            </button>
            <button
              className='BookmarkItem__description'
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark,)
              }}
            >
              Delete
            </button>
          </div>
        </li>
      )}
    </BookmarksContext.Consumer>
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
  onClickEdit: () => {},
  rating: 1,
  description: '',
};

BookmarkItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: (props, propName, componentName) => {
    // Get the value of the prop
    let prop = props[propName];
    // It's required
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation Failed`);
    }
    // Check the type - string
    if(typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }
    // Custom check using a simple regex
    if(prop.length < 5 || !prop.match(new RegExp(/^https?:\/\//))) {
      return new Error(`Invalid prop, ${propName} must be min length 5 and begin http(s)://. Validation Failed.`);
    }
  },
  rating: PropTypes.string,
  description: PropTypes.string,
};

export default withRouter(BookmarkItem);

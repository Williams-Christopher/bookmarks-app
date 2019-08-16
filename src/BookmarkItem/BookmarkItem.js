import React from 'react';
import Rating from '../Rating/Rating';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import PropTypes from 'prop-types';
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
  // .then(data => {
  //   console.log('BookmarkItem.deleteBookmarkRequest res.json success callback');
  //   // call the callback when the request is successful
  //   // this is where the App component can remove it from state

  // })
  .catch(error => {
    console.error(error)
  })
}

export default function BookmarkItem(props) {
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
              // onClick={() => props.onClickDelete(props.id)}
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
  rating: PropTypes.number,
  description: PropTypes.string,
};

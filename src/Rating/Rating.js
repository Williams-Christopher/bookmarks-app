import React from 'react';
import './Rating.css';
// import PropTypes from 'prop-types';

export default function Rating(props) {
  const stars = [0, 0, 0, 0, 0].map((_, i) =>
    (i < props.value)
      ? <span key={i}>&#9733; </span>
      : <span key={i}>&#9734; </span>
  );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}

Rating.defaultProps = {
  value: 1,
};

Rating.propTypes = {
  //value: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  value: (props, propName, componentName) => {
    // First get the value of the prop
    const prop = props[propName];
    // Since we want to make this required, let's check that first
    if(!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation failed.`);
    }
    // The prop has a value so let's check the type
    if(typeof prop != 'number') {
      return new Error(`Invalid prop: ${propName} is expected to be a number in ${componentName}. ${typeof prop} found.`);
    }
    // The prop is a number so let's check the range
    if(prop < 1 || prop > 5) {
      return new Error(`Invalid prop: ${propName} should be in the range 1 - 5 in ${componentName}. ${prop} found.`);
    }
  }
};

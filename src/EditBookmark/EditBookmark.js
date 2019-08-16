import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './EditBookmark.css';

const Required = () => (
    <span className='EditBookmark__required'>*</span>
)

class EditBookmark extends Component {
    static contextType = BookmarksContext;

    state = {
        id: null,
        title: '',
        url: '',
        description: '',
        rating: '',
        error: null,
    };

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/${this.props.match.params.bookmarkId}`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('The requested bookmark could not be found');
                }
                return res.json();
            })
            .then(bookmark => {
                this.setState({
                    ...bookmark,
                    error: null
                });
            })
            .catch(error =>
                this.setState({
                    error: error,
                })
            )
    }

    handleSubmit = e => {
        e.preventDefault()
        // get the form fields from the event
        const { title, url, description, rating } = e.target
        const bookmark = {
            id: this.state.id,
            title: title.value,
            url: url.value,
            description: description.value,
            rating: rating.value,
        }
        this.setState({ error: null })
        fetch(`${config.API_ENDPOINT}/${this.state.id}`, {
            method: 'PATCH',
            body: JSON.stringify(bookmark),
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${config.API_KEY}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('There was an error making the requested updates. Please wait a moment and try again.');
                }
                // return res.json()
                this.context.updateBookmark(bookmark)
                this.props.history.push('/')
            })
            .catch(error => {
                this.setState({ error })
            })
    }

    handleClickCancel = () => {
        this.props.history.push('/');
    };

    handleUpdateTitle = e => {
        this.setState({ title: e.target.value });
    }

    handleURLUpdate = e => {
        this.setState({ url: e.target.value });
    }

    handleDescriptionUpdate = e => {
        this.setState({ description: e.target.value });
    }

    handleRatingUpdate = e => {
        this.setState({ rating: e.target.value });
    }

    render() {
        const { error } = this.state
        return (
            <section className='EditBookmark'>
                <h2>Edit a bookmark</h2>
                <form
                    className='EditBookmark__form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='EditBookmark__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
              {' '}
                            <Required />
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value={this.state.title}
                            onChange={event => this.handleUpdateTitle(event)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            URL
              {' '}
                            <Required />
                        </label>
                        <input
                            type='url'
                            name='url'
                            id='url'
                            value={this.state.url}
                            onChange={event => this.handleURLUpdate(event)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
            </label>
                        <textarea
                            name='description'
                            id='description'
                            value={this.state.description}
                            onChange={event => this.handleDescriptionUpdate(event)}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
              {' '}
                            <Required />
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            value={this.state.rating}
                            onChange={event => this.handleRatingUpdate(event)}
                            min='1'
                            max='5'
                            required
                        />
                    </div>
                    <div className='EditBookmark__buttons'>
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
            </button>
                        {' '}
                        <button type='submit'>
                            Save
            </button>
                    </div>
                </form>
            </section>
        );
    }
}

export default EditBookmark;

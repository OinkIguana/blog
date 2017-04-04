'use strict';
import 'reset-css/_reset.scss';
import React from 'react';
import { render } from 'react-dom';

import BlogHeader from './header';
import BlogListings from './listings';
import BlogFooter from './footer';
import BlogArticle from './article';
import navigator from './navigator';
import './index.scss';

const initialState = navigator.get();
function popstate(event) {
  if(window.location.hash === '') {
    // hashes can manage themselves
    const { page, search, post: article } = event.state || initialState;
    this.setState({ page, search, article });
  }
}

class Blog extends React.Component {
  state = { article: null, page: 1, search: '' };
  popstate = popstate.bind(this);

  constructor(props) {
    super(props);
    const { post } = navigator.get();
    this.state.article = post;
  }

  openArticle(id) {
    this.setState({ article: id });
    navigator.go({ page: 1, search: '', post: id });
  }

  componentDidMount() {
    window.addEventListener('popstate', this.popstate);
    navigator.on('go', this.popstate);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.popstate);
  }

  render() {
    switch(this.state.article) {
      case null:
        return (
          <div className="page">
            <BlogHeader />
            <BlogListings page={ this.state.page } search={ this.state.search } onOpenArticle={id => this.openArticle(id)} />
            <BlogFooter />
          </div>
        )
      default:
        return (
          <div className="page">
            <BlogHeader />
            <BlogArticle article={ this.state.article } />
            <BlogFooter />
          </div>
        )
    }
  }
}

render(<Blog />, document.querySelector('#the-blog'));

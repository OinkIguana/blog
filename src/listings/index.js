'use strict';
import React from 'react';

import BlogSearch from '../search';
import BlogPage from '../page';
import BlogLoader from '../loader';
import Listing from './listing';
import request from '../request';
import promisify from '../promisify';
import './main.scss';

class BlogListings extends React.Component {
  state = { articles: null, page: this.props.page, search: this.props.search, more: false };
  setState = promisify(this.setState.bind(this));

  constructor(props) {
    super(props);
    this.updateListing();
  }

  async updatePage(page) {
    await this.setState({ page });
    await this.updateListing();
  }

  async updateSearch(search) {
    await this.setState({ search });
    await this.updateListing();
  }

  async updateListing() {
    const { articles: list, more } = await request('list', { page: this.state.page, search: this.state.search });
    await this.setState({
      articles: list.map((article, i) =>
        <Listing article={ article } highlight={ this.state.search === '' && this.state.page === 1 && i === 0 } onClick={id => this.props.onOpenArticle(id)} key={`article-${i}`}/>
      ),
      more
    });
  }

  render() {
    return (
      <main className="main">
        <BlogSearch query={ this.props.search } onSearch={query => this.updateSearch(query)} />
        <div className="main__listings">
          { this.state.articles || <BlogLoader /> }
        </div>
        <BlogPage page={ this.props.page } more={ this.state.more } onPaginate={page => this.updatePage(page)} />
      </main>
    )
  }
}

export default BlogListings;

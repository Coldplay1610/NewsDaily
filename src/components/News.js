import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
  static defaultProps={
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  static propTypes={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
    constructor(){
      super();
      this.state={
        articles: [],
        loading: false,
        page: 1
      }
    }
    async componentDidMount(){
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ec21359310a64240b83e8ca714aab242&page=1&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      let data=await fetch(url);
      let parsedData=await data.json();
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults
      });
    }
    handlePrevClick=async ()=>{
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ec21359310a64240b83e8ca714aab242&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      let data=await fetch(url);
      let parsedData=await data.json();

      this.setState({
        page: this.state.page-1,
        articles: parsedData.articles,
        loading: false
      })
    }
    handleNextClick=async ()=>{
      if(!(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)))
      {
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ec21359310a64240b83e8ca714aab242&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true});
      let data=await fetch(url);
      let parsedData=await data.json();
      // this.setState({loading:false});
      this.setState({
        page: this.state.page+1,
        articles: parsedData.articles,
        loading: false
      })
      }
      
    }
  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{margin: '35px 0px'}}>NewsDaily-Top Headlines!</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element)=>{
             return <div className="col-md-4" key={element.url}>
             <NewsItem  title={element.title} description={element.description} imageUrl={element.urlToImage?element.urlToImage:"https://images.moneycontrol.com/static-mcnews/2021/05/Sensex-770x433.jpg"} newsUrl={element.url}/>
             </div>
          })}
         
        </div>
        <div className="d-flex justify-content-between container">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>

        </div>
      </div>
    )
  }
}

export default News
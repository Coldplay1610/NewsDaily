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
  capitalize=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }
  
    constructor(props){
      super(props);
      this.state={
        articles: [],
        loading: false,
        page: 1
      }
      document.title= `${this.capitalize(this.props.category)}-NewsDaily`;
    }
    async updateNews(){
      this.props.setProgress(0);
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=6599fb3b73304135a8049c90ee3045b4&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      let data=await fetch(url);
      this.props.setProgress(30);
      let parsedData=await data.json();
      this.props.setProgress(60);

      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
      })
      this.props.setProgress(100);
    }
    async componentDidMount(){
      this.updateNews();
    }
    handlePrevClick=async ()=>{

      this.setState({
        page: this.state.page-1,
      })
      this.updateNews();
    }
    handleNextClick=async ()=>{
      this.setState({
        page: this.state.page+1,
      })
      this.updateNews();
      
    }
  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{margin: '35px 0px'}}>NewsDaily-Top {this.capitalize(this.props.category)} Headlines!</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element)=>{
             return <div className="col-md-4" key={element.url}>
             <NewsItem  title={element.title} description={element.description} imageUrl={element.urlToImage?element.urlToImage:"https://images.moneycontrol.com/static-mcnews/2021/05/Sensex-770x433.jpg"} newsUrl={element.url} author={element.author} date={element.publishedAt}/>
             </div>
          })}
         
        </div>
        <div className="d-flex justify-content-between container">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark my-3" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark my-3" onClick={this.handleNextClick}>Next &rarr;</button>

        </div>
      </div>
    )
  }
}

export default News
import React, { Component } from 'react';
import axios from 'axios';
import './create.css';
import Article from './article.component';

//Class that displays the list of articles
export default class ArticleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        const response = await axios.get('/articles/')
            .then(response => {
                this.setState({
                    articles: response.data
                    
                });
            })
            .catch(function (error) {
                console.log(error);
            })    
   
    }

    articlesList() {
        console.log(this.state.articles)
        return (
            <div className="article">
                        {this.state.articles.map((item, key) =>
                            <Article article={item} key={item._id} />
                        )}
            </div>
        )

    }

    render() {
        return (
            <div>
                {this.articlesList()}
            </div>
        )
    }
}
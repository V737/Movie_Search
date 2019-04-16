import React, { Component } from 'react';
import './App.css';
import MovieRow from './MovieRow.js'
import $ from 'jquery'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {genres: []}
    // console.log("This is my initializer")

    // const movies = [
    //   {id: 0, poster_src: "https://image.tmdb.org/t/p/w185/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    //    title: "Avengers: Infinity War", overview: "As the Avengers and their allies have continued to protect the world from threats too large"},
    //   {id: 1, poster_src: "https://image.tmdb.org/t/p/w185/cezWGskPY5x7GaglTTRN4Fugfb8.jpg",
    //    title: "	The Avengers", overview: "This is my second overview"},
    // ]

    // var movieRows = []
    // movies.forEach((movie) => {
    //   console.log(movie.title)
    //   const movieRow = <MovieRow movie={movie} />
    //   movieRows.push(movieRow)
    // })

    // this.state = {rows: movieRows}

    this.performSearch("")
  }

  componentDidMount() {
    $.ajax({
      url: "https://api.themoviedb.org/3/genre/movie/list?api_key=1b5adf76a72a13bad99b8fc0c68cb085",
      success: ({genres}) => {
        this.setState({genres: genres})
      },
      error: (xhr, status, err) => {
        console.error("Failed to fetch data")
      }
    })
  }

  performSearch(pageNumber = 1) {
    const {searchTerm, selectedGenre, selectedYear} = this.state;
    console.log("Perform search using moviedb")
    let urlString = "https://api.themoviedb.org/3/search/movie?api_key=1b5adf76a72a13bad99b8fc0c68cb085"
    if (selectedYear) {
      urlString += ("&year=" + selectedYear);
    }
    urlString += "&page=" + pageNumber +  "&query=" + searchTerm;
    console.log(urlString)
    this.setState({searching: true, rows: []})
    $.ajax({
      url: urlString,
      success: (searchResults) => {
        console.log("Fetched data successfully")
        // console.log(searchResults)
        const results = searchResults.results
        // console.log(results[0])

        var movieRows = []

        results.forEach((movie) => {
          if (movieRows.length >= 10) return;
          if (selectedGenre && !movie.genre_ids.includes(selectedGenre)) return;
          movie.poster_src = "https://image.tmdb.org/t/p/w185" + movie.poster_path
          // console.log(movie.poster_path)
          const movieRow = <MovieRow key={movie.id} movie={movie}/>
          movieRows.push(movieRow)
        })
        if (movieRows.length < 10 && searchResults.page < searchResults.total_pages ) {
          this.performSearch(searchResults.page + 1);
          return;
        }
        this.setState({searching: false ,rows: movieRows})
      },
      error: (xhr, status, err) => {
        console.error("Failed to fetch data")
      }
    })
  }

  searchChangeHandler(event) {
    console.log(event.target.value)
    this.setState({searchTerm: event.target.value}, this.performSearch);
  }

  handleGenreChange(event) {
    this.setState({selectedGenre: parseInt(event.target.value)}, this.performSearch);
  }

  handleYearChange(event) {
    if (parseInt(event.target.value) < 1900) return;
    this.setState({selectedYear: event.target.value}, this.performSearch)
  }

  render() {
    return (
      <div>

        <table className="titleBar">
          <tbody>
            <tr>
              <td>
                <img alt="app icon" width="50" src="qvsta-logo.jpg"/>
              </td>
              <td width="8"/>
              <td>
                <h1>MoviesDB Search</h1>
              </td>
            </tr>
          </tbody>
        </table>

        <input style={{
          fontSize: 24,
          display: 'block',
          width: "99%",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 16
        }} onChange={this.searchChangeHandler.bind(this)} placeholder="Enter search term"/>
        <select onChange={this.handleGenreChange.bind(this)}>
          {this.state.genres.map((genre) => <option value={genre.id}>{genre.name}</option>)}
        </select>
        <input placeholder="Year Filter" onChange={this.handleYearChange.bind(this)} className="year-filter" type="number" min={1900} max={new Date().getFullYear()}/>
        {this.state.searching && <span >Searching</span>}
        <div>
        {!this.state.searching && (this.state.rows && this.state.rows.length > 0 ? this.state.rows : <span> No results found</span>)}
        </div>
      </div>
    );
  }
}

export default App;

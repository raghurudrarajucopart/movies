import React, { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
 } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Rating from '@material-ui/lab/Rating';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import MovieItem from './movieItem'
import moviesJSON from './movies.json'
import './index.css'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const newMovie = {
  "Title": "",
  "US_Gross": null,
  "Worldwide_Gross": null,
  "US_DVD_Sales": null,
  "Production_Budget": null,
  "Release_Date": null,
  "MPAA_Rating": "",
  "Running_Time_min": null,
  "Distributor": "",
  "Source": null,
  "Major_Genre": null,
  "Creative_Type": null,
  "Director": null,
  "Rotten_Tomatoes_Rating": null,
  "IMDB_Rating": null,
  "IMDB_Votes": null
}

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const [newTitle, setNewTitle] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [showError, setShowError] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showAddMoviesDialog, setShowAddMoviesDialog] = useState(false)
  const [newMovieObject, setNewMovieObject] = useState({})
  const [showTitleError, setShowTitleError] = useState(false)

  useEffect(() => {
    setMovieList(moviesJSON)
    setSearchResults(moviesJSON)
    setNewMovieObject(newMovie)
  }, [])

  const showEdit = (index) => {
    setSelectedIndex(index)
    setNewTitle(searchResults[index].Title)
  }

  const editMovie = (index, data) => {
    setNewTitle(data)
    isValidTitle(index, data)
  }

  const updateMovieObject = (index, data, field) => {
      if(field === 'Title') {
        setShowTitleError(isValidTitle(index, data))
        setNewMovieObject({...newMovieObject, [field]: data})
      } else {
        setNewMovieObject({...newMovieObject, [field]: data})
      }
    }

  const saveNewMoviesData = () => {
    if(searchText.length && searchResults.length){
      searchResults.unshift(newMovieObject)
      setSearchResults(searchResults)
    }
    movieList.unshift(newMovieObject)
    setMovieList(movieList)
    setNewMovieObject(newMovie)
    setShowAddMoviesDialog(false)
    setShowTitleError(false)
  }

  const addMovie = (index, data, field) => {
    setNewTitle(data)
    isValidTitle(index, data)
  }

  const updateMovie = (index) => {
    if(showError) return true
    let updatedMovie = searchResults[index]
    updatedMovie.Title = newTitle
    searchResults.splice(index, 1, updatedMovie)
    setSearchResults([...searchResults])
    setSelectedIndex(null)
    setNewTitle('')
  }

  const deleteMovie = (index) => {
    setSearchResults([...searchResults.filter((d,i) => i !== index)])
    setSelectedIndex(null)
    setNewTitle('')
  }

  const isValidTitle = (index, data) => {
    const duplicateTitle = searchResults.filter((d,i)=> data && d.Title && d.Title.toString().toLowerCase() === data.toString().toLowerCase() && i !== index)
    if (duplicateTitle.length) {
      setShowError(true)
      return true
    } else {
      setShowError(false)
      return false
    }
  }

  const searchMovies = () => {
    console.log('searchText, movieList.length, searchResults.length: ', searchText, movieList.length, searchResults.length)
    setSearchResults([...movieList.filter((d, i) => d.Title && d.Title.toString().toLowerCase().includes(searchText.toLowerCase()))])
  }

  const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const getFormattedDate = (date) => {
    let current_datetime = new Date(date)
    let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
  }

  const isSaveButtonDisabled = newMovieObject.Title && !showTitleError && newMovieObject.Release_Date && newMovieObject.IMDB_Votes && newMovieObject.IMDB_Rating && newMovieObject.US_Gross && newMovieObject.Worldwide_Gross && newMovieObject.Production_Budget && newMovieObject.Major_Genre
  const isSaveButtonEnabled = newMovieObject.Title && !showTitleError && newMovieObject.Release_Date && newMovieObject.IMDB_Votes && newMovieObject.IMDB_Rating && newMovieObject.US_Gross && newMovieObject.Worldwide_Gross && newMovieObject.Production_Budget && newMovieObject.Major_Genre
  console.log('isSaveButtonDisabled, showTitleError: ', isSaveButtonDisabled, showTitleError)
  const classes = useStyles();
  const movieViews = searchResults.filter((d, i) => i < 10).map(
    (movie, index) => <MovieItem
                        key={movie.Title}
                        movie={movie}
                        index={index}
                        newTitle={newTitle}
                        showEdit={showEdit}
                        editMovie={editMovie}
                        updateMovie={updateMovie}
                        deleteMovie={deleteMovie}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        showError={showError}
                      />
  );

  return (
    <>
    <div className="container">
      <h1>List of movies</h1>
      <div className="actions">
        <div className="searchContainer">
          <TextField id="standard-basic" onChange={(e, i) => setSearchText(e.target.value)} label="Search" />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}>
            <SearchOutlinedIcon onClick={(e,i) => searchMovies()} />
          </Button>
        </div>
        <div className="addContainer">
          <Tooltip title="Add new movie" arrow>
            <AddOutlinedIcon style={{cursor: "pointer"}} onClick={(e, i) => setShowAddMoviesDialog(true)} />
          </Tooltip>
        </div>
      </div>
      {movieViews}
    </div>
    <Dialog className="addDialog" open={showAddMoviesDialog} onClose={() => setShowAddMoviesDialog(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Movies <span className="addDialogNotice">(Please fill all the fields)</span></DialogTitle>
        <DialogContent>
          <div className="field">
            <span className="label">Title: </span>
            <span className="value">
              <TextField
                required
                autoFocus
                error ={showTitleError  ? true : false }
                id={showTitleError ? "standard-error-helper-text": "showTitleError"}
                defaultValue={newMovieObject.Title}
                onChange={e => updateMovieObject(-1, e.target.value, "Title")}
                helperText={showTitleError ? "Title should be unique" : ''}
                />
            </span>
          </div>
          <div className="field">
            <span className="label">Release Date: </span>
            <span className="value">
              <TextField
                required
                id="date"
                label=""
                type="date"
                value= { getFormattedDate(newMovieObject.Release_Date) }
                onChange={e => updateMovieObject(-1, e.target.value, "Release_Date")}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </span>
          </div>
          <div className="field">
            <span className="label">IMDB Rating: </span>
            <span className="value">
              <Rating name="customized-10" onClick={(e,i) => updateMovieObject(-1, e.target.value, "IMDB_Rating")} precision={0.1} value={newMovieObject.IMDB_Rating} max={10} />
            </span>
          </div>
          <div className="field">
            <span className="label">IMDB Votes: </span>
            <span className="value">
              <TextField
                required
                margin="dense"
                id="IMDB Votes"
                label=""
                value={newMovieObject.IMDB_Votes}
                onChange={e => updateMovieObject(-1, e.target.value, "IMDB_Votes")}
                type="number"
                fullWidth
              />
            </span>
          </div>
          <div className="field">
            <span className="label">US Gross: </span>
            <span className="value">
              <TextField
                required
                margin="dense"
                id="US Gross"
                label=""
                defaultValue={newMovieObject.US_Gross}
                onChange={e => updateMovieObject(-1, e.target.value, "US_Gross")}
                type="number"
                fullWidth
              />
            </span>
          </div>
          <div className="field content">
            <span className="label">Worldwide Gross: </span>
            <span className="value">
              <TextField
                required
                margin="dense"
                id="Worldwide Gross"
                label=""
                defaultValue={newMovieObject.Worldwide_Gross}
                onChange={e => updateMovieObject(-1, e.target.value, "Worldwide_Gross")}
                type="number"
                fullWidth
              />
            </span>
          </div>
          <div className="field">
            <span className="label">Production Budget: </span>
            <span className="value">
              <TextField
                required
                margin="dense"
                id="Production Budget"
                label=""
                defaultValue={newMovieObject.Production_Budget}
                onChange={e => updateMovieObject(-1, e.target.value, "Production_Budget")}
                type="number"
                fullWidth
              />
            </span>
          </div>
          <div className="field content">
            <span className="label">Major Genre: </span>
            <span className="value">
              <Select
                value={newMovieObject.Major_Genre}
                onChange={(e,i) => updateMovieObject(-1, e.target.value, "Major_Genre")}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="">
                  <em>N/A</em>
                </MenuItem>
                <MenuItem value="Drama">Action</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Musical">Musical</MenuItem>
                <MenuItem value="Thriller/Suspense">Thriller/Suspense</MenuItem>
                <MenuItem value="Adventure">Adventure</MenuItem>
                <MenuItem value="Romantic Comedy">Romantic Comedy</MenuItem>
                <MenuItem value="Western">Western</MenuItem>
                <MenuItem value="Horror">Horror</MenuItem>
              </Select>
            </span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMoviesDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => isSaveButtonEnabled && saveNewMoviesData()} disabled={!isSaveButtonEnabled} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MovieList

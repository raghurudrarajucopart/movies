import React from 'react'
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Rating from '@material-ui/lab/Rating';
import './index.css'

const MovieItem = ({
  movie,
  index,
  newTitle,
  showEdit,
  editMovie,
  updateMovie,
  deleteMovie,
  selectedIndex,
  setSelectedIndex,
  showError,
}) => {
  const {
    Title,
    Release_Date,
    IMDB_Rating,
    IMDB_Votes,
    US_Gross,
    Worldwide_Gross,
    Production_Budget,
    Major_Genre,
  } = movie;

  return(
    <div className="movie">
      <div className="field">
        <span className="label">Title: </span>
        <div className="value">
          { selectedIndex !== index ? Title :
            (<TextField
                error ={showError  ? true : false }
                id={showError ? "standard-error-helper-text": index.toString()}
                defaultValue={newTitle}
                onChange={e => editMovie(index, e.target.value)}
                helperText={showError ? "Title should be unique" : ''}
                />)
          }
          <div className="movieActions">
            { selectedIndex !== index ? (<div onClick={() => showEdit(index)}>
              <Tooltip title="Edit" arrow>
                <EditOutlinedIcon />
              </Tooltip>
            </div>) :
            (<div disabled={showError} onClick={() => updateMovie(index)} >
              <Tooltip title="Save" arrow>
                <SaveOutlinedIcon disabled={showError} />
              </Tooltip>
            </div>) }
            <div onClick={() => deleteMovie(index)}>
              <Tooltip title="Add" arrow>
                <DeleteOutlinedIcon />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="field">
        <span className="label">Release Date: </span>
        <span className="value">{Release_Date}</span>
      </div>
      <div className="field">
        <span className="label">IMDB Rating: </span>
        <span className="value">
          { IMDB_Rating ? (<Rating name="read-only" value={IMDB_Rating} max={10} precision={0.1} readOnly />) : "N/A" }
        </span>
      </div>
      <div className="field">
        <span className="label">IMDB Votes: </span>
        <span className="value">{IMDB_Votes || "N/A"}</span>
      </div>
      <div className="field">
        <span className="label">US Gross: </span>
        <span className="value">{US_Gross}</span>
      </div>
      <div className="field content">
        <span className="label">Worldwide Gross: </span>
        <span className="value">{Worldwide_Gross}</span>
      </div>
      <div className="field">
        <span className="label">Production Budget: </span>
        <span className="value">{Production_Budget}</span>
      </div>
      <div className="field content">
        <span className="label">Major Genre: </span>
        <span className="value">{Major_Genre || 'N/A'}</span>
      </div>
    </div>
  );
};

export default MovieItem

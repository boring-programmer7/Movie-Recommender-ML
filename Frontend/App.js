import './App.css';
import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Movie from './Movie';
import { Paper, Typography } from '@material-ui/core';
import director from './assets/director.svg'
import camara from './assets/camara-de-video.svg'
import {isMobile} from 'react-device-detect';
import SocialMedia from './SocialMedia'



function App() {
  const initNames = [
    'Toy Story', 'Up', "A Bug's Life",
    'Monsters, Inc.', 'Mulan','WALL·E']
  const random = initNames[Math.floor(Math.random() * initNames.length)]
  const [search, setSearch] = useState(random)
  const [movie, setMovie] = useState(random)
  const [options,setOptions]=useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [recommendations, setRecommendations] = useState()
  

  useEffect(() => {
    const abortController = new AbortController();
     //Get NameSimilarity
    const fetchNames = async () => {
      setLoading(true)
      const API_URL = `/s/${search}`
      try {
        const res = await fetch(API_URL,{ signal: abortController.signal })
        const data = await res.json()
        setOptions(data)
        setLoading(false)
        return data
      } catch (e) {
        return
      }
     
    }

    if (search) {
      fetchNames()
    }
    else {
      setLoading(false)
    }
    
    return () => {
      abortController.abort()
    }
  },[search])



  useEffect(() => {
    const abortController2 = new AbortController();
    //Get Recommendations
    const fetchRecommendations = async () => {

      setLoading2(true)
      const API_URL = `/r/${movie}`
      try {
        const res = await fetch(API_URL,{ signal: abortController2.signal })
        const data = await res.json()
        setRecommendations(data)
        setLoading2(false)
        return data
      } catch (e) {
        return
      }
    }

    if (movie) {
      fetchRecommendations()
    }
    else {
      setLoading2(false)
    }
    return () => {
      abortController2.abort()
    }
  },[movie])



 

  

  return (
    <div className="app">
      <SocialMedia />
      <div className="title">
       <img
          style={{
            width: isMobile ? '40px' : '50px',
            height: isMobile ? '40px' : '50px',
            marginRight:'10px'
          }}
          src={camara} alt="logo" ></img>
<Typography
        style={{paddingTop:'20px'}}
        gutterBottom
        variant={isMobile?'h6':"h4"}
        component="h2"
        align="center">
          Movies4You
      </Typography>
        
      </div>
      
      <div className="select_container">
        <Autocomplete
          onChange={(event, value) => setMovie(value?.title)} // prints the selected value
          onInputChange={(e)=>{setSearch(e.target.value)}}
          options={options}
          loading={loading}
          getOptionLabel={(option) => `${option.title}. ${option.Director}. (${option.production_companies2.split(",")[0]})`}
          getOptionSelected={(option)=>option.title}
      style={{ width: "100%",alignContent:'center' }}
          renderInput={(params) => 
       <TextField
          {...params}
          label="Choose a movie that you love"
              variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      
      
          }
    />
      </div>
      
      {!loading2 ? (
        <>
          { recommendations && (
            <> 
              <div className="movie_choosed">
                <Movie
                title={recommendations[0].title}
                pathUrl={recommendations[0].posterUrl}
                company={recommendations[0].production_companies2.split(",")[0]}
                overview={recommendations[0].overview}
                date={recommendations[0].release_date}
                director={recommendations[0].Director}
                key={recommendations[0].id}
                />
                <Paper className="title_container">
                  <img src={director} alt="director" className="director_image "></img>

                  <Typography
                    gutterBottom
                    variant="body1"
                    color="textSecondary"
                    align="center"
                    >
                    If you liked {movie}, I recommend these movies
                </Typography>
                </Paper>
              
            </div>
            
             
          <div className="movies_container">
            {recommendations.slice(1).map(rec => (
              <Movie
                title={rec.title}
                pathUrl={rec.posterUrl}
                company={rec.production_companies2.split(",")[0]}
                overview={rec.overview}
                date={rec.release_date}
                director={rec.Director}
                key={rec.id}
              />
          ))}
          </div>
            </>
          
        )}
        
        
        </>
        
      
       
       
      ) : (
          <CircularProgress/>
      )}
      

      <div style={{textAlign:'center',fontSize:'12px','margin':'10px'}}>
        Iconos diseñados por <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
    </div>
  );
}

export default App;

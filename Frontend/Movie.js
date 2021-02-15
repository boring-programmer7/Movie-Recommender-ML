import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import {isMobile} from 'react-device-detect';



const useStyles = makeStyles({
  root: {
        
        display: 'flex',
        flexDirection: isMobile?'column': 'row',
        marginBottom: '20px',
        maxWidth: isMobile?'100%':'700px',
        maxHeight:isMobile?null:350
  },
  media: {
      height: isMobile?300:350,
      width: isMobile?'100%':350,
      objectFit: 'cover',
      paddingBottom: isMobile ? '20px' : 0,
    },
    data: {
        padding:'20px',
        marginLeft:isMobile?0: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'space-between' : 'space-around',
        minHeight:isMobile?'250px':null
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignContent:'center'
    }
});

function Movie({ title, pathUrl, overview, company, date,director }) {
    const classes = useStyles();

    return (
        <Paper elevation={3} className={classes.root}> 
            <div className={classes.imageContainer}>
                <img src={pathUrl} alt={title} className={classes.media} />     
            </div>
            
            <div className={classes.data}>
                <Typography
                    gutterBottom
                    variant="h4"
                    component="h2"
                    align="center">
                    {title} ({new Date(date).getFullYear()})
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    
                    align="justify">
            {overview.length>400?`${overview.slice(0,400)}...`:overview}
                </Typography>
                <Typography
                    color="textPrimary"
                    variant="caption"
                    display="block"
                    align="center"
                    gutterBottom>
        {company}. {director}.
      </Typography>
            </div>
           
        </Paper>
    )
}

export default Movie

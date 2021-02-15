import React,{useState} from 'react'
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 20,
        position: 'absolute',
        bottom: 5,
        right:5
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        color: '#39A0ED',
        marginBottom: '5px',
        justifyContent:'center',
    }
})


function SocialMedia() {
    const classes = useStyles()
    const [open,setOpen]=useState(true)
    return (
        <Paper className={classes.root} style={{display:open?'':'none'}}>
            <IconButton
                
                onClick={()=>{setOpen(false)}}
            >
               <CloseIcon fontSize='small'/>
        </IconButton>



            <a
                className={classes.tag}
                href="https://github.com/boring-programmer7">
                Get the Code and Follow me in GitHub
             <GitHubIcon style={{marginLeft:'10px'}}/>
            </a>
            
            <a
                className={classes.tag}
                href="https://www.linkedin.com/in/andr%C3%A9s-felipe-acevedo-rodr%C3%ADguez-5a2453158/"> 
                If you like my work contact me in LinkedIn
                <LinkedInIcon style={{marginLeft:'10px'}}/> 
                 
             </a>
        </Paper>
       
            
             
       
    )
}

export default SocialMedia

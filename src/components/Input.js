import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Table, TableBody, TableCell, TableContainer, Paper, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';
import ReactCountryFlag from "react-country-flag"

function Input() {

  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearch, setRecentSearch] = useState([])

  const handleInput = (e) => {
    setName(e.target.value)
  }

  const handleSubmit = () => {
    setLoading(true)
    Promise.all([
      fetch(`https://api.genderize.io/?name=${name}`).then(value => value.json()),
      fetch(`https://api.agify.io/?name=${name}`).then(value => value.json()),
      fetch(`https://api.nationalize.io?name=${name}`).then(value => value.json())
      ])
      .then((value) => {
        recentSearch.length < 5 ? recentSearch.push(name) : recentSearch.splice(0, 1) && recentSearch.push(name)
        setData(value)
        setLoading(false)
      })
      .catch((err) => {
          console.log(err);
      });
  }

  return (
    <div>
      <Box display='flex' alignItem='center' justifyContent='center'>
        <TextField variant='outlined' label="Enter your Name" value={name} onChange={handleInput} style={{ marginRight: 10 }} />
        <Button onClick={handleSubmit} variant='contained' color='primary'>Submit</Button>
      </Box>
      <Box className='recentSearchContainer'>
      {
        recentSearch.length > 0 &&
        <>
          <Typography variant="h6">Your Recent Search</Typography>
          {
            recentSearch.map((item, i) => {
            return (
              <Typography variant="body2" key={i}>{item}</Typography>
            )
          })
          }
        </>
      }
      </Box>
      <Grid container alignItems='center' style={{ justifyContent: 'center', marginTop: 30 }}>
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Name</b></TableCell>
                  <TableCell align="center"><b>Age</b></TableCell>
                  <TableCell align="center"><b>Gender</b></TableCell>
                  <TableCell align="center"><b>Nationality</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {
                    loading ? <TableCell align='center'> <CircularProgress /> </TableCell> : (
                      <>
                      <TableCell align="center">{data.length > 1 && name}</TableCell>
                      <TableCell align="center">{data.length > 1 && data[1].age}</TableCell>
                      <TableCell align="center">{data.length > 1 && data[0].gender}</TableCell>
                      <TableCell align="center"> 
                        {
                          data.length > 1 && data[2].country.map((value, i) => <ReactCountryFlag key={i} countryCode={value.country_id} svg style={{width: '2em', height: '2em', marginRight: 10 }} title={value.country_id} />) 
                        } 
                      </TableCell>
                      </>
                    )
                  }
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  )
}

export default Input
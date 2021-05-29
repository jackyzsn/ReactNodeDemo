import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { Container, Grid, Box } from '@material-ui/core';

export default function SignIn() {
  const [info, setInfo] = useState('');
  const [rapportVersion, setRapportVersion] = useState('');

  const addScriptToHead = (scriptSrc, scriptId) => {
    if (document.getElementById(scriptId)) {
      document.getElementById(scriptId).src = scriptSrc;
    } else {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc;
      script.async = true;
      script.id = scriptId;
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    window.callback = function (resp) {
      setRapportVersion(resp.v4a.rapport_version);
      setInfo(JSON.stringify(resp));
    };

    addScriptToHead('https://www.splash-screen.net/18273/rapi.js?f=callback', []);
  }, []);

  return (
    <Container component="main" maxWidth="lg">
      <Grid container>
        <Grid item xs={12}>
          <Typography component="body1" variant="p">
            {info}
          </Typography>
        </Grid>

        <Grid item xs>
          <Box mt={5}>
            <Typography component="body1" variant="p">
              Rapport Version: {rapportVersion}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

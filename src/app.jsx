import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


class App extends Component{

	render() {
		return (
			<Fragment>
				<Paper 
					elevation={3}
					style={{
						padding: 10,
						width: "100%",
						maxWidth: 600,
						margin: "auto",
						marginTop: 100
					}}
				>
					<TextField variant="outlined" fullWidth label="E-mail Address"/>
				</Paper>
			</Fragment>
		);
	}
}


ReactDom.render(
	<App />,
	document.getElementById('app')
);
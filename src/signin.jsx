import React, { Fragment, Component } from 'react';
import ReactDom from 'react-dom';

/* Socket */
// import io from 'socket.io-client';
import config from '../config.json';

/* Material components */
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

/* Icons */
import FacebookIcon from '@material-ui/icons/Facebook';
import CloseIcon from '@material-ui/icons/Close';

/* MUI Styles */
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import MUITheme from './theme.jsx';

import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

/* Application theme */
const theme = createMuiTheme(MUITheme);

/* Component styles */
const styles = theme => ({
	body: {
		marginTop: 160,
		margin: '0 auto',
		maxWidth: 800,
	},
	body_paper: {
		padding: 15,
	},
	title: {
		margin: 10,
	},
	margin: {
		margin: 10,
	},
	marginTop: {
		marginTop: 10,
	},
	padding: {
		padding: 10,
	},
	form: {
		margin: '10px auto',
		maxWidth: 600
	},
	subtitle: {
		margin: 10,
		color: 'gray'
	},
	AuthButtons: {
		width: '100%',
	}
});

class SignIn extends Component {

	state = {
		keep_logged: false,
		email: null,
		password: null,
		disabled: false,
		error_message: null,
	};

	componentDidMount() {

	}

	/* Checkbox Keep me logged */
	onChange_Keep_Logged = (e) => {
		this.setState({ keep_logged: !this.state.keep_logged });
	};

	onChange_email = e => {
		this.setState({ email: e.target.value });
	};
	onChange_password = e => {
		this.setState({ password: e.target.value });
	};

	/* Submit form */
	onSubmit_login_form = e => {
		e.preventDefault();

		this.setState({ disabled: true }); // Disabling form
		this.setState({ error_message: null }); // Remove message of exists

		const form = new FormData();
		form.append('email', this.state.email);
		form.append('password', this.state.password);

		fetch(`${config.ajax.url}/api/authentication`, {
			method: 'post',
			body: form,
		}).then(res => res.json()).then(data => {

			if(data.status == 'auth_failed') {
				const message = data.message;
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			} else if(data.status == 'ok') {
				/* Authentication success */
				localStorage.setItem('_mkssid', data.token);
				window.location.href = '/';
			} else {
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			}
		}).catch(error => {
			this.setState({ error_message: `Failed to send request` });
			this.setState({ disabled: false });
		});
	};

	/* Google login */
	handle_google_login = e => {
		const form = new FormData();
		form.append('data', JSON.stringify(e.profileObj));

		fetch(`${config.ajax.url}/api/authentication/external-api`, {
			method: 'post',
			body: form,
		}).then(res => res.json()).then(data => {
			if(data.status == 'auth_failed') {
				const message = data.message;
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			} else if(data.status == 'ok') {
				/* Authentication success */
				localStorage.setItem('_mkssid', data.token);
				window.location.href = '/';
			} else {
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			}
		}).catch(error => {
			this.setState({ error_message: `Failed to send request` });
			this.setState({ disabled: false });
		});
	};
	handle_google_login_failed = e => {
		console.log(e);
	};

	/* Facebook login */
	handle_facebook_login = e => {
		const form = new FormData();
		form.append('data', JSON.stringify(e.profileObj));

		fetch(`${config.ajax.url}/api/authentication/external-api`, {
			method: 'post',
			body: form,
		}).then(res => res.json()).then(data => {
			if(data.status == 'auth_failed') {
				const message = data.message;
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			} else if(data.status == 'ok') {
				/* Authentication success */
				localStorage.setItem('_mkssid', data.token);
				window.location.href = '/';
			} else {
				this.setState({ error_message: message });
				this.setState({ disabled: false });
			}
		}).catch(error => {
			this.setState({ error_message: `Failed to send request` });
			this.setState({ disabled: false });
		});
	};


	render() {

		const { classes } = this.props;

		return (
			<Fragment>
				<ThemeProvider theme={theme}>
					<AppBar position="fixed">
						<Toolbar>
							<Typography variant="h5">
								ZNBOX
							</Typography>
						</Toolbar>
					</AppBar>

					<div className={ classes.body }>
						{(this.state.disabled) ? <LinearProgress color="secondary" /> : ""}
						<Paper elevation={3} className={ classes.body_paper }>
							<Grid
							  container
							  direction="column"
							  justify="center"
							  alignItems="center"
							>
								<Typography color="primary" variant="h4" className={ classes.title }>
									Authentication
								</Typography>
								<Typography variant="subtitle1" className={ classes.subtitle }>
									Sign In to your account
								</Typography>
								<div className={ classes.AuthButtons }>
									<Grid
									  container
									  direction="row"
									  justify="center"
									  alignItems="center"
									  style={{
									  	marginTop: 10,
									  }}
									>
										<GoogleLogin
											clientId="638947639746-vrumdclf9aepac714j7d5q8qn5s1ekkq.apps.googleusercontent.com"
										    buttonText="Sign in with Google"
										    onSuccess={this.handle_google_login}
										    onFailure={this.handle_google_login_failed}
										    cookiePolicy={'single_host_origin'}
										    render={renderProps => (
										    	<Button
													type="button" 
													color="primary"
													variant="outlined"
													className={ classes.margin }
													startIcon={
														<SvgIcon
															fontSize="small"
															style={{
																width: 16,
																height: 16
															}}
														>
															<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
														</SvgIcon>
													}
													onClick={renderProps.onClick}
													disabled={renderProps.disabled}
												>
													Sign in with Google
												</Button>
										    )}
									    />
										<FacebookLogin
											appId="260979678274316"
											callback={this.handle_facebook_login}
											fields="name,email,picture"
											scope="public_profile"
											render={renderProps => (
												<Button
													type="button" 
													color="primary"
													variant="outlined"
													className={ classes.margin }
													startIcon={
														<FacebookIcon
															style={{
																color: '#001b93'
															}}
														/>
													}
													onClick={renderProps.onClick}
													disabled={renderProps.isDisabled}
												>
													Sign in with Facebook
												</Button>
											)}
										/>
									</Grid>
								</div>
							</Grid>
							<form
								className={ classes.form }
								autoComplete="off"
								required
								onSubmit={ e => {this.onSubmit_login_form(e)}}
							>
								{(this.state.error_message) ? (
									<Grid
									  	container
									  	direction="column"
									  	justify="center"
									  	alignItems="center"
									  	style={{
											maxWidth: 600,
											maxHeight: 60,
											borderStyle: 'solid',
											borderColor: '#ff0000b8',
											borderRadius: 4,
											backgroundColor: '#ff00001c',
											borderWidth: 'thin',

										}}
									>
										<Typography
											variant="caption"
											align="center"
											style={{
												width: '100%',
												padding: 15,
											}}
										>
											{this.state.error_message}
										</Typography>
									</Grid>
								): ''}
								<Divider className={ classes.margin } />
								<Grid
								  container
								  direction="column"
								  justify="center"
								  alignItems="center"
								>
									<TextField
										label="E-mail Address"
										variant="outlined"
										name="email"
										placeholder="E-mail Address"
										fullWidth
										margin="normal"
										size="medium"
										type="email"
										required
										onChange={e => {this.onChange_email(e)}}
										disabled={this.state.disabled}
									/>
									<TextField
										label="Password"
										variant="outlined"
										name="password"
										placeholder="Password"
										fullWidth
										margin="normal"
										size="medium"
										type="password"
										required
										onChange={e => {this.onChange_password(e)}}
										disabled={this.state.disabled}
									/>
									<Grid
									  container
									  direction="row"
									  justify="flex-start"
									  alignItems="center"
									  style={{
									  	marginTop: 10,
									  }}
									>
										<FormControlLabel 
											control={
												<Checkbox
													checked={ this.state.keep_logged }
													onChange={ e => { this.onChange_Keep_Logged(e) }}
													disabled={this.state.disabled}
												/>
											}
										/>
										<Typography variant="caption" className={ classes.subtitle }>
											Keep me logged in
										</Typography>
									</Grid>
									<Grid
									  container
									  direction="column"
									  justify="center"
									  alignItems="center"
									  className={ classes.AuthButtons }
									>
										<Button 
											type="submit" 
											color="primary" 
											variant="contained"
											fullWidth
											className={ classes.marginTop }
											disabled={this.state.disabled}
										>
											Sign In
										</Button>
										<Grid
										  container
										  direction="row"
										  justify="center"
										  alignItems="center"
										  style={{
										  	marginTop: 20,
										  }}
										>
											<Grid item xs={5}>
												<Divider />
											</Grid>
											<Grid item xs={2} align="center">
												<Typography 
													variant="caption"
													className={ classes.subtitle }
												>
													OR
												</Typography>
											</Grid>
											<Grid item xs={5}>
												<Divider />
											</Grid>
										</Grid>
										<Button 
											href="/signup"
											type="button" 
											color="primary" 
											variant="outlined"
											fullWidth
											className={ classes.marginTop }
											onClick={ e => { history.replace('signup') }}
											disabled={this.state.disabled}
										>
											Sign Up
										</Button>
									</Grid>
									<Typography variant="caption" className={ classes.subtitle }>
										Forgot account password? <Link color="primary" href="/password_reset" color="secondary">Reset password</Link>
									</Typography>
								</Grid>
							</form>
						</Paper>
					</div>
				</ThemeProvider>
			</Fragment>
		);
	}
}

const AppClass = withStyles(styles)(SignIn);
ReactDom.render(
	<AppClass />,
	document.getElementById('app')
);
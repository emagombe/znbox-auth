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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

/* MUI Styles */
import { withStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import MUITheme from './theme.jsx';

import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

/* Application theme */
const theme = createMuiTheme(MUITheme);

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


class SignUp extends Component {

	state = {
		agree: false,
		first: null,
		last: null,
		email: null,
		password: null,
		confirm_password: null,
		disabled: false,
		submited: false,
		error_message: null,
		success_message: null,
	};

	componentDidMount() {

	}

	onSubmit_form = (e) => {
		e.preventDefault();

		if(this.state.password == this.state.confirm_password) {

			const form = new FormData();
			form.append('first', this.state.first);
			form.append('last', this.state.last);
			form.append('email', this.state.email);
			form.append('password', this.state.password);

			/* disabling form */
			this.setState({ disabled: true });

			/* Remove error/success message */
			this.setState({ error_message: null });
			this.setState({ success_message: null });

			fetch(`${config.ajax.url}/api/account_create`, {
				method: 'post',
				body: form,
			}).then(res => res.json()).then(data => {

				/* enabling form */
				this.setState({ disabled: false });

				if(data.status == 'exists') {
					this.setState({ error_message: data.message });
				} else if(data.status == 'created') {

					/* Remove check from agree */
					this.setState({ agree: false });

					/* Display message */
					this.setState({ success_message: data.message });
				} else if(data.status == 'error') {
					this.setState({ error_message: data.message });
				} else if(data.status == 'created_confirmed') {
					/* Authentication success */
					localStorage.setItem('_mkssid', data.token);
					window.location.href = '/';
				}				
			}).catch(error => {
				this.setState({ error_message: 'Failed to send request' });
				this.setState({ disabled: false });
			});
		}
	};

	/* Google login */
	handle_google_login = e => {
		const form = new FormData();
		form.append('data', JSON.stringify(e.profileObj));

		fetch(`${config.ajax.url}/api/account_create/external-api`, {
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

	};

	/* Facebook login */
	handle_facebook_login = e => {
		const form = new FormData();
		form.append('data', JSON.stringify(e.profileObj));

		fetch(`${config.ajax.url}/api/account_create/external-api`, {
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
								Musikhalif
							</Typography>
						</Toolbar>
					</AppBar>
					<div className={classes.body}>
						{(this.state.disabled) ? <LinearProgress color="secondary" /> : ""}
						<Paper elevation={3} className={ classes.body_paper }>
							<Fragment>
								<Grid
								  container
								  direction="column"
								  justify="center"
								  alignItems="center"
								>
									<Typography color="primary" variant="h4" className={ classes.title }>
										Create account
									</Typography>
									<Typography variant="subtitle1" className={ classes.subtitle }>
										Host your musics and share to the world
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
														Register with Google
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
														Register with Facebook
													</Button>
												)}
											/>
										</Grid>
									</div>
								</Grid>
								<form 
									className={ classes.form }
									autoComplete="off"
									onSubmit={ e => { this.onSubmit_form(e) }}
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

									{(this.state.success_message) ? (
										<Grid
										  	container
										  	direction="column"
										  	justify="center"
										  	alignItems="center"
										  	style={{
												maxWidth: 600,
												maxHeight: 60,
												borderStyle: 'solid',
												borderColor: 'rgba(6, 181, 0, 0.72)',
												borderRadius: 4,
												backgroundColor: 'rgba(73, 147, 0, 0.11)',
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
												{this.state.success_message}
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
										<Grid
										  container
										  direction="row"
										  justify="space-between"
										  alignItems="center"
										  style={{
										  	marginTop: 10,
										  }}
										  spacing={2}
										>
											<Grid item xs={6}>
												<TextField
													label="First name"
													variant="outlined"
													name="first"
													placeholder="First name"
													margin="normal"
													size="medium"
													type="text"
													required
													fullWidth
													disabled={ this.state.disabled }
													onChange={ e => { this.setState({ first: e.target.value }) }}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextField
													label="Last name"
													variant="outlined"
													name="last"
													placeholder="Last name"
													margin="normal"
													size="medium"
													type="text"
													required
													fullWidth
													disabled={ this.state.disabled }
													onChange={ e => { this.setState({ last: e.target.value }) }}
												/>
											</Grid>
										</Grid>
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
											disabled={ this.state.disabled }
											onChange={ e => { this.setState({ email: e.target.value }) }}
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
											disabled={ this.state.disabled }
											onChange={ e => { this.setState({ password: e.target.value }) }}
										/>
										<TextField
											label="Confirm password"
											variant="outlined"
											name="confirm_password"
											placeholder="Confirm password"
											fullWidth
											margin="normal"
											size="medium"
											type="password"
											required
											disabled={ this.state.disabled }
											helperText={ (this.state.password !== this.state.confirm_password) ? "Passwords do not match" : "" }
					          				error={ this.state.password !== this.state.confirm_password }
											onChange={ e => { this.setState({ confirm_password: e.target.value }) }}
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
														checked={ this.state.agree }
														onChange={ e => { this.setState({ agree: !this.state.agree }) }}
														required
														disabled={ this.state.disabled }
													/>
												}
											/>
											<Typography variant="caption" className={ classes.subtitle }>
												I read and agree with the website <Link href="terms" color="secondary">Terms and conditions</Link>
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
												disabled={ this.state.disabled }
												className={ classes.marginTop }
											>
												Sign Up
											</Button>
											<Typography variant="caption" className={ classes.subtitle }>
												Already have got an account? <Link href="/signin">Sign In</Link>
											</Typography>
										</Grid>
									</Grid>
								</form>
							</Fragment>
						</Paper>
					</div>
				</ThemeProvider>
			</Fragment>
		);
	}
}


const AppClass = withStyles(styles)(SignUp);

ReactDom.render(
	<AppClass />,
	document.getElementById('app')
);
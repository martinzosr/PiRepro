var SongPanel = React.createClass({
	render: function() {
		return (
			<nav className="navbar navbar-fixed-top navbar-inverse bg-inverse">
			  <a className="navbar-brand" href="#">PiRepro</a>
			  <ul className="nav navbar-nav">
				<li className="nav-item active">
				  <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
				</li>
			  </ul>
			  <ul className="nav navbar-nav navbar-right">
				<li className="nav-item">
				<a name="loginButton" className="button" href="#" >Login</a>        
				<div className="popup">
					<form className="form-inline" role="form">
					  <div className="form-group">
						<label htmlFor="username">Username:</label>
						<input type="username" className="form-control" name="username"/>
					  </div>
					  <div className="form-group">
						<label htmlFor="pwd">Password:</label>
						<input type="password" className="form-control" name="password"/>
					  </div>
					  <input type="button" name="login" id="login" className="btn btn-default" value="Submit"/>
					</form>
				</div>
				</li>
				<li id="logoutNavItem" className="nav-item logoutButton">
				  <a id="logoutButton" className="nav-link" href="#">Logout</a>
				</li>
			  </ul>
			</nav>
		);
	}
});


ReactDOM.render(
	<SongPanel/>,
	document.getElementById('navigation')
);

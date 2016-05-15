var NavigationPanel = React.createClass({
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
	<li id="logoutNavItem" className="nav-item logoutButton">
	  <a name="loginButton" className="nav-link" href="#"></a>
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
	<NavigationPanel/>,
	document.getElementById('navigation')
);

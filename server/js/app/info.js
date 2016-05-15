var InfoPanel = React.createClass({
	getInitialState(){
		return ({admin:false});
	},
	checkAdmin(){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/isUserAdmin.php",
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				tthis.setState({admin:true});
			},
			error : function(jqXHR, textStatus, errorThrown) {
			},
			timeout: 120000,
		});
	},
	componentDidMount(){
		this.checkAdmin();
	},
	render: function() {
		if(this.state.admin){
			return (
				<div className="panel panel-default controlPanel">
					<div className="panel-body">
						<div className="row">
							<div className="col-lg-8">
								<SongInfo />
							</div>
							<div className="col-lg-4">
								<CommandButtons />
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="panel panel-default controlPanel">
					<div className="panel-body">
						<div className="row">
							<SongInfo />
						</div>
					</div>
				</div>
			);
		}
	}
});

var CommandButtons = React.createClass({
	render: function(){
		return (
			<div className="btn-group pull-right" role="group">
					<button className="btn btn-default btn-md" > <span className="glyphicon glyphicon-forward" aria-hidden="true"></span> </button>
					<button className="btn btn-default btn-md" > <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> </button>
					<button className="btn btn-default btn-md" > <span className="glyphicon glyphicon-minus" aria-hidden="true"></span> </button>
					<button className="btn btn-default btn-md" > <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>
			</div>
		);
	}
});

var SongInfo = React.createClass({
	render: function(){
		return (
			<h4><marquee><b>Name:</b>Name of the song  <b>Artist:</b> Artist of the song  <b>Duration:</b> 2:23 </marquee></h4>
		);
	}
});


ReactDOM.render(
	<InfoPanel/>,
	document.getElementById('info')
);

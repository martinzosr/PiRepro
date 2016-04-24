var SongPanel = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Songs
				</div>
				<div className="panel-body">
					<SongTable />
				</div>
			</div>
		);
	}
});

var SongTable = React.createClass({
	reload(column, order){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/getSongs.php?column=" + column + "&order=" + order,
			type: "GET",
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				var res = JSON.parse(resultData);
				tthis.setState({data:res});
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			},
			timeout: 120000,
		});
	},
	getInitialState(){
		var cols = [["SO_Id"],["SO_Name", "Name"],["SO_TrackNumber"],["SO_Duration","Duration"],["AR_Name","Artist"],["AL_Name","Album"],["AL_DiscNumber"],["AL_Year", "Year"],["GE_Name","Gender"]];
		this.reload("","");
		return ({data:[], columns:cols});
	},
	handlePlaylistChange(column, order){
		this.reload(column, order);
	},
	render: function(){
		return (
			<table className="table table-striped">
				<SongHeaders columns={this.state.columns}/>
				<SongLines data={this.state.data} />
			</table>
		)
	}
});

var SongLines = React.createClass({
	render: function() {
		console.log(this.props.data);
		if(this.props.data==[]){
			return (<div>loading</div>);
		}
		return (
			<tbody>
				{this.props.data.map(function(song){
					return (
						<tr>
							<td>{song.SO_Name}</td><td>{secondsToTime(song.SO_Duration)}</td><td>{song.AR_Name }</td><td>{song.AL_Name }</td><td>{song.AL_Year }</td><td>{song.GE_Name}</td><td><a className="btn btn-default btn-xs" href="#">+</a></td>
						</tr>
					);
				})}
			</tbody>
		);
	}
});

var SongHeaders = React.createClass({
	render: function() {
		return (
			<thead>
				<tr>
					{this.props.columns.map(function(col){
						if(col.length == 2){
							return (<th> {col[1]} </th>);
						}
					})}
				</tr>
			</thead>
		);
	}
});

ReactDOM.render(
	<SongPanel/>,
	document.getElementById('content')
);

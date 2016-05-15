var UserPlaylist = React.createClass({
	songRemove(songId){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/removeSongFromPlaylist.php?songId=" + songId,
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				tthis.props.reload(tthis.props.activeId);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			},
			timeout: 120000,
		});
	},
	songUp(songId){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/changeSongPriorityUp.php?songId=" + songId,
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				tthis.props.reload(tthis.props.activeId);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			},
			timeout: 120000,
		});
	},
	songDown(songId){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/changeSongPriorityDown.php?songId=" + songId,
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				tthis.props.reload(tthis.props.activeId);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			},
			timeout: 120000,
		});
	},
	render: function() {
		if(this.props.data==[]){
			return (<div>loading</div>);
		}
		var tthis = this;
		return (
			<ul className="list-group">
				{this.props.data.map(function(song){
					let boundup = tthis.songDown.bind(null, song.SO_Id);
					let bounddown = tthis.songUp.bind(null, song.SO_Id);
					let boundremove = tthis.songRemove.bind(null, song.SO_Id);
					return (
						<div className="list-group-item">
							<a href={song.SO_Id}>
								{song.SO_Name}
							</a>
							<button className="btn btn-default btn-xs pull-right" onClick={boundup}> <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span> </button>
							<button className="btn btn-default btn-xs pull-right" onClick={bounddown}> <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span> </button>
							<button className="btn btn-default btn-xs pull-right" onClick={boundremove}> <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>
							<span className="badge">
								{secondsToTime(song.SO_Duration)}
							</span>
						</div>
					)
				})}
			</ul>
		);
	}
});


var PlaylistPanel = React.createClass({
	reload(id){
		var tthis = this;
		if(!!id){
			tthis.setState({activeId:id});
			jQuery.ajax({
				url: "/backend/getPlaylistInfo.php?id=" + id,
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
		} else {
			this.setState({data:[]});
		}
	},
	reloadWithoutId(){
		this.reload(this.state.activeId);
	},
	getInitialState(){
		return ({data:[]});
	},
	handlePlaylistChange(id){
		this.reload(id);
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Playlists
				</div>
				<div className="panel-body">
					<ChoosePlaylist handleChange={this.handlePlaylistChange}/>
					<UserPlaylist reload={this.reload} activeId={this.state.activeId} data={this.state.data}/>
				</div>
			</div>
		);
	}
});


var ChoosePlaylist = React.createClass({
	loadPlaylists(){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/getPlaylists.php",
			type: "POST",
			headers: {"tokken":localStorage.getItem("tokken")},
			success: function(resultData) {
				var res = JSON.parse(resultData);
				tthis.setState({playlists: res});
				tthis.setButtonName();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown+" "+textStatus);
			},
			timeout: 120000,
		});
	},
	add(){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/addPlaylist.php?name=" + $('input[name="playlistName"]').val(),
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			success: function(resultData) {
				/*var res = JSON.parse(resultData);
				var actual = tthis.getActualPlaylist(res);
				tthis.setState({showModal: tthis.state.showModal, playlists:res});
				console.log("playlist added");*/
				tthis.loadPlaylists();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown+" "+textStatus);
			},
			timeout: 120000,
		});
		this.close();
	},
	changeActive(id){
		var tthis = this;
		this.setState({activeId: id});
		jQuery.ajax({
			url: "/backend/changeActivePlaylist.php?id="+id,
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			success: function(resultData) {
				var res = JSON.parse(resultData);
				tthis.setState({playlists: res});
				tthis.setButtonName();
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown+" "+textStatus);
			},
			timeout: 120000,
		});
	},
	getButtonNamea: function(playlists){
		for (var i = 0; i < playlists.length; i++){
			if(playlists[i].PL_Actual == "1"){
				return playlists[i].PL_Name;
			}
		}
		return "Add Playlist";
	},
	setButtonName: function(){
		if(!this.state){
			return this.setState({activeName: "Add Playlist"});
		}
		for (var i = 0; i < this.state.playlists.length; i++){
			if(this.state.playlists[i].PL_Actual == 1){
				this.setState({activeId: this.state.playlists[i].PL_Id, activeName: this.state.playlists[i].PL_Name});
				this.props.handleChange(this.state.activeId);
				return;
			}
		}
		return this.setState({activeName: "Add Playlist"});
	},
	getInitialState() {
		this.loadPlaylists();
		return { showModal: false, playlists: []};
	},
	close() {
		this.setState({ showModal: false, playlists: this.state.playlists, activeId: this.state.activeId, activeName: this.state.activeName});
	},
	open() {
		this.setState({ showModal: true, playlists: this.state.playlists, activeId: this.state.activeId, activeName: this.state.activeName });
	},
	deleteActive(){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/deleteActivePlaylist.php",
			type: "GET",
			headers: {"tokken":localStorage.getItem("tokken")},
			success: function(resultData) {
				tthis.loadPlaylists();
				tthis.props.handleChange(null);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown+" "+textStatus);
			},
			timeout: 120000,
		});
	},
	render: function() {
        var ButtonGroup = ReactBootstrap.ButtonGroup;
        var Button  = ReactBootstrap.Button;
	var Modal = ReactBootstrap.Modal;
		var tthis = this;
		return (
			<div>
				<div className="btn-group">
					<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {this.state.activeName}
						<span className="caret"></span>
					</button>
					<ul className="dropdown-menu">
						{this.state.playlists.map(
							function(playlist){
								let boundChangeActive = tthis.changeActive.bind(null, playlist.PL_Id);
								return (<li><a href="#" onClick={boundChangeActive}>{playlist.PL_Name}</a></li>);
							}
						)}
						<li role="separator" className="divider"></li>
						<li><a href="#" onClick={this.open} >New playlist</a></li>
					</ul>
				</div>
					<button type="button" onClick={this.deleteActive} className="btn btn-default pull-right"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Add Playlist</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Name:</h4>
						<div className="input-group">
							<input className="form-control" type="text" name="playlistName" placeholder="Playlist name"/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
						<Button onClick={this.add}>Save</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
});


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////SONG PANEL
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

var SongPanel = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					Songs
				</div>
				<div className="panel-body">
					<SongTable reload={this.props.reload}/>
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
				<SongLines data={this.state.data} reload={this.props.reload}/>
			</table>
		)
	}
});

var SongLines = React.createClass({
	addToPlaylist: function(songId){
		if(!!localStorage.getItem("actualPlaylistId")){
			var tthis = this;
			jQuery.ajax({
				url: "/backend/addSongToPlaylist.php?&songId=" + songId,
				type: "GET",
				contentType: 'application/json; charset=utf-8',
				headers: {"tokken":localStorage.getItem("tokken")},
				success: function(resultData) {
					tthis.props.reload();
				},
				error : function(jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
				},
				timeout: 120000,
			});
		}
	},
	render: function() {
		var tthis = this;
		console.log(this.props.data);
		if(this.props.data==[]){
			return (<div>loading</div>);
		}
		return (
			<tbody>
				{this.props.data.map(function(song){
					let boundAdd = tthis.addToPlaylist.bind(null, song.SO_Id);
					return (
						<tr>
							<td>{song.SO_Name}</td><td>{secondsToTime(song.SO_Duration)}</td><td>{song.AR_Name }</td><td>{song.AL_Name }</td><td>{song.AL_Year }</td><td>{song.GE_Name}</td><td><a className="btn btn-default btn-xs" onClick={boundAdd} href="#">+</a></td>
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






var PlaylistsSongs = React.createClass({
	reload(){
		this.refs.PlaylistPanel.reloadWithoutId();
	},
	getInitialState(){
		return ({foo:1});
	},
	render: function() {
		return (
		  <div className="row">
			<div className="col-lg-4">
				<PlaylistPanel ref='PlaylistPanel'/>
			</div>
			<div className="col-lg-8">
				<SongPanel reload={this.reload}/>
			</div>
		  </div>
		);
	}
});







ReactDOM.render(
	<PlaylistsSongs/>,
	document.getElementById('content')
);



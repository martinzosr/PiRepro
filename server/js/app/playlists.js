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
		console.log("RELOAD PLAULISTT");
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
				console.log("success");
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

ReactDOM.render(
	<PlaylistPanel />,
	document.getElementById('playlistPanel')
);

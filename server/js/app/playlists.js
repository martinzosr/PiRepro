var UserPlaylist = React.createClass({
	render: function() {
		console.log((typeof this.props.data) + (typeof []));
		if(this.props.data==[]){
			return (<div>loading</div>);
		}
		return (
			<ul className="list-group">
				{this.props.data.map(function(song){
					return (
						<div className="list-group-item">
							<a href={song.SO_Id}>
								{song.SO_Name}
							</a>
							<button className="btn btn-default btn-xs pull-right"> <span className="glyphicon glyphicon-menu-up" aria-hidden="true"></span> </button>
							<button className="btn btn-default btn-xs pull-right"> <span className="glyphicon glyphicon-menu-down" aria-hidden="true"></span> </button>
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
					<UserPlaylist data={this.state.data}/>
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
				var res = JSON.parse(resultData);
				var actual = getActualPlaylist(res);
				tthis.setState({showModal: tthis.state.showModal, playlists:res});
				console.log("playlist added");
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

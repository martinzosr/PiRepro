var Profile = React.createClass({
	render: function() {
		var tthis = this;
		var name = localStorage.getItem("username");
		return (
			<div>
				<NamePassword name={name}/>
				<AllRatings />
			</div>
		);
	}
});

var AllRatings = React.createClass({
	rows: {},
	submitData(){
		var data = {};
		data["data"] = this.rows
		console.log(JSON.stringify(data));
		jQuery.ajax({
			url: "/backend/changeGenderPreferences.php",
			type: "POST",
			data: JSON.stringify(data),
			headers: {"tokken":localStorage.getItem("tokken")},
			success: function(resultData) {
				console.log(resultData);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown+" "+textStatus);
			},
			timeout: 120000,
		});
	},
	changeRow(idR, id, val){
		this.rows[idR] = {};
		this.rows[idR].id = id;
		this.rows[idR].val = val;
		console.log(this.rows);
	},
	reload(){
		var tthis = this;
		jQuery.ajax({
			url: "/backend/getGenderList.php",
			type: "GET",
			contentType: 'application/json; charset=utf-8',
			success: function(resultData) {
				var res = JSON.parse(resultData);
				tthis.setState({genders:res});
			},
			error : function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
			},
			timeout: 120000,
		});
	},
	getInitialState(){
		this.reload();
		return ({genders:[]});
	},
	render(){
		return (
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">Category</div>
					<div className="panel-body">
						<RowRating changeRow={this.changeRow} genders={this.state.genders} id={1}/>
						<hr />
						<RowRating changeRow={this.changeRow} genders={this.state.genders} id={2}/>
						<hr />
						<RowRating changeRow={this.changeRow} genders={this.state.genders} id={3}/>
						<hr />
						<RowRating changeRow={this.changeRow} genders={this.state.genders} id={4}/>
						<hr />
						<RowRating changeRow={this.changeRow} genders={this.state.genders} id={5}/>
						<div className="row">
							<button onClick={this.submitData} type="submit" className="btn btn-default pull-right" name="changePassword" id="changePassword">Change password</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var RowRating = React.createClass({
	id: null,
	rating: 3,
	changeId(i){
		this.id = i;
		console.log(this.id + ":" + this.rating);
		this.props.changeRow(this.props.id, this.id, this.rating);
	},
	changeRating(i){
		this.rating = i;
		console.log(this.id + ":" + this.rating);
		this.props.changeRow(this.props.id, this.id, this.rating);
	},
	render(){
		return (
			<div className="row">
				<div className="col-md-6">
					<Dropdown changeId={this.changeId} genders={this.props.genders}/>
				</div>
				<div className="col-md-6">
					<Rating changeRating={this.changeRating} id={this.props.id}/>
				</div>
			</div>
		);
	}
});

var Dropdown = React.createClass({
	getInitialState(){
		return ({genderId:null});
	},
	getChoosenName(id){
		if(!this.state.genderId){
			return "Choose category";
		}
		for (var i = 0; i < this.props.genders.length; i++) { 
			if(this.props.genders[i].Id == id){
				return this.props.genders[i].Name;
			}
		}
		return "Choose category";
	},
	changeGender(id){
		this.props.changeId(id);
		this.setState({genderId:id});
	},
	render: function() {
		var tthis = this;
		var chooseName = this.getChoosenName(this.state.genderId);
		var boundNull = this.changeGender.bind(null, null);
		return (
			<div className="dropdown">
				<button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					{chooseName}
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
					{this.props.genders.map(function(gender){
						let bound = tthis.changeGender.bind(null, gender.Id);
						return (<li><a onClick={bound} href="#">{gender.Name}</a></li>)
					})}
					<li role="separator" className="divider"></li>
					<li><a onClick={boundNull} href="#">None</a></li>
				</ul>
			</div>
		);
	}
});

var Rating = React.createClass({	
	getId(){
		return "input-id" + this.props.id;
	},
	componentDidMount(){
		var tthis = this;
		var id = "#" + this.getId();
		$(id).rating({'size':'sm'});
		$(id).on("rating.change", function(a,r){tthis.props.changeRating(r);}); 
	},
	render: function(){
		var id = this.getId();
		return (
			<div>
			<input id={id} type="text" data-size="sm" />
			</div>
		);
	}
});

var NamePassword = React.createClass({
	render:function(){
		return(
			<div className="col-md-12">
				<div className="panel panel-default">
					<div className="panel-heading">SIGN IN</div>
					<div className="panel-body">
						<form>
							<div className="col-lg-12">
								<div className="row">
									<div className="form-group">                             
										<label>User name:</label>                                 
										<input type="text" value={this.props.name} className="form-control" name="username" disabled />
									</div>
								</div>
								<div className="row">
									<div className="form-group">                             
										<label>Change password</label>                                   
										<input type="password" placeholder="Password" className="form-control" name="password"/>                     
										<input type="repeatPassword" placeholder="Repeat password" className="form-control" name="password"/>                     
									</div>
								</div>
								<div className="row">
									<button type="submit" className="btn btn-default pull-right" name="changePassword" id="changePassword">Change password</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<Profile />,
	document.getElementById('content')
);

